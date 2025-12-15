import { useState, useEffect, useCallback } from 'react';
import { IRCAlert, SimulationScenario, WorkflowStep } from '@/lib/ircAlertData';
import {
  ArrowLeft, AlertTriangle, Brain, Play, Zap, GitBranch, FileText, MessageSquareWarning,
  CheckCircle, Clock, XCircle, Loader2, Shield, Target, Activity, Minus, X,
  Server, MapPin, DollarSign, ChevronRight, Pause, Users, UserCheck, Building2, Headphones, PhoneCall, PhoneForwarded, UserPlus, CircleDotDashed,
  TrendingUp, Eye, ArrowRight, BarChart3, RotateCcw
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

interface IRCAlertDetailProps {
  alert: IRCAlert;
  onBack: () => void;
}

interface ExecutionAgent {
  name: string;
  status: 'idle' | 'active' | 'completed';
  currentTask: string;
  progress: number;
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

// AI Strategy details with deep dive info
const aiStrategyDetails: Record<string, {
  title: string;
  confidence: number;
  howItWorks: string;
  resolutionPath: string[];
  estimatedImpact: string;
  riskMitigation: string;
}> = {
  'Recommend immediate failover to US-West-2 based on 94.7% historical success rate for similar incidents': {
    title: 'Immediate Failover Strategy',
    confidence: 94.7,
    howItWorks: 'This strategy leverages automated failover scripts to redirect all traffic from the degraded US-East-1 region to the healthy US-West-2 region. The system will spin up pre-configured containers, update DNS records, and promote database replicas.',
    resolutionPath: [
      'Initiate container spin-up in US-West-2 (847 containers)',
      'Update DNS TTL to 60 seconds for faster propagation',
      'Promote read replicas to primary in secondary region',
      'Redirect load balancer traffic to healthy endpoints',
      'Validate health checks across all services',
      'Complete traffic steering to US-West-2'
    ],
    estimatedImpact: 'Full service restoration within 15 minutes. Expected to recover 96.7% of failed transactions.',
    riskMitigation: 'Automatic rollback triggers if health checks fail. Database sync verified before traffic switch.'
  },
  'Suggest prioritizing EU payment gateway (€847K/hour) over APAC (¥423K/hour) if partial failover required': {
    title: 'Prioritized Regional Recovery',
    confidence: 91.2,
    howItWorks: 'Revenue-optimized partial failover that prioritizes high-value regions. EU processing takes precedence based on real-time revenue impact analysis. APAC follows with 3-minute delay to ensure stability.',
    resolutionPath: [
      'Analyze real-time revenue by region',
      'Initiate EU payment gateway failover first',
      'Validate EU transaction processing',
      'Begin APAC failover sequence',
      'Monitor cross-region latency',
      'Confirm all regional gateways operational'
    ],
    estimatedImpact: 'EU recovery in 8 minutes, APAC in 11 minutes. Revenue protection: €1.2M saved.',
    riskMitigation: 'Regional isolation prevents cascade failures. Independent rollback per region.'
  },
  'Pre-emptively scale authentication services by 340% based on post-failover traffic patterns': {
    title: 'Proactive Auth Scaling',
    confidence: 88.5,
    howItWorks: 'Based on historical failover patterns, authentication services experience a 340% traffic spike as users retry failed sessions. This strategy pre-scales auth infrastructure before the surge hits.',
    resolutionPath: [
      'Analyze historical post-failover traffic patterns',
      'Provision additional auth pods (current + 340%)',
      'Update connection pool limits',
      'Pre-warm authentication caches',
      'Enable enhanced session recovery',
      'Monitor auth success rates'
    ],
    estimatedImpact: 'Prevents secondary outage. Auth success rate maintained above 99.5%.',
    riskMitigation: 'Auto-scaling policies set to handle unexpected load. Circuit breakers active.'
  },
  'Alert Customer Success to prepare communication for 23 enterprise clients with >$1M annual contracts': {
    title: 'Enterprise Client Communication',
    confidence: 96.3,
    howItWorks: 'Proactive outreach to high-value enterprise clients reduces support ticket volume by 67% and maintains trust. Automated status page updates combined with personalized outreach.',
    resolutionPath: [
      'Identify 23 enterprise clients by contract value',
      'Generate personalized status updates',
      'Trigger automated status page update',
      'Initiate direct account manager outreach',
      'Prepare compensation/SLA credit calculations',
      'Schedule post-incident review calls'
    ],
    estimatedImpact: 'Customer satisfaction maintained. Reduces escalations by 78%.',
    riskMitigation: 'Communication templates pre-approved by legal. Escalation paths documented.'
  },
  'Recommend extending database connection pool timeout from 30s to 120s during transition': {
    title: 'Database Connection Optimization',
    confidence: 92.1,
    howItWorks: 'During failover, database connections experience temporary latency spikes. Extending timeout prevents premature connection drops and reduces retry storms that can overwhelm the system.',
    resolutionPath: [
      'Increase connection pool timeout to 120s',
      'Enable connection keep-alive optimization',
      'Activate query queuing for overflow',
      'Monitor connection pool utilization',
      'Gradually restore normal timeouts post-recovery',
      'Validate transaction completion rates'
    ],
    estimatedImpact: 'Prevents 23% of transaction failures during transition window.',
    riskMitigation: 'Automatic timeout restoration after stability confirmed. Alerting for pool exhaustion.'
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

export function IRCAlertDetail({ alert, onBack }: IRCAlertDetailProps) {
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
  const handleTakeAction = (action: string) => {
    setActionsTaken(prev => [...prev, action]);
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
  };

  const handleSimulateStrategies = async () => {
    if (selectedStrategies.length === 0) {
      toast.error('Please select at least one strategy to simulate');
      return;
    }

    setSimulationRunning(true);
    setShowSimulationResults(false);

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
    toast.success('Simulation complete!');
  };

  const handleExecuteStrategies = async () => {
    setActiveTab('execution');
    setExecutionActive(true);
    setExecutionProgress(0);

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

    // Generate impact metrics
    setImpactMetrics({
      serviceRestoration: 97.3,
      transactionsRecovered: 94847,
      revenueProtected: '$2.1M',
      slaCompliance: 99.92,
      mttr: '14m 23s',
      affectedUsersResolved: 98.7
    });

    toast.success('Execution complete! View Impact tab for results.');
  };

  const handleEndWarRoom = useCallback(() => {
    // Save simulation results before ending war room
    if (showSimulationResults && simulationResults) {
      setWarRoomSimulationResults(simulationResults);
    }
    warRoomActions.resetState();
    setActiveTab('decision');
    toast.info("War Room session has ended. View your simulation results in the Decision tab.");
  }, [warRoomActions, setActiveTab, showSimulationResults, simulationResults]);

  const handleResetSimulation = useCallback(() => {
    setSelectedStrategies([]);
    setSimulationResults(null);
    setShowSimulationResults(false);
    setSimulationSteps([]);
    setWarRoomSimulationResults(null);
    toast.info("Simulation has been reset.");
  }, []);

  const handleReturnToDashboard = useCallback(() => {
    closeWarRoomDialog();
  }, [closeWarRoomDialog]);

  const handleMinimizeWarRoom = useCallback(() => {
    closeWarRoomDialog();
    setWarRoomMinimized(true);
  }, [closeWarRoomDialog, setWarRoomMinimized]);


  const handleInitiateWarRoom = useCallback(() => {
    initiateWarRoom();
  }, [initiateWarRoom]);

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
              alert.severity === 'critical' && 'bg-error/80 text-error-foreground',
              alert.severity === 'high' && 'bg-muted/80 text-foreground',
              alert.severity === 'medium' && 'bg-muted/60 text-foreground',
              alert.severity === 'low' && 'bg-muted/40 text-muted-foreground'
            )}>
              {alert.severity.toUpperCase()}
            </Badge>
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
        <div className="flex items-center gap-3 p-3 rounded bg-error/5 border border-error/20">
          <DollarSign className="h-5 w-5 text-error" />
          <div>
            <p className="text-xs text-muted-foreground">Impact</p>
            <p className="text-sm font-medium text-error">{alert.businessImpact.split(' - ')[1] || alert.businessImpact}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-5 h-auto gap-1.5 bg-muted/30 p-1 shrink-0">
          <TabsTrigger value="overview" className="text-sm px-3 py-2">
            <FileText className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-sm px-3 py-2">
            <Brain className="h-4 w-4 mr-1.5" />
            AI
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
                <Button size="sm" variant="outline" onClick={() => handleTakeAction('Approve Failover')} className="gap-1.5 h-9 text-sm px-4">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleTakeAction('Override Prioritization')} className="h-9 text-sm px-4">
                  Override
                </Button>
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

              {/* War Room Simulation Results */}
              {warRoomSimulationResults && !warRoomActive && (
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
                    <div className="flex items-center justify-between p-3 rounded bg-success/5 border border-success/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">Execution Complete</span>
                      </div>
                      <Button
                        onClick={() => setActiveTab('impact')}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                        View Impact
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
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Resolution Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-[calc(100%-60px)]">
              {!impactMetrics ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No impact data available</p>
                  <p className="text-xs">Execute strategies to see impact analysis</p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4 h-full">
                  {/* Left Column - Key Metrics */}
                  <div className="col-span-8 flex flex-col gap-4">
                    {/* Primary Metrics Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-success/80">Service Restoration</span>
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <p className="text-3xl font-bold text-success">{impactMetrics.serviceRestoration}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-primary/80">Revenue Protected</span>
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary">{impactMetrics.revenueProtected}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-success/80">SLA Compliance</span>
                          <Shield className="h-4 w-4 text-success" />
                        </div>
                        <p className="text-3xl font-bold text-success">{impactMetrics.slaCompliance}%</p>
                      </div>
                    </div>

                    {/* Secondary Metrics Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5">
                        <p className="text-xs text-muted-foreground mb-1">Transactions Recovered</p>
                        <p className="text-xl font-bold">{impactMetrics.transactionsRecovered.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5">
                        <p className="text-xs text-muted-foreground mb-1">Mean Time to Resolve</p>
                        <p className="text-xl font-bold">{impactMetrics.mttr}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5">
                        <p className="text-xs text-muted-foreground mb-1">Users Resolved</p>
                        <p className="text-xl font-bold">{impactMetrics.affectedUsersResolved}%</p>
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
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">DNS Propagation</p>
                          <p className="text-xs text-muted-foreground">3.3% may need cache clear</p>
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
                    Strategy Simulation
                  </h3>
                  {warRoomActive && (
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{selectedStrategies.length} selected</Badge>
                      <Button
                        size="sm"
                        onClick={handleSimulateStrategies}
                        disabled={selectedStrategies.length === 0 || simulationRunning}
                        className="gap-2 h-8 text-xs"
                      >
                        {simulationRunning ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Simulating...</> : <><Play className="h-3.5 w-3.5" />Simulate</>}
                      </Button>
                    </div>
                  )}
                </div>

                {warRoomActive ? (
                  <div className="space-y-4">
                    {/* Strategy Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {alert.details.aiRecommendations.slice(0, 4).map((rec, i) => {
                        const details = getStrategyDetails(rec);
                        const isSelected = selectedStrategies.includes(rec);
                        const recoveryRate = [96.7, 94.2, 91.8, 89.5][i] || 90;
                        const probability = details.confidence;
                        const estimatedTime = ['8 min', '12 min', '15 min', '18 min'][i] || '10 min';
                        const riskLevel = probability > 93 ? 'Low' : probability > 88 ? 'Medium' : 'High';
                        return (
                          <div key={i} className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            isSelected ? "border-success/50 bg-success/5 ring-1 ring-success/20" : "border-border/40 hover:border-primary/30 hover:bg-muted/10"
                          )} onClick={() => handleStrategyToggle(rec)}>
                            <div className="flex items-start gap-3">
                              <Checkbox checked={isSelected} className="mt-0.5 h-4 w-4" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-sm">{details.title}</span>
                                  <Badge variant="outline" className="text-[10px] px-1.5">{probability}%</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {recoveryRate}% recovery
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {estimatedTime}
                                  </span>
                                  <span className={cn(
                                    "flex items-center gap-1",
                                    riskLevel === 'Low' ? 'text-success' : riskLevel === 'Medium' ? 'text-muted-foreground' : 'text-error'
                                  )}>
                                    <Shield className="h-3 w-3" />
                                    {riskLevel} risk
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulation Results */}
                    {showSimulationResults && simulationResults && (
                      <div className="p-4 rounded-lg border border-success/30 bg-gradient-to-r from-success/5 to-transparent">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-success flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Simulation Complete
                          </h4>
                          <Button size="sm" variant="ghost" onClick={handleResetSimulation} className="h-7 px-2 text-xs gap-1.5 text-muted-foreground">
                            <RotateCcw className="h-3 w-3" />
                            Reset
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 rounded-lg bg-background/80 border border-border/20">
                            <p className="text-2xl font-bold text-success">{simulationResults.successProbability.toFixed(0)}%</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Success Rate</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/80 border border-border/20">
                            <p className="text-2xl font-bold text-primary">{simulationResults.recoveryRate}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Recovery</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/80 border border-border/20">
                            <p className="text-2xl font-bold">{simulationResults.estimatedTime}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Est. Time</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/80 border border-border/20">
                            <Badge className={cn(
                              "text-xs",
                              simulationResults.riskLevel === 'Low' && 'bg-success/20 text-success border-success/30',
                              simulationResults.riskLevel === 'Medium' && 'bg-muted text-foreground',
                              simulationResults.riskLevel === 'High' && 'bg-error/20 text-error border-error/30'
                            )}>
                              {simulationResults.riskLevel}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1.5">Risk Level</p>
                          </div>
                        </div>
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
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {warRoomActive ? 'War room session active. All participants can collaborate in real-time.' : 'Assemble the bridge to start coordinating incident response.'}
              </p>
              <Button variant="destructive" size="sm" onClick={handleEndWarRoom} className="px-6">
                End War Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
