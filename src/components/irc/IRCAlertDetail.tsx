import { useState, useEffect, useCallback } from 'react';
import { IRCAlert, SimulationScenario, WorkflowStep } from '@/lib/ircAlertData';
import {
  ArrowLeft, AlertTriangle, Brain, Play, Zap, GitBranch, FileText, MessageSquareWarning,
  CheckCircle, Clock, XCircle, Loader2, Shield, Target, Activity, Minus, X,
  Server, MapPin, DollarSign, ChevronRight, Pause, Users, UserCheck, Building2, Headphones, PhoneCall, PhoneForwarded, UserPlus, CircleDotDashed,
  TrendingUp, Eye, ArrowRight, BarChart3, RotateCcw, ScrollText, Download, Copy, AlertOctagon, ShieldAlert, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useWarRoom, ParticipantStatus, ParticipantType, WarRoomParticipant } from '@/hooks/useWarRoom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ResolvedMetrics {
  mttr: string;
  revenueProtected: string;
  transactionsRecovered: number;
  serviceRestoration: number;
}

interface IRCAlertDetailProps {
  alert: IRCAlert;
  onBack: () => void;
  onStatusUpdate?: (alertId: string, newStatus: string, metrics?: ResolvedMetrics) => void;
}

interface ExecutionAgent {
  name: string;
  status: 'idle' | 'active' | 'completed';
  currentTask: string;
  progress: number;
}

// Activity Log Types
interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  category: 'overview' | 'ai' | 'decision' | 'execution' | 'impact' | 'system' | 'override';
  action: string;
  details?: string;
  actor: 'user' | 'helios' | 'system';
  severity: 'info' | 'warning' | 'success' | 'error';
}

const phaseLabels = {
  situation: '1. Situation',
  detection: '2. Detection',
  decision: '3. Decision',
  action: '4. Action',
  resolution: '5. Resolution',
};

const statusIcons = {
  completed: <CheckCircle className="h-3 w-3 text-success" />,
  'in-progress': <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />,
  pending: <Clock className="h-3 w-3 text-muted-foreground" />,
  blocked: <XCircle className="h-3 w-3 text-error" />,
};

const riskColors = {
  low: 'text-muted-foreground border-border/30 bg-muted/10',
  medium: 'text-muted-foreground border-border/50 bg-muted/20',
  high: 'text-error border-error/30 bg-error/10',
};

const categoryIcons = {
  overview: <FileText className="h-3 w-3" />,
  ai: <Brain className="h-3 w-3" />,
  decision: <Target className="h-3 w-3" />,
  execution: <Zap className="h-3 w-3" />,
  impact: <TrendingUp className="h-3 w-3" />,
  system: <Settings2 className="h-3 w-3" />,
  override: <AlertOctagon className="h-3 w-3" />,
};

const categoryColors = {
  overview: 'bg-blue-500/20 text-blue-400',
  ai: 'bg-purple-500/20 text-purple-400',
  decision: 'bg-amber-500/20 text-amber-400',
  execution: 'bg-emerald-500/20 text-emerald-400',
  impact: 'bg-cyan-500/20 text-cyan-400',
  system: 'bg-slate-500/20 text-slate-400',
  override: 'bg-red-500/20 text-red-400',
};

// AI Strategy details with deep dive info
const aiStrategyDetails: Record<string, {
  title: string;
  confidence: number;
  howItWorks: string;
  resolutionPath: string[];
  estimatedImpact: string;
  riskMitigation: string;
}> = {
  'Execute immediate failover to US-West-2 - 94.7% historical success rate for AZ-level outages': {
    title: 'Full Regional Failover',
    confidence: 87.3,
    howItWorks: 'Route 53 Application Recovery Controller triggers coordinated failover across all services. Aurora Global Database promotes US-West-2 read replica to primary writer (RTO <60s, RPO 0). ALB target groups update to US-West-2 ECS tasks. CloudFront origins switch to Oregon edge locations.',
    resolutionPath: [
      'Route 53 ARC initiates failover sequence',
      'Aurora Global DB promotes replica (45-60s)',
      'ECS services register with new ALB targets (2-3min)',
      'Health checks validate endpoint availability',
      'DNS TTL expiration completes traffic shift',
      'Monitor for 5 minutes post-failover'
    ],
    estimatedImpact: 'Full service restoration within 15 minutes. Expected to recover 96.7% of failed transactions.',
    riskMitigation: 'Automatic rollback triggers if health checks fail. Database sync verified before traffic switch.'
  },
  'Prioritize EU-West-1 traffic routing first (currently €1.2M/hour peak) before AP-Southeast-1 (¥890K/hour)': {
    title: 'Prioritized EU/APAC Traffic Steering',
    confidence: 94.6,
    howItWorks: 'Route 53 weighted routing policies redirect EU traffic to EU-Central-1 (Frankfurt) and APAC traffic to AP-Northeast-1 (Tokyo). US-East-1 traffic gets rate-limited to 30% capacity via ALB rules. Preserves revenue in peak regions while minimizing impact during US off-peak.',
    resolutionPath: [
      'Update Route 53 weighted policies (EU: 100% → Frankfurt)',
      'Apply ALB rate limiting rules for US traffic',
      'Scale EU-Central-1 and AP-Northeast-1 by 200%',
      'Monitor latency and error rates per region',
      'Gradual US traffic migration after EU/APAC stable',
      'Full failover if US-East-1 degrades further'
    ],
    estimatedImpact: 'EU recovery in 8 minutes, APAC in 11 minutes. Revenue protection: €1.2M saved.',
    riskMitigation: 'Regional isolation prevents cascade failures. Independent rollback per region.'
  },
  'Pre-scale US-West-2 ECS services by 340% based on incoming traffic redistribution': {
    title: 'Proactive ECS Auto-Scaling',
    confidence: 91.8,
    howItWorks: 'Pre-emptively scale ECS Fargate tasks in US-West-2 before traffic arrives. Uses predictive scaling based on current US-East-1 traffic patterns. Prevents cold-start latency and ensures capacity is ready when DNS failover completes.',
    resolutionPath: [
      'Calculate required capacity from US-East-1 metrics',
      'Provision ECS tasks (current × 3.4)',
      'Pre-warm application caches',
      'Update service discovery endpoints',
      'Enable enhanced health checks',
      'Monitor task registration status'
    ],
    estimatedImpact: 'Zero cold-start delays during failover. Capacity ready within 4 minutes.',
    riskMitigation: 'Auto-scaling policies set to handle unexpected load. Circuit breakers active.'
  },
  'Enable Route 53 Application Recovery Controller for coordinated multi-service failover': {
    title: 'Route 53 ARC Orchestration',
    confidence: 89.4,
    howItWorks: 'AWS Route 53 Application Recovery Controller provides single-action failover across all application components. Ensures DNS, ALB, Aurora, and ElastiCache fail over in coordinated sequence with dependency-aware ordering.',
    resolutionPath: [
      'Activate Route 53 ARC recovery group',
      'Verify readiness checks pass for all cells',
      'Execute coordinated failover action',
      'Monitor routing control state changes',
      'Validate traffic shifting to DR region',
      'Confirm all services healthy in target region'
    ],
    estimatedImpact: 'Single-action failover reduces coordination time by 67%. RTO under 2 minutes.',
    riskMitigation: 'Readiness checks prevent failover to unhealthy regions. Rollback available within 60s.'
  },
  'Extend Aurora connection timeout from 30s to 120s during Global Database promotion': {
    title: 'Aurora Connection Pool Optimization',
    confidence: 83.7,
    howItWorks: 'During Aurora Global Database promotion, connections experience 45-90 second latency spikes. Extending pool timeout prevents connection drops and retry storms that can overwhelm newly promoted primary.',
    resolutionPath: [
      'Update RDS proxy connection timeout to 120s',
      'Modify application connection pool settings',
      'Enable connection keep-alive optimization',
      'Activate query queuing for overflow',
      'Monitor connection pool utilization',
      'Restore normal timeouts after stabilization'
    ],
    estimatedImpact: 'Prevents 23% of transaction failures during Global DB promotion window.',
    riskMitigation: 'Automatic timeout restoration after stability confirmed. Pool exhaustion alerts active.'
  },
  'Implement adaptive rate limiting based on user behavior patterns': {
    title: 'Adaptive Rate Limiting',
    confidence: 87.4,
    howItWorks: 'Machine learning-based rate limiting that distinguishes legitimate users from attack traffic based on behavioral patterns, reducing false positives while blocking malicious requests.',
    resolutionPath: [
      'Deploy ML-based traffic classifier',
      'Analyze request patterns in real-time',
      'Apply graduated rate limits by risk score',
      'Whitelist known legitimate traffic patterns',
      'Block high-confidence malicious requests',
      'Continuously update behavioral models'
    ],
    estimatedImpact: 'Reduces false positive blocks by 89%. Attack mitigation within 2 minutes.',
    riskMitigation: 'Fallback to static rules if ML confidence drops. Manual override available.'
  },
  'Pre-authorize geo-blocking for known high-risk countries during attacks': {
    title: 'Pre-Authorized Geo-Blocking',
    confidence: 93.8,
    howItWorks: 'Pre-approved geo-blocking rules for known attack source countries, eliminating the 2-hour legal review delay during active attacks. GDPR-compliant with documented exceptions.',
    resolutionPath: [
      'Activate pre-approved geo-block rules',
      'Block traffic from top 5 attack source countries',
      'Log all blocked requests for audit',
      'Notify affected legitimate users via email',
      'Monitor attack traffic reduction',
      'Prepare removal plan post-attack'
    ],
    estimatedImpact: 'Immediate 73% reduction in attack traffic. Legal review time eliminated.',
    riskMitigation: 'VPN access maintained for legitimate users. Temporary blocks auto-expire in 24 hours.'
  },
  'Deploy additional authentication pods in anticipation of attack escalation': {
    title: 'Proactive Auth Capacity',
    confidence: 85.9,
    howItWorks: 'Scale authentication infrastructure by 500% before attack escalation, based on observed botnet behavior patterns that typically show 3x traffic increase 15-20 minutes after initial attack.',
    resolutionPath: [
      'Provision additional auth pods (5x current)',
      'Distribute pods across multiple availability zones',
      'Update load balancer configurations',
      'Pre-warm authentication caches',
      'Enable enhanced logging for forensics',
      'Activate backup identity providers'
    ],
    estimatedImpact: 'Auth success rate maintained above 97% during peak attack.',
    riskMitigation: 'Auto-scaling prevents over-provisioning costs. Pods auto-terminate post-attack.'
  },
  'Schedule batch operations during low-traffic windows (2-5 AM UTC)': {
    title: 'Batch Operation Scheduling',
    confidence: 97.2,
    howItWorks: 'Reschedule resource-intensive batch operations to 2-5 AM UTC when system load is 78% lower, preventing replication lag during peak business hours.',
    resolutionPath: [
      'Analyze current batch operation schedule',
      'Identify movable operations',
      'Reschedule to 2-5 AM UTC window',
      'Update job scheduling configurations',
      'Monitor replication lag trends',
      'Validate batch completion times'
    ],
    estimatedImpact: 'Replication lag reduced by 89% during business hours.',
    riskMitigation: 'Batch monitoring ensures completion before peak hours. Failsafe delays for long-running jobs.'
  },
  'Implement write-ahead log compression to reduce replication bandwidth': {
    title: 'WAL Compression Strategy',
    confidence: 91.5,
    howItWorks: 'Enable write-ahead log compression to reduce replication bandwidth by up to 60%, allowing replicas to keep up during high-write periods without increasing network infrastructure.',
    resolutionPath: [
      'Enable WAL compression on primary',
      'Update replica configurations',
      'Monitor compression ratios',
      'Validate replication consistency',
      'Tune compression levels for optimal balance',
      'Document performance improvements'
    ],
    estimatedImpact: 'Replication bandwidth reduced by 60%. Lag reduced from 23s to under 500ms.',
    riskMitigation: 'Gradual rollout across replicas. CPU overhead monitored.'
  },
  'Pre-provision additional capacity before marketing campaigns': {
    title: 'Campaign Capacity Planning',
    confidence: 94.6,
    howItWorks: 'Integration with marketing calendar to automatically scale infrastructure 24 hours before major campaigns, preventing capacity-related incidents during high-visibility events.',
    resolutionPath: [
      'Sync with marketing campaign calendar',
      'Analyze historical campaign traffic patterns',
      'Calculate required capacity increase',
      'Pre-provision infrastructure 24h in advance',
      'Run load tests on scaled infrastructure',
      'Monitor during campaign execution'
    ],
    estimatedImpact: 'Zero capacity-related incidents during campaigns. 99.99% uptime maintained.',
    riskMitigation: 'Automated scaling based on real-time metrics. Fallback to manual scaling available.'
  },
  'Implement automated DNS validation for all certificate renewals': {
    title: 'Automated DNS Validation',
    confidence: 98.7,
    howItWorks: 'Fully automated DNS validation for SSL certificate renewals across all domains, eliminating manual intervention and preventing renewal failures due to missing DNS records.',
    resolutionPath: [
      'Deploy automated DNS management integration',
      'Configure validation record templates',
      'Test automation with non-production certs',
      'Enable for all production domains',
      'Monitor renewal success rates',
      'Alert on validation failures'
    ],
    estimatedImpact: 'Certificate renewal success rate increases to 99.9%. Zero manual intervention required.',
    riskMitigation: 'Fallback to manual renewal if automation fails. 30-day advance warnings maintained.'
  },
  'Migrate to wildcard certificates to reduce management overhead': {
    title: 'Wildcard Certificate Migration',
    confidence: 95.3,
    howItWorks: 'Consolidate 47 individual domain certificates into 5 wildcard certificates, reducing management overhead by 90% and simplifying renewal processes.',
    resolutionPath: [
      'Audit current certificate inventory',
      'Group domains by wildcard eligibility',
      'Generate new wildcard certificates',
      'Plan staged migration schedule',
      'Update server configurations',
      'Decommission old certificates'
    ],
    estimatedImpact: 'Certificate count reduced from 47 to 5. Management time reduced by 90%.',
    riskMitigation: 'Staged migration with rollback capability. Testing in staging environment first.'
  },
  'Configure 45-day advance renewal to allow for validation issues': {
    title: 'Extended Renewal Window',
    confidence: 99.1,
    howItWorks: 'Extend certificate renewal initiation from 30 to 45 days, providing additional buffer for resolving DNS validation issues or other renewal blockers.',
    resolutionPath: [
      'Update renewal automation settings',
      'Configure 45-day advance renewal trigger',
      'Set up multi-stage reminder alerts',
      'Document escalation procedures',
      'Train team on extended timeline',
      'Monitor renewal metrics'
    ],
    estimatedImpact: 'Zero certificate expiration incidents. 100% renewal success rate.',
    riskMitigation: 'Multiple reminder stages at 45, 30, 14, and 7 days. Escalation to management at 7 days.'
  }
};

// Simulation-specific actions mapping
const simulationActions: Record<string, { automated: string[], human: string[] }> = {
  'SIM-001': {
    automated: [
      'Initiating full traffic migration to US-West-2',
      'Spinning up 847 redundant containers',
      'Updating DNS records globally',
      'Promoting database read replicas',
      'Invalidating CDN cache'
    ],
    human: [
      'Monitor failover progress dashboard',
      'Verify payment gateway connectivity',
      'Confirm customer transaction recovery',
      'Update status page for customers'
    ]
  },
  'SIM-002': {
    automated: [
      'Migrating EU traffic to secondary region',
      'Migrating APAC traffic to secondary region',
      'Maintaining US traffic on degraded primary',
      'Adjusting load balancer weights'
    ],
    human: [
      'Monitor regional latency metrics',
      'Coordinate with regional support teams',
      'Prepare rollback procedure if needed'
    ]
  },
  'SIM-003': {
    automated: [
      'Enabling enhanced monitoring mode',
      'Setting up AWS status page alerts',
      'Preparing failover scripts for quick activation'
    ],
    human: [
      'Monitor AWS status updates',
      'Prepare customer communication',
      'Be ready to escalate if ETA exceeds threshold'
    ]
  }
};

interface SimulationStep {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
  duration: number;
}

const allParticipants: WarRoomParticipant[] = [
  // Approval Chain
  { id: 'approver-1', name: 'Alex Chen', role: 'Senior DevOps Engineer', type: 'approval', status: 'pending' },
  { id: 'approver-2', name: 'Sarah Mitchell', role: 'Director of Operations', type: 'approval', status: 'pending' },
  { id: 'approver-3', name: 'Michael Torres', role: 'VP of Infrastructure', type: 'approval', status: 'pending' },
  // Team Coordination
  { id: 'coord-1', name: 'David Kim', role: 'Engineering Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-2', name: 'Emily Watson', role: 'Customer Success Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-3', name: 'Robert Chen', role: 'Finance Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-4', name: 'Lisa Park', role: 'Security Lead', type: 'coordination', status: 'pending' },
];

const typeConfig = {
  approval: { name: 'Approval Chain', icon: <UserCheck className="h-3 w-3" /> },
  coordination: { name: 'Team Coordination', icon: <Users className="h-3 w-3" /> },
};

const statusConfig: Record<ParticipantStatus, { text: string; icon: JSX.Element; color: string }> = {
  pending: { text: 'Standby', icon: <CircleDotDashed className="h-2.5 w-2.5" />, color: 'bg-muted/80 border-muted-foreground/20' },
  calling: { text: 'Calling...', icon: <PhoneCall className="h-2.5 w-2.5 animate-pulse" />, color: 'bg-muted/50 text-foreground border-border' },
  joining: { text: 'Joining...', icon: <PhoneForwarded className="h-2.5 w-2.5" />, color: 'bg-muted/50 text-foreground border-border' },
  joined: { text: 'Joined', icon: <CheckCircle className="h-2.5 w-2.5" />, color: 'bg-success/10 text-success border-success/30' },
};

export function IRCAlertDetail({ alert, onBack, onStatusUpdate }: IRCAlertDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [workflowTriggered, setWorkflowTriggered] = useState(false);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);

  // New states for enhanced functionality
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showSimulationResults, setShowSimulationResults] = useState(false);
  const [executionActive, setExecutionActive] = useState(false);
  const [executionAgents, setExecutionAgents] = useState<ExecutionAgent[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [impactMetrics, setImpactMetrics] = useState<any>(null);
  const [warRoomSimulationResults, setWarRoomSimulationResults] = useState<any>(null);

  // Per-strategy simulation results
  const [perStrategyResults, setPerStrategyResults] = useState<Record<string, {
    simulated: boolean;
    successProbability: number;
    estimatedTime: string;
    recoveryRate: string;
    riskLevel: string;
  }>>({});
  const [simulatingStrategy, setSimulatingStrategy] = useState<string | null>(null);
  const [appliedStrategies, setAppliedStrategies] = useState<string[]>([]);
  const [finalizedStrategies, setFinalizedStrategies] = useState<{
    strategies: string[];
    combinedResult: any;
    individualResults: Record<string, any>;
    appliedAt: Date;
  } | null>(null);

  // Multi-strategy combined simulation
  const [combinedSimulationResult, setCombinedSimulationResult] = useState<{
    strategies: string[];
    combinedSuccess: number;
    combinedTime: string;
    combinedRecovery: string;
    overallRisk: string;
    synergies: string[];
  } | null>(null);
  const [isSimulatingCombined, setIsSimulatingCombined] = useState(false);

  // Activity Log state
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  // Resolution states
  const [resolutionComplete, setResolutionComplete] = useState(alert.status === 'resolved');
  const [alertStatus, setAlertStatus] = useState(alert.status);

  // Report Dialog
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Override data states
  const [overrideData, setOverrideData] = useState<{
    priorityEscalated: boolean;
    strategyOverridden: boolean;
    approvalBypassed: boolean;
    resourcesAllocated: boolean;
    slaAcknowledged: boolean;
    overrideHistory: Array<{ type: string; justification: string; timestamp: Date }>;
  }>({
    priorityEscalated: false,
    strategyOverridden: false,
    approvalBypassed: false,
    resourcesAllocated: false,
    slaAcknowledged: false,
    overrideHistory: []
  });

  // Override Dialog
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [overrideType, setOverrideType] = useState<string>('priority');
  const [overrideJustification, setOverrideJustification] = useState('');

  const {
    isOpen: warRoomOpen,
    isMinimized: warRoomMinimized,
    setIsMinimized: setWarRoomMinimized,
    closeDialog: closeWarRoomDialog,
    participants,
    isActive: warRoomActive,
    assemblyTime: decisionTime,
    isAssembling,
    newMemberName,
    newMemberRole,
    heliosTypingIndex,
    log: warRoomLog,
    HELIOS_ACTIONS,
    initiate: initiateWarRoom,
    ...warRoomActions
  } = useWarRoom();

  // Add activity log entry helper
  const addActivityLog = useCallback((
    category: ActivityLogEntry['category'],
    action: string,
    details?: string,
    actor: ActivityLogEntry['actor'] = 'system',
    severity: ActivityLogEntry['severity'] = 'info'
  ) => {
    const entry: ActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      category,
      action,
      details,
      actor,
      severity
    };
    setActivityLog(prev => [...prev, entry]);
  }, []);

  // Initialize activity log on component mount
  useEffect(() => {
    addActivityLog('system', 'Alert Detail Opened', `Viewing incident ${alert.id}: ${alert.title}`, 'user', 'info');
  }, [alert.id, alert.title, addActivityLog]);

  // Log tab changes
  useEffect(() => {
    if (activeTab) {
      addActivityLog(activeTab as ActivityLogEntry['category'], `Switched to ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab`, undefined, 'user', 'info');
    }
  }, [activeTab, addActivityLog]);

  const handleTakeAction = (action: string) => {
    setActionsTaken(prev => [...prev, action]);
    addActivityLog('decision', `Action Initiated: ${action}`, undefined, 'user', 'success');
    toast.success(`Action initiated: ${action}`);
  };

  const handleStrategyToggle = (strategy: string) => {
    setSelectedStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const handleDeepDive = (strategy: string) => {
    setSelectedStrategy(strategy);
    setDeepDiveOpen(true);
    addActivityLog('ai', `Viewed Strategy Deep Dive`, getStrategyDetails(strategy).title, 'user', 'info');
  };

  // Simulate a single strategy
  const handleSimulateSingleStrategy = async (strategy: string) => {
    if (simulatingStrategy) return;

    setSimulatingStrategy(strategy);
    const strategyTitle = getStrategyDetails(strategy).title;
    addActivityLog('decision', `Simulation Started`, strategyTitle, 'helios', 'info');
    toast.info(`Simulating: ${strategyTitle}`);

    // Simulate with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const details = aiStrategyDetails[strategy];
    const baseConfidence = details?.confidence || 85;
    // Add realistic variance of ±3%
    const variance = (Math.random() - 0.5) * 6;
    const successProbability = Math.min(99.9, Math.max(60, baseConfidence + variance));

    const times = ['5 min', '8 min', '12 min', '15 min', '18 min', '22 min'];
    const recoveries = ['92.4%', '94.8%', '96.2%', '97.5%', '98.3%'];

    const result = {
      simulated: true,
      successProbability: parseFloat(successProbability.toFixed(1)),
      estimatedTime: times[Math.floor(Math.random() * times.length)],
      recoveryRate: recoveries[Math.floor(Math.random() * recoveries.length)],
      riskLevel: successProbability > 92 ? 'Low' : successProbability > 85 ? 'Medium' : 'High'
    };

    setPerStrategyResults(prev => ({
      ...prev,
      [strategy]: result
    }));

    setSimulatingStrategy(null);
    addActivityLog('decision', `Simulation Complete`, `${strategyTitle} - Success Rate: ${result.successProbability}%`, 'helios', 'success');
    toast.success(`Simulation complete for: ${strategyTitle}`);
  };

  // Apply/unapply strategy (multiple can be applied)
  const handleApplyStrategy = (strategy: string) => {
    if (appliedStrategies.includes(strategy)) {
      // Unapply
      setAppliedStrategies(prev => prev.filter(s => s !== strategy));
      addActivityLog('decision', 'Strategy Unapplied', getStrategyDetails(strategy).title, 'user', 'warning');
      toast.info('Strategy unapplied');
    } else {
      // Apply
      setAppliedStrategies(prev => [...prev, strategy]);
      const details = getStrategyDetails(strategy);
      addActivityLog('decision', 'Strategy Applied', details.title, 'user', 'success');
      toast.success(`Applied: ${details.title}`);
    }
  };

  // Simulate multiple selected strategies together
  const handleSimulateMultipleStrategies = async () => {
    const strategiesToSimulate = appliedStrategies.filter(s => !perStrategyResults[s]?.simulated);

    if (appliedStrategies.length === 0) {
      toast.error('Please apply at least one strategy to simulate');
      return;
    }

    setIsSimulatingCombined(true);
    addActivityLog('decision', 'Combined Simulation Started', `${appliedStrategies.length} strategies`, 'helios', 'info');
    toast.info(`Simulating ${appliedStrategies.length} strategies together...`);

    // Simulate each strategy individually first
    for (const strategy of strategiesToSimulate) {
      const details = aiStrategyDetails[strategy];
      const confidence = details?.confidence || 90;
      const times = ['6 min', '8 min', '10 min', '12 min', '15 min'];
      const recoveries = ['95.2%', '96.7%', '97.3%', '98.1%', '94.5%'];

      await new Promise(resolve => setTimeout(resolve, 500));

      setPerStrategyResults(prev => ({
        ...prev,
        [strategy]: {
          simulated: true,
          successProbability: confidence,
          estimatedTime: times[Math.floor(Math.random() * times.length)],
          recoveryRate: recoveries[Math.floor(Math.random() * recoveries.length)],
          riskLevel: confidence > 93 ? 'Low' : confidence > 88 ? 'Medium' : 'High'
        }
      }));
    }

    // Generate combined result
    await new Promise(resolve => setTimeout(resolve, 1000));

    const allResults = appliedStrategies.map(s => {
      const existing = perStrategyResults[s];
      if (existing) return existing;
      const details = aiStrategyDetails[s];
      return {
        simulated: true,
        successProbability: details?.confidence || 90,
        estimatedTime: '10 min',
        recoveryRate: '96%',
        riskLevel: 'Medium'
      };
    });

    // Calculate combined metrics with synergy bonus
    const avgSuccess = allResults.reduce((acc, r) => acc + r.successProbability, 0) / allResults.length;
    const synergyBonus = appliedStrategies.length > 1 ? Math.min(appliedStrategies.length * 1.2, 4) : 0;
    const combinedSuccess = Math.min(avgSuccess + synergyBonus, 99.9);

    const timeReduction = appliedStrategies.length > 1 ? 0.8 : 1;
    const baseTimes = [6, 8, 10, 12, 15];
    const avgTime = baseTimes[Math.floor(Math.random() * baseTimes.length)] * timeReduction;

    const synergies: string[] = [];
    if (appliedStrategies.length >= 2) synergies.push('Parallel execution reduces total time by 20%');
    if (appliedStrategies.length >= 3) synergies.push('Multi-vector approach improves resilience');
    if (avgSuccess > 92) synergies.push('High-confidence strategies amplify success rate');

    setCombinedSimulationResult({
      strategies: appliedStrategies,
      combinedSuccess,
      combinedTime: `${avgTime.toFixed(0)} min`,
      combinedRecovery: `${(96 + Math.random() * 3).toFixed(1)}%`,
      overallRisk: combinedSuccess > 95 ? 'Low' : combinedSuccess > 90 ? 'Medium' : 'High',
      synergies
    });

    setIsSimulatingCombined(false);
    addActivityLog('decision', 'Combined Simulation Complete', `Success: ${combinedSuccess.toFixed(1)}%`, 'helios', 'success');
    toast.success('Combined simulation complete!');
  };

  const handleSimulateStrategies = async () => {
    if (selectedStrategies.length === 0) {
      toast.error('Please select at least one strategy to simulate');
      return;
    }

    setSimulationRunning(true);
    setShowSimulationResults(false);
    addActivityLog('decision', 'Multi-Strategy Simulation Started', `${selectedStrategies.length} strategies selected`, 'helios', 'info');

    const steps: SimulationStep[] = [
      { id: 1, name: 'Analyzing selected strategies', status: 'pending', duration: 1000 },
      { id: 2, name: 'Building simulation environment', status: 'pending', duration: 1200 },
      { id: 3, name: 'Executing strategy combinations', status: 'pending', duration: 1500 },
      { id: 4, name: 'Calculating impact projections', status: 'pending', duration: 1000 },
      { id: 5, name: 'Validating resolution paths', status: 'pending', duration: 800 },
      { id: 6, name: 'Generating final report', status: 'pending', duration: 600 },
    ];

    setSimulationSteps(steps);
    toast.info('Starting strategy simulation...');

    for (let i = 0; i < steps.length; i++) {
      setSimulationSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, steps[i].duration));

      setSimulationSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'completed' } : s
      ));
    }

    // Generate simulation results
    const avgConfidence = selectedStrategies.reduce((acc, s) => {
      const details = aiStrategyDetails[s];
      return acc + (details?.confidence || 90);
    }, 0) / selectedStrategies.length;

    setSimulationResults({
      successProbability: avgConfidence,
      estimatedTime: '12 minutes',
      recoveryRate: '97.3%',
      riskLevel: avgConfidence > 92 ? 'Low' : avgConfidence > 85 ? 'Medium' : 'High',
      strategies: selectedStrategies.map(s => ({
        name: aiStrategyDetails[s]?.title || s.substring(0, 50) + '...',
        impact: aiStrategyDetails[s]?.estimatedImpact || 'Positive impact expected',
        confidence: aiStrategyDetails[s]?.confidence || 90
      }))
    });

    setSimulationRunning(false);
    setShowSimulationResults(true);
    addActivityLog('decision', 'Multi-Strategy Simulation Complete', `Average success rate: ${avgConfidence.toFixed(1)}%`, 'helios', 'success');
    toast.success('Simulation complete!');
  };

  const handleExecuteStrategies = async () => {
    setActiveTab('execution');
    setExecutionActive(true);
    setExecutionProgress(0);
    addActivityLog('execution', 'Execution Pipeline Started', 'Initializing agent workflow', 'helios', 'info');

    // Initialize agents
    const agents: ExecutionAgent[] = [
      { name: 'HELIOS Orchestrator', status: 'idle', currentTask: 'Awaiting initialization', progress: 0 },
      { name: 'Infrastructure Agent', status: 'idle', currentTask: 'Standby', progress: 0 },
      { name: 'Database Agent', status: 'idle', currentTask: 'Standby', progress: 0 },
      { name: 'Network Agent', status: 'idle', currentTask: 'Standby', progress: 0 },
      { name: 'Monitoring Agent', status: 'idle', currentTask: 'Standby', progress: 0 },
    ];
    setExecutionAgents(agents);

    // Simulate agent workflow
    const agentTasks = [
      { agent: 0, task: 'Initializing execution pipeline', duration: 1500 },
      { agent: 0, task: 'Coordinating agent deployment', duration: 1000 },
      { agent: 1, task: 'Spinning up containers in US-West-2', duration: 2000 },
      { agent: 2, task: 'Promoting read replicas', duration: 1800 },
      { agent: 3, task: 'Updating DNS records globally', duration: 1500 },
      { agent: 1, task: 'Configuring load balancers', duration: 1200 },
      { agent: 4, task: 'Deploying health check probes', duration: 1000 },
      { agent: 3, task: 'Steering traffic to healthy region', duration: 1500 },
      { agent: 4, task: 'Validating service health', duration: 1200 },
      { agent: 0, task: 'Finalizing execution', duration: 800 },
    ];

    for (let i = 0; i < agentTasks.length; i++) {
      const { agent, task, duration } = agentTasks[i];
      addActivityLog('execution', `${agents[agent].name}`, task, 'helios', 'info');

      setExecutionAgents(prev => prev.map((a, idx) =>
        idx === agent
          ? { ...a, status: 'active', currentTask: task, progress: 0 }
          : { ...a, status: a.progress === 100 ? 'completed' : a.status }
      ));

      // Animate progress
      const steps = 10;
      for (let j = 0; j <= steps; j++) {
        await new Promise(resolve => setTimeout(resolve, duration / steps));
        setExecutionAgents(prev => prev.map((a, idx) =>
          idx === agent ? { ...a, progress: (j / steps) * 100 } : a
        ));
        setExecutionProgress(((i + j / steps) / agentTasks.length) * 100);
      }

      setExecutionAgents(prev => prev.map((a, idx) =>
        idx === agent ? { ...a, status: 'completed', progress: 100 } : a
      ));
    }

    setExecutionActive(false);
    setExecutionProgress(100);
    setResolutionComplete(true);
    setAlertStatus('resolved');

    // Generate impact metrics with realistic data
    const metrics = {
      serviceRestoration: 97.3,
      transactionsRecovered: 94847,
      revenueProtected: '$2.1M',
      slaCompliance: 99.92,
      mttr: '14m 23s',
      affectedUsersResolved: 98.7
    };
    setImpactMetrics(metrics);

    addActivityLog('execution', 'Execution Complete', 'All agents finished successfully', 'helios', 'success');
    addActivityLog('impact', 'Resolution Complete', 'All systems restored to normal operation', 'system', 'success');
    addActivityLog('system', 'Status Updated', 'Alert status changed from Active to Resolved', 'system', 'success');

    // Notify parent of status change with metrics
    if (onStatusUpdate) {
      onStatusUpdate(alert.id, 'resolved', {
        mttr: metrics.mttr,
        revenueProtected: metrics.revenueProtected,
        transactionsRecovered: metrics.transactionsRecovered,
        serviceRestoration: metrics.serviceRestoration
      });
    }

    toast.success('Execution complete! Incident resolved. View Impact tab for detailed results.');
  };

  const handleEndWarRoom = useCallback(() => {
    // Save finalized strategies if any were applied
    if (appliedStrategies.length > 0) {
      const individualResults: Record<string, any> = {};
      appliedStrategies.forEach(s => {
        individualResults[s] = perStrategyResults[s] || {
          successProbability: getStrategyDetails(s).confidence,
          estimatedTime: '12 min',
          recoveryRate: '97.3%',
          riskLevel: 'Low'
        };
      });

      setFinalizedStrategies({
        strategies: appliedStrategies,
        combinedResult: combinedSimulationResult || {
          combinedSuccess: Object.values(individualResults).reduce((a, r) => a + r.successProbability, 0) / appliedStrategies.length,
          combinedTime: '12 min',
          combinedRecovery: '97.3%',
          overallRisk: 'Low',
          synergies: []
        },
        individualResults,
        appliedAt: new Date()
      });

      const titles = appliedStrategies.map(s => getStrategyDetails(s).title).join(', ');
      addActivityLog('decision', 'Strategies Finalized', `${appliedStrategies.length} strategies: ${titles}`, 'user', 'success');
    }

    // Save simulation results before ending war room
    if (showSimulationResults && simulationResults) {
      setWarRoomSimulationResults(simulationResults);
    }

    addActivityLog('decision', 'War Room Ended', `Session duration: ${decisionTime}s`, 'user', 'info');
    warRoomActions.resetState();
    setActiveTab('decision');
    setPerStrategyResults({});
    setAppliedStrategies([]);
    setCombinedSimulationResult(null);
    toast.info("War Room session has ended. View your finalized strategies in the Decision tab.");
  }, [warRoomActions, setActiveTab, showSimulationResults, simulationResults, appliedStrategies, perStrategyResults, combinedSimulationResult, decisionTime, addActivityLog]);

  const handleResetSimulation = useCallback(() => {
    setSelectedStrategies([]);
    setSimulationResults(null);
    setShowSimulationResults(false);
    setSimulationSteps([]);
    setWarRoomSimulationResults(null);
    setPerStrategyResults({});
    setAppliedStrategies([]);
    setFinalizedStrategies(null);
    setCombinedSimulationResult(null);
    addActivityLog('decision', 'Simulation Reset', 'All strategies cleared', 'user', 'warning');
    toast.info("Simulation has been reset.");
  }, [addActivityLog]);

  const handleReturnToDashboard = useCallback(() => {
    closeWarRoomDialog();
  }, [closeWarRoomDialog]);

  const handleMinimizeWarRoom = useCallback(() => {
    closeWarRoomDialog();
    setWarRoomMinimized(true);
  }, [closeWarRoomDialog, setWarRoomMinimized]);


  const handleInitiateWarRoom = useCallback(() => {
    addActivityLog('decision', 'War Room Initiated', 'Assembling response team', 'user', 'info');
    initiateWarRoom();
  }, [initiateWarRoom, addActivityLog]);

  const getStrategyDetails = (strategy: string) => {
    return aiStrategyDetails[strategy] || {
      title: strategy.substring(0, 50) + '...',
      confidence: 90,
      howItWorks: 'AI-powered strategy based on historical incident data and predictive analytics.',
      resolutionPath: ['Analyze current state', 'Deploy automated remediation', 'Validate results', 'Confirm resolution'],
      estimatedImpact: 'Expected positive impact on system recovery.',
      riskMitigation: 'Standard rollback procedures in place.'
    };
  };

  // Override handler with realistic data updates
  const handleOverride = () => {
    if (!overrideJustification.trim()) {
      toast.error('Please provide a justification for the override');
      return;
    }

    const overrideLabels: Record<string, string> = {
      priority: 'Priority Override',
      strategy: 'Strategy Override',
      approval: 'Approval Chain Override',
      resource: 'Resource Allocation Override',
      sla: 'SLA Override'
    };

    // Add to override history
    const newOverride = {
      type: overrideType,
      justification: overrideJustification,
      timestamp: new Date()
    };

    setOverrideData(prev => ({
      ...prev,
      overrideHistory: [...prev.overrideHistory, newOverride],
      ...(overrideType === 'priority' && { priorityEscalated: true }),
      ...(overrideType === 'strategy' && { strategyOverridden: true }),
      ...(overrideType === 'approval' && { approvalBypassed: true }),
      ...(overrideType === 'resource' && { resourcesAllocated: true }),
      ...(overrideType === 'sla' && { slaAcknowledged: true }),
    }));

    addActivityLog('override', overrideLabels[overrideType], overrideJustification, 'user', 'warning');

    switch (overrideType) {
      case 'priority':
        addActivityLog('system', 'Priority Escalated', 'Incident priority changed from High to Critical', 'system', 'warning');
        toast.success('Priority override applied - Incident escalated to Critical. All teams notified.');
        break;
      case 'strategy':
        addActivityLog('system', 'Strategy Override Active', 'AI recommendations bypassed - Manual control enabled', 'system', 'warning');
        setAppliedStrategies([]);
        setFinalizedStrategies(null);
        toast.success('Strategy override applied - Manual intervention mode activated. AI recommendations paused.');
        break;
      case 'approval':
        addActivityLog('system', 'Approval Chain Bypassed', 'Emergency authorization granted by IRC Leader', 'system', 'warning');
        toast.success('Approval chain bypassed - Emergency action authorized. Audit trail logged.');
        break;
      case 'resource':
        addActivityLog('system', 'Resources Allocated', 'Additional capacity provisioned: +500% compute, +300% network', 'helios', 'info');
        addActivityLog('execution', 'Scaling Initiated', 'HELIOS spinning up 2,400 additional containers across 3 regions', 'helios', 'success');
        toast.success('Additional resources allocated - Auto-scaling initiated. Capacity increased by 500%.');
        break;
      case 'sla':
        addActivityLog('system', 'SLA Override Documented', `Breach acknowledged: ${overrideJustification}`, 'system', 'warning');
        toast.success('SLA override acknowledged - Documented for executive review. Customer Success notified.');
        break;
    }

    setOverrideDialogOpen(false);
    setOverrideJustification('');
  };

  // Generate incident report
  const generateIncidentReport = () => {
    const report = `
================================================================================
                         INCIDENT RESOLUTION REPORT
================================================================================

INCIDENT DETAILS
--------------------------------------------------------------------------------
Alert ID:        ${alert.id}
Title:           ${alert.title}
Severity:        ${alert.severity.toUpperCase()}
Status:          ${alertStatus.toUpperCase()}
Region:          ${alert.region}
Timestamp:       ${new Date(alert.timestamp).toLocaleString()}

AFFECTED SYSTEMS
--------------------------------------------------------------------------------
${alert.affectedSystems.map(s => `• ${s}`).join('\n')}

BUSINESS IMPACT
--------------------------------------------------------------------------------
${alert.businessImpact}
SLA Risk: ${alert.slaRisk}

RESOLUTION SUMMARY
--------------------------------------------------------------------------------
Resolution Time:       ${impactMetrics?.mttr || 'N/A'}
Service Restoration:   ${impactMetrics?.serviceRestoration || 'N/A'}%
Transactions Recovered: ${impactMetrics?.transactionsRecovered?.toLocaleString() || 'N/A'}
Revenue Protected:     ${impactMetrics?.revenueProtected || 'N/A'}
SLA Compliance:        ${impactMetrics?.slaCompliance || 'N/A'}%

STRATEGIES APPLIED
--------------------------------------------------------------------------------
${finalizedStrategies ? `
Strategies Applied: ${finalizedStrategies.strategies.length}
${finalizedStrategies.strategies.map((s, i) => `${i + 1}. ${getStrategyDetails(s).title}`).join('\n')}
Applied At:   ${finalizedStrategies.appliedAt.toLocaleString()}
Combined Success: ${finalizedStrategies.combinedResult?.combinedSuccess?.toFixed(1) || 'N/A'}%
Overall Risk: ${finalizedStrategies.combinedResult?.overallRisk || 'N/A'}
` : 'No finalized strategies recorded'}

ACTIVITY LOG
--------------------------------------------------------------------------------
${activityLog.map(log => `[${log.timestamp.toLocaleTimeString()}] [${log.category.toUpperCase()}] ${log.action}${log.details ? ` - ${log.details}` : ''}`).join('\n')}

================================================================================
                    Generated by HELIOS Incident Response System
                         ${new Date().toLocaleString()}
================================================================================
    `.trim();

    return report;
  };

  const handleCopyReport = () => {
    const report = generateIncidentReport();
    navigator.clipboard.writeText(report);
    addActivityLog('impact', 'Report Copied', 'Incident report copied to clipboard', 'user', 'info');
    toast.success('Report copied to clipboard');
  };

  const handleDownloadReport = () => {
    const report = generateIncidentReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${alert.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addActivityLog('impact', 'Report Downloaded', `File: incident-report-${alert.id}.txt`, 'user', 'info');
    toast.success('Report downloaded');
  };

  return (
    <div className="p-3 h-full flex flex-col gap-2 overflow-hidden">
      {/* Minimized War Room Widget */}
      {warRoomActive && warRoomMinimized && (
        <div
          className="fixed bottom-4 right-4 z-50 p-3 rounded-lg shadow-lg bg-card border border-primary/30 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => {
            setWarRoomMinimized(false);
            initiateWarRoom(); // This re-opens the dialog
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">War Room Active</span>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success">
              {decisionTime}s
            </Badge>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" onClick={onBack} className="gap-2 h-9 px-3 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={cn(
              "text-xs px-2 py-0.5",
              alertStatus === 'resolved' && 'bg-emerald-500 text-white',
              alertStatus !== 'resolved' && alert.severity === 'critical' && 'bg-error/80 text-error-foreground',
              alertStatus !== 'resolved' && alert.severity === 'medium' && 'bg-muted/60 text-foreground',
              alertStatus !== 'resolved' && alert.severity === 'low' && 'bg-muted/40 text-muted-foreground'
            )}>
              {alertStatus === 'resolved' ? 'RESOLVED' : alert.severity.toUpperCase()}
            </Badge>
            {alertStatus === 'resolved' && (
              <Badge className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Incident Closed
              </Badge>
            )}
            <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground/90">{alert.title}</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded bg-muted/10 border border-border/20">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Detected</p>
            <p className="text-sm font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded bg-muted/10 border border-border/20">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Region</p>
            <p className="text-sm font-medium">{alert.region}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded bg-muted/10 border border-border/20">
          <Server className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Systems</p>
            <p className="text-sm font-medium">{alert.affectedSystems.length} affected</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-3 p-3 rounded border",
          alertStatus === 'resolved' ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-error/5 border-error/20'
        )}>
          {alertStatus === 'resolved' ? (
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          ) : (
            <DollarSign className="h-5 w-5 text-error" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">{alertStatus === 'resolved' ? 'Status' : 'Impact'}</p>
            <p className={cn("text-sm font-medium", alertStatus === 'resolved' ? 'text-emerald-400' : 'text-error')}>
              {alertStatus === 'resolved' ? 'Resolved' : (alert.businessImpact.split(' - ')[1] || alert.businessImpact)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-6 h-auto gap-1.5 bg-muted/30 p-1 shrink-0">
          <TabsTrigger value="overview" className="text-sm px-3 py-2">
            <FileText className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-sm px-3 py-2">
            <Brain className="h-4 w-4 mr-1.5" />
            Helios AI
          </TabsTrigger>
          <TabsTrigger value="decision" className="text-sm px-3 py-2">
            <Target className="h-4 w-4 mr-1.5" />
            Decision
          </TabsTrigger>
          <TabsTrigger value="execution" className="text-sm px-3 py-2">
            <Zap className="h-4 w-4 mr-1.5" />
            Execution
          </TabsTrigger>
          <TabsTrigger value="impact" className="text-sm px-3 py-2">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Impact
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-sm px-3 py-2">
            <ScrollText className="h-4 w-4 mr-1.5" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Incident Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-4 gap-3 p-3 rounded bg-muted/20 border border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Alert ID</p>
                  <p className="font-mono text-sm">{alert.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm">{alert.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phase</p>
                  <Badge className="text-xs px-2 py-0.5">{phaseLabels[alert.phase]}</Badge>
                </div>
              </div>

              <div className="p-3 rounded border border-error/20 bg-error/5">
                <p className="text-xs text-muted-foreground">SLA Risk</p>
                <p className="text-error text-sm font-medium">{alert.slaRisk}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground/80 mb-1">Business Context</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{alert.details.situation.businessContext}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-muted/10 border border-border/20">
                  <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5 mb-1">
                    <Shield className="h-4 w-4" />SOC Role
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{alert.details.situation.socRole}</p>
                </div>
                <div className="p-3 rounded bg-muted/10 border border-border/20">
                  <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5 mb-1">
                    <Activity className="h-4 w-4" />NOC Role
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{alert.details.situation.nocRole}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80 mb-1.5">Affected Systems</p>
                <div className="flex flex-wrap gap-1.5">
                  {alert.affectedSystems.map((system, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">{system}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
                <Brain className="h-4 w-4 text-muted-foreground" />
                HELIOS AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {alert.details.aiRecommendations.map((rec, i) => {
                const details = getStrategyDetails(rec);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded bg-muted/10 border border-border/20">
                    <Brain className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{details.title}</p>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">
                          {details.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{rec}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeepDive(rec)}
                      className="h-8 px-3 text-xs gap-1.5 shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Tab */}
        <TabsContent value="decision" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
                <Target className="h-4 w-4 text-muted-foreground" />
                Strategy Selection & Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded bg-muted/10 border border-border/20">
                <p className="text-sm font-medium text-foreground/80 mb-1">Leader's Role</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{alert.details.decision.leaderRole}</p>
              </div>

              {/* Initiate War Room */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={handleInitiateWarRoom}
                  className={cn(
                    "gap-1.5 h-9 text-sm px-4",
                    warRoomActive ? "bg-success/20 text-success hover:bg-success/30" : ""
                  )}
                  disabled={isAssembling || warRoomActive}
                >
                  {warRoomActive ? <><CheckCircle className="h-4 w-4" /> War Room Live</> : (isAssembling ? <><Loader2 className="h-4 w-4 animate-spin" /> Assembling...</> : <><Users className="h-4 w-4" /> Initiate War Room</>)}
                </Button>
                {/* <Button size="sm" variant="outline" onClick={() => handleTakeAction('Approve Failover')} className="gap-1.5 h-9 text-sm px-4">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOverrideDialogOpen(true)}
                  className="h-9 text-sm px-4 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  <AlertOctagon className="h-4 w-4" />
                  Override
                </Button> */}
              </div>

              {warRoomActive && (
                <div className="flex items-center justify-between p-3 rounded bg-success/5 border border-success/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">War Room Active</span>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-success/10 text-success">
                    {decisionTime}s
                  </Badge>
                </div>
              )}

              {/* Active Override Status */}
              {overrideData.overrideHistory.length > 0 && (
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertOctagon className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Active Overrides ({overrideData.overrideHistory.length})</span>
                  </div>
                  <div className="space-y-2">
                    {overrideData.overrideHistory.map((override, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px] px-1.5 shrink-0 bg-amber-500/10 text-amber-400 border-amber-500/30 capitalize">
                          {override.type}
                        </Badge>
                        <span className="text-muted-foreground flex-1">{override.justification}</span>
                        <span className="text-muted-foreground/60 shrink-0">
                          {override.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                  {overrideData.resourcesAllocated && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">Resources:</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">+500% Compute</Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">+300% Network</Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">+2,400 Containers</Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Finalized Strategies Display */}
              {finalizedStrategies && !warRoomActive && (
                <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-emerald-950/10">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-emerald-400">
                            {finalizedStrategies.strategies.length > 1 ? `${finalizedStrategies.strategies.length} Finalized Strategies` : 'Finalized Strategy'}
                          </span>
                          <p className="text-xs text-muted-foreground">Applied at {finalizedStrategies.appliedAt.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleResetSimulation}
                        className="h-8 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                    </div>

                    {/* Combined Results Summary */}
                    {finalizedStrategies.strategies.length > 1 && finalizedStrategies.combinedResult && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-950/50 to-primary/10 border border-emerald-500/30">
                        <h5 className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5" />
                          Combined Strategy Results
                        </h5>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-emerald-500/20">
                            <p className="text-xl font-bold text-emerald-400">{finalizedStrategies.combinedResult.combinedSuccess?.toFixed(1)}%</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Combined Success</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-emerald-500/20">
                            <p className="text-xl font-bold text-primary">{finalizedStrategies.combinedResult.combinedRecovery}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Recovery Rate</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-emerald-500/20">
                            <p className="text-xl font-bold">{finalizedStrategies.combinedResult.combinedTime}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Est. Time</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-emerald-500/20">
                            <Badge className={cn(
                              "text-xs",
                              finalizedStrategies.combinedResult.overallRisk === 'Low' && 'bg-emerald-500/20 text-emerald-400',
                              finalizedStrategies.combinedResult.overallRisk === 'Medium' && 'bg-amber-500/20 text-amber-400',
                              finalizedStrategies.combinedResult.overallRisk === 'High' && 'bg-error/20 text-error'
                            )}>
                              {finalizedStrategies.combinedResult.overallRisk}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-1.5">Risk Level</p>
                          </div>
                        </div>
                        {finalizedStrategies.combinedResult.synergies?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-emerald-500/20">
                            <p className="text-[10px] font-medium text-muted-foreground mb-2">Synergy Benefits:</p>
                            <div className="flex flex-wrap gap-2">
                              {finalizedStrategies.combinedResult.synergies.map((s: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-[10px] bg-emerald-950/30 text-emerald-400 border-emerald-500/30">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Individual Strategy Cards */}
                    <div className="space-y-3">
                      {finalizedStrategies.strategies.map((strategy, idx) => {
                        const details = getStrategyDetails(strategy);
                        const result = finalizedStrategies.individualResults[strategy];
                        return (
                          <div key={idx} className="p-4 rounded-lg bg-background/50 border border-emerald-500/20">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">{idx + 1}</Badge>
                                  <h4 className="font-semibold text-foreground text-sm">{details.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{strategy}</p>
                              </div>
                              {result && (
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-success font-medium">{result.successProbability?.toFixed(0)}%</span>
                                  <Badge className={cn(
                                    "text-[10px]",
                                    result.riskLevel === 'Low' && 'bg-emerald-500/20 text-emerald-400',
                                    result.riskLevel === 'Medium' && 'bg-amber-500/20 text-amber-400',
                                    result.riskLevel === 'High' && 'bg-error/20 text-error'
                                  )}>
                                    {result.riskLevel}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button onClick={handleExecuteStrategies} className="w-full gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Zap className="h-4 w-4" />
                      Execute {finalizedStrategies.strategies.length > 1 ? `${finalizedStrategies.strategies.length} Strategies` : 'Strategy'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Legacy War Room Simulation Results (fallback if no finalized strategies) */}
              {warRoomSimulationResults && !warRoomActive && !finalizedStrategies && (
                <Card className="border-success/20 bg-success/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-success">
                        <CheckCircle className="h-4 w-4" />
                        Simulation Results
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleResetSimulation}
                        className="h-8 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 rounded bg-background/50">
                        <p className="text-base font-bold text-success">{warRoomSimulationResults.successProbability.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                      <div className="text-center p-2 rounded bg-background/50">
                        <p className="text-base font-bold">{warRoomSimulationResults.estimatedTime}</p>
                        <p className="text-xs text-muted-foreground">Time</p>
                      </div>
                      <div className="text-center p-2 rounded bg-background/50">
                        <p className="text-base font-bold">{warRoomSimulationResults.recoveryRate}</p>
                        <p className="text-xs text-muted-foreground">Recovery</p>
                      </div>
                      <div className="text-center p-2 rounded bg-background/50">
                        <Badge className={cn(
                          "text-xs px-2 py-0.5",
                          warRoomSimulationResults.riskLevel === 'Low' && 'bg-success',
                          warRoomSimulationResults.riskLevel === 'Medium' && 'bg-muted text-foreground',
                          warRoomSimulationResults.riskLevel === 'High' && 'bg-error'
                        )}>
                          {warRoomSimulationResults.riskLevel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Risk</p>
                      </div>
                    </div>
                    <Button onClick={handleExecuteStrategies} className="w-full gap-1.5 h-9 text-sm" size="sm">
                      <Zap className="h-4 w-4" />
                      Execute Strategies
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="p-3 rounded bg-muted/10 border border-border/20">
                <p className="text-sm font-medium text-foreground/80 mb-1">SOC/NOC Functionality</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{alert.details.decision.socNocFunctionality}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Tab */}
        <TabsContent value="execution" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
                <Zap className="h-4 w-4 text-muted-foreground" />
                Agent Execution Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {executionAgents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No execution in progress</p>
                  <p className="text-xs">Select strategies in Decision tab and click Execute</p>
                </div>
              ) : (
                <>
                  {/* Overall Progress */}
                  <div className="p-3 rounded bg-muted/10 border border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground/80">Overall Progress</span>
                      <span className="text-sm font-mono">{executionProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={executionProgress} className="h-2" />
                  </div>

                  {/* Agent Workflow */}
                  <div className="space-y-2">
                    {executionAgents.map((agent, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-3 rounded border transition-all",
                          agent.status === 'active' && "border-primary/30 bg-primary/5",
                          agent.status === 'completed' && "border-success/30 bg-success/5",
                          agent.status === 'idle' && "border-border/20 bg-muted/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center",
                              agent.status === 'active' && "bg-primary/20 text-primary",
                              agent.status === 'completed' && "bg-success/20 text-success",
                              agent.status === 'idle' && "bg-muted text-muted-foreground"
                            )}>
                              {agent.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : agent.status === 'active' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.currentTask}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-xs px-2 py-0.5",
                            agent.status === 'active' && "bg-primary/10 text-primary",
                            agent.status === 'completed' && "bg-success/10 text-success",
                            agent.status === 'idle' && "bg-muted text-muted-foreground"
                          )}>
                            {agent.status === 'completed' ? 'Done' : agent.status === 'active' ? 'Running' : 'Standby'}
                          </Badge>
                        </div>
                        {agent.status !== 'idle' && (
                          <Progress value={agent.progress} className="h-1.5 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Execution Complete */}
                  {executionProgress === 100 && (
                    <div className="p-4 rounded-lg border border-success/30 bg-gradient-to-r from-success/10 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold text-success">Execution Complete</p>
                          <p className="text-sm text-muted-foreground">All agents have finished their tasks successfully</p>
                        </div>
                      </div>
                      <Button
                        className="mt-4 w-full gap-2"
                        onClick={() => setActiveTab('impact')}
                      >
                        <TrendingUp className="h-4 w-4" />
                        View Impact Results
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-foreground/90">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Resolution Impact Analysis
                </div>
                {resolutionComplete && (
                  <Button
                    size="sm"
                    onClick={() => setReportDialogOpen(true)}
                    className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Generate Report
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {!impactMetrics ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No impact data available</p>
                  <p className="text-xs">Execute strategies to see resolution impact</p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4">
                  {/* Left Column - Metrics */}
                  <div className="col-span-8 space-y-4">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg border border-success/20 bg-success/5 text-center">
                        <p className="text-3xl font-bold text-success">{impactMetrics.serviceRestoration}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Service Restoration</p>
                      </div>
                      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-center">
                        <p className="text-3xl font-bold text-primary">{impactMetrics.transactionsRecovered.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Transactions Recovered</p>
                      </div>
                      <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-center">
                        <p className="text-3xl font-bold text-emerald-400">{impactMetrics.revenueProtected}</p>
                        <p className="text-xs text-muted-foreground mt-1">Revenue Protected</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5 text-center">
                        <p className="text-xl font-bold">{impactMetrics.slaCompliance}%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">SLA Compliance</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5 text-center">
                        <p className="text-xl font-bold">{impactMetrics.mttr}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Mean Time to Resolve</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5 text-center">
                        <p className="text-xl font-bold">{impactMetrics.affectedUsersResolved}%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Users Recovered</p>
                      </div>
                    </div>

                    {/* Resolution Status Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border border-success/20 bg-success/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Payment APIs Restored</p>
                          <p className="text-xs text-muted-foreground">US-West-2 fully operational</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-success/20 bg-success/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Database Failover Complete</p>
                          <p className="text-xs text-muted-foreground">Replication lag at 145ms</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-success/20 bg-success/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Traffic Steering Active</p>
                          <p className="text-xs text-muted-foreground">96.7% routed to healthy region</p>
                        </div>
                      </div>
                      <div className={cn(
                        "p-3 rounded-lg border flex items-center gap-3",
                        resolutionComplete
                          ? "border-success/20 bg-success/5"
                          : "border-border/30 bg-muted/5"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          resolutionComplete ? "bg-success/20" : "bg-muted"
                        )}>
                          {resolutionComplete ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">DNS Propagation</p>
                          <p className="text-xs text-muted-foreground">
                            {resolutionComplete ? 'Complete - All regions updated' : '3.3% may need cache clear'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Comparison */}
                  <div className="col-span-4 flex flex-col gap-4">
                    <div className="flex-1 p-4 rounded-lg border border-success/20 bg-gradient-to-b from-success/5 to-transparent">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="h-4 w-4 text-success" />
                        <span className="text-sm font-semibold text-success">HELIOS Automated</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Resolution Time</span>
                          <span className="text-sm font-semibold">{impactMetrics.mttr}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Recovery Rate</span>
                          <span className="text-sm font-semibold text-success">97.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Human Intervention</span>
                          <span className="text-sm font-semibold">Minimal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Cost Avoidance</span>
                          <span className="text-sm font-semibold text-success">$1.8M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 rounded-lg border border-border/30 bg-muted/5">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">Manual Process</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Resolution Time</span>
                          <span className="text-sm font-semibold text-muted-foreground">45-60 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Recovery Rate</span>
                          <span className="text-sm font-semibold text-muted-foreground">~85%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Human Intervention</span>
                          <span className="text-sm font-semibold text-muted-foreground">Extensive</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Estimated Loss</span>
                          <span className="text-sm font-semibold text-error">$2.4M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="mt-3 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border-border/30">
            <CardHeader className="py-3">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-foreground/90">
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-muted-foreground" />
                  Activity Log
                </div>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {activityLog.length} entries
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-[calc(100%-60px)]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {activityLog.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ScrollText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No activity logged yet</p>
                      <p className="text-xs">Actions will be recorded as you interact with the incident</p>
                    </div>
                  ) : (
                    [...activityLog].reverse().map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all",
                          entry.severity === 'error' && "border-red-500/30 bg-red-950/20",
                          entry.severity === 'warning' && "border-amber-500/30 bg-amber-950/20",
                          entry.severity === 'success' && "border-emerald-500/30 bg-emerald-950/20",
                          entry.severity === 'info' && "border-border/30 bg-muted/10"
                        )}
                      >
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                          categoryColors[entry.category]
                        )}>
                          {categoryIcons[entry.category]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{entry.action}</span>
                            <Badge variant="outline" className={cn("text-[10px] px-1.5 capitalize", categoryColors[entry.category])}>
                              {entry.category}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              {entry.actor}
                            </Badge>
                          </div>
                          {entry.details && (
                            <p className="text-xs text-muted-foreground">{entry.details}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Deep Dive Dialog */}
      <Dialog open={deepDiveOpen} onOpenChange={setDeepDiveOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Strategy Deep Dive
            </DialogTitle>
          </DialogHeader>

          {selectedStrategy && (
            <div className="space-y-4">
              {(() => {
                const details = getStrategyDetails(selectedStrategy);
                return (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                      <div>
                        <h3 className="font-semibold text-lg">{details.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{selectedStrategy}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{details.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">How It Works</h4>
                      <p className="text-sm text-muted-foreground">{details.howItWorks}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Resolution Path</h4>
                      <div className="space-y-2">
                        {details.resolutionPath.map((step, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                        <h4 className="font-semibold text-success mb-2">Expected Impact</h4>
                        <p className="text-sm">{details.estimatedImpact}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                        <h4 className="font-semibold text-warning mb-2">Risk Mitigation</h4>
                        <p className="text-sm">{details.riskMitigation}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-amber-400" />
              Override Actions
            </DialogTitle>
            <DialogDescription>
              Apply an override action. All overrides are logged for audit purposes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Override Type</Label>
              <RadioGroup value={overrideType} onValueChange={setOverrideType} className="space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/10 cursor-pointer">
                  <RadioGroupItem value="priority" id="priority" />
                  <Label htmlFor="priority" className="flex-1 cursor-pointer">
                    <span className="font-medium">Priority Override</span>
                    <p className="text-xs text-muted-foreground">Escalate or de-escalate incident priority</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/10 cursor-pointer">
                  <RadioGroupItem value="strategy" id="strategy" />
                  <Label htmlFor="strategy" className="flex-1 cursor-pointer">
                    <span className="font-medium">Strategy Override</span>
                    <p className="text-xs text-muted-foreground">Bypass AI recommendations with manual strategy</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/10 cursor-pointer">
                  <RadioGroupItem value="approval" id="approval" />
                  <Label htmlFor="approval" className="flex-1 cursor-pointer">
                    <span className="font-medium">Approval Chain Override</span>
                    <p className="text-xs text-muted-foreground">Skip approval chain for emergency actions</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/10 cursor-pointer">
                  <RadioGroupItem value="resource" id="resource" />
                  <Label htmlFor="resource" className="flex-1 cursor-pointer">
                    <span className="font-medium">Resource Allocation Override</span>
                    <p className="text-xs text-muted-foreground">Force additional resources or capacity</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/10 cursor-pointer">
                  <RadioGroupItem value="sla" id="sla" />
                  <Label htmlFor="sla" className="flex-1 cursor-pointer">
                    <span className="font-medium">SLA Override</span>
                    <p className="text-xs text-muted-foreground">Acknowledge SLA breach with documented reason</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Justification (Required)</Label>
              <Textarea
                placeholder="Provide a detailed justification for this override..."
                value={overrideJustification}
                onChange={(e) => setOverrideJustification(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOverride} className="gap-2 bg-amber-600 hover:bg-amber-700">
              <AlertOctagon className="h-4 w-4" />
              Apply Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              Incident Resolution Report
            </DialogTitle>
            <DialogDescription>
              Complete incident report generated by HELIOS
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/30">
              {generateIncidentReport()}
            </pre>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleCopyReport} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownloadReport} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* War Room Dialog - Unified Professional Layout */}
      <Dialog open={warRoomOpen} onOpenChange={(open) => !open && handleReturnToDashboard()}>
        <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-muted/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">HELIOS War Room Coordination</h2>
                <p className="text-xs text-muted-foreground">Real-time incident response coordination & strategy simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {warRoomActive && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">Live</span>
                  <span className="text-sm font-mono text-success">{decisionTime}s</span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={handleMinimizeWarRoom} className="text-muted-foreground h-8 w-8">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content - Single Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-6">
              {/* Bridge Assembly Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-primary" />
                    Bridge Assembly
                  </h3>
                  {!warRoomActive && !isAssembling && (
                    <Button size="sm" className="gap-2 h-8 text-xs" onClick={warRoomActions.startCallingSequence}>
                      <PhoneCall className="h-3.5 w-3.5" />
                      Assemble Bridge
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {participants.map((person) => {
                    const currentStatus = statusConfig[person.status];
                    return (
                      <div key={person.id} className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        person.status === 'joined' && "border-success/30 bg-success/5",
                        person.status === 'calling' && "border-primary/30 bg-primary/5",
                        person.status === 'joining' && "border-primary/20 bg-primary/5",
                        person.status === 'pending' && "border-border/30 bg-muted/10 opacity-60"
                      )}>
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          person.status === 'joined' && "bg-success/20",
                          person.status === 'calling' && "bg-primary/20",
                          person.status === 'joining' && "bg-primary/20",
                          person.status === 'pending' && "bg-muted"
                        )}>
                          {person.status === 'joined' ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : person.status === 'calling' || person.status === 'joining' ? (
                            <PhoneCall className="h-4 w-4 text-primary animate-pulse" />
                          ) : (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{person.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5 shrink-0", currentStatus.color)}>
                          {currentStatus.text}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/50" />

              {/* Strategy Simulation Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    AI Strategies - Simulate & Apply
                  </h3>
                  {warRoomActive && appliedStrategies.length > 0 && (
                    <Badge className="bg-emerald-500 text-white text-xs px-3 py-1">
                      <CheckCircle className="h-3 w-3 mr-1.5" />
                      {appliedStrategies.length} {appliedStrategies.length > 1 ? 'Strategies' : 'Strategy'} Applied
                    </Badge>
                  )}
                </div>

                {warRoomActive ? (
                  <div className="space-y-3">
                    {/* Multi-Strategy Simulation Button */}
                    {appliedStrategies.length > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/30">
                        <Button
                          size="sm"
                          onClick={handleSimulateMultipleStrategies}
                          disabled={isSimulatingCombined || appliedStrategies.length === 0}
                          className="gap-2 h-9"
                        >
                          {isSimulatingCombined ? (
                            <><Loader2 className="h-4 w-4 animate-spin" />Simulating Combined...</>
                          ) : (
                            <><Play className="h-4 w-4" />Simulate {appliedStrategies.length} Selected Together</>
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Run combined simulation to see synergy effects
                        </span>
                      </div>
                    )}

                    {/* Combined Simulation Results */}
                    {combinedSimulationResult && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-emerald-950/20 border border-primary/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Combined Strategy Results</span>
                          <Badge variant="outline" className="ml-auto text-[10px]">{combinedSimulationResult.strategies.length} strategies</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-success/20">
                            <p className="text-2xl font-bold text-success">{combinedSimulationResult.combinedSuccess.toFixed(1)}%</p>
                            <p className="text-[10px] text-muted-foreground">Combined Success</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-primary/20">
                            <p className="text-2xl font-bold text-primary">{combinedSimulationResult.combinedRecovery}</p>
                            <p className="text-[10px] text-muted-foreground">Recovery</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
                            <p className="text-2xl font-bold">{combinedSimulationResult.combinedTime}</p>
                            <p className="text-[10px] text-muted-foreground">Est. Time</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
                            <Badge className={cn(
                              "text-xs",
                              combinedSimulationResult.overallRisk === 'Low' && 'bg-success/20 text-success',
                              combinedSimulationResult.overallRisk === 'Medium' && 'bg-amber-500/20 text-amber-400',
                              combinedSimulationResult.overallRisk === 'High' && 'bg-error/20 text-error'
                            )}>
                              {combinedSimulationResult.overallRisk}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-1">Risk</p>
                          </div>
                        </div>
                        {combinedSimulationResult.synergies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {combinedSimulationResult.synergies.map((s, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                                ✓ {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* All Strategy Cards - Show ALL recommendations */}
                    <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                      {alert.details.aiRecommendations.map((rec, i) => {
                        const details = getStrategyDetails(rec);
                        const strategyResult = perStrategyResults[rec];
                        const isSimulated = strategyResult?.simulated;
                        const isApplied = appliedStrategies.includes(rec);
                        const isSimulating = simulatingStrategy === rec;

                        return (
                          <div key={i} className={cn(
                            "p-4 rounded-lg border transition-all",
                            isApplied && "border-emerald-500/60 bg-emerald-950/30 ring-2 ring-emerald-500/30",
                            isSimulated && !isApplied && "border-blue-500/40 bg-blue-950/20",
                            !isSimulated && !isApplied && "border-border/40 bg-muted/5"
                          )}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-primary shrink-0" />
                                  <span className="font-medium text-sm">{details.title}</span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">{details.confidence}%</Badge>
                                  {isApplied && (
                                    <Badge className="bg-emerald-500 text-white text-[10px] px-1.5">APPLIED</Badge>
                                  )}
                                  {isSimulated && !isApplied && (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5">SIMULATED</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{rec}</p>

                                {/* Simulation Results for this strategy */}
                                {isSimulated && strategyResult && (
                                  <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-background/50 border border-border/20 mb-3">
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-success">{strategyResult.successProbability.toFixed(0)}%</p>
                                      <p className="text-[10px] text-muted-foreground">Success</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-primary">{strategyResult.recoveryRate}</p>
                                      <p className="text-[10px] text-muted-foreground">Recovery</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-lg font-bold">{strategyResult.estimatedTime}</p>
                                      <p className="text-[10px] text-muted-foreground">Time</p>
                                    </div>
                                    <div className="text-center">
                                      <Badge className={cn(
                                        "text-[10px]",
                                        strategyResult.riskLevel === 'Low' && 'bg-success/20 text-success',
                                        strategyResult.riskLevel === 'Medium' && 'bg-amber-500/20 text-amber-400',
                                        strategyResult.riskLevel === 'High' && 'bg-error/20 text-error'
                                      )}>
                                        {strategyResult.riskLevel}
                                      </Badge>
                                      <p className="text-[10px] text-muted-foreground mt-1">Risk</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant={isSimulated ? "outline" : "default"}
                                  onClick={(e) => { e.stopPropagation(); handleSimulateSingleStrategy(rec); }}
                                  disabled={isSimulating || !!simulatingStrategy || isSimulatingCombined}
                                  className="h-8 px-3 text-xs gap-1.5 w-24"
                                >
                                  {isSimulating ? (
                                    <><Loader2 className="h-3 w-3 animate-spin" />Running</>
                                  ) : isSimulated ? (
                                    <><RotateCcw className="h-3 w-3" />Re-run</>
                                  ) : (
                                    <><Play className="h-3 w-3" />Simulate</>
                                  )}
                                </Button>

                                {isSimulated && (
                                  <Button
                                    size="sm"
                                    variant={isApplied ? "destructive" : "outline"}
                                    onClick={(e) => { e.stopPropagation(); handleApplyStrategy(rec); }}
                                    className={cn(
                                      "h-8 px-3 text-xs gap-1.5 w-24",
                                      isApplied && "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    )}
                                  >
                                    {isApplied ? (
                                      <><X className="h-3 w-3" />Remove</>
                                    ) : (
                                      <><CheckCircle className="h-3 w-3" />Apply</>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Applied Strategies Summary */}
                    {appliedStrategies.length > 0 && (
                      <div className="p-4 rounded-lg border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 to-transparent">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-emerald-400">
                              {appliedStrategies.length} {appliedStrategies.length > 1 ? 'Strategies' : 'Strategy'} Selected
                            </h4>
                          </div>
                        </div>
                        <div className="space-y-1 mb-3">
                          {appliedStrategies.map((s, i) => (
                            <p key={i} className="text-xs text-foreground/80">
                              {i + 1}. {getStrategyDetails(s).title}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {combinedSimulationResult
                            ? 'Combined simulation complete. End War Room to finalize.'
                            : 'Run combined simulation or end War Room to finalize.'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border/40 bg-muted/5">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">Assemble bridge to access strategy simulation</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border/50" />

              {/* Event Log Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Event Log
                  </h3>
                  {warRoomActive && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Assembly Time:</span>
                        <span className="font-mono font-semibold text-success">{decisionTime}s</span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                        75% Faster than Manual
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-lg border border-border/30 bg-muted/5 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {warRoomLog.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                          {log.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                        <p className="text-xs text-foreground/80 flex-1">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/30 bg-muted/5 shrink-0">
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground text-center">
                {warRoomActive ? 'War room session active. All participants can collaborate in real-time.' : 'Assemble the bridge to start coordinating incident response.'}
              </p>
              <Button variant="destructive" size="sm" onClick={handleEndWarRoom} className="px-8">
                End War Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
