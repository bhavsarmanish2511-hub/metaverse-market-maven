import { useState, useEffect } from 'react';
import { IRCAlert, SimulationScenario, WorkflowStep } from '@/lib/ircAlertData';
import {
  ArrowLeft, AlertTriangle, Brain, Play, Zap, GitBranch, FileText,
  CheckCircle, Clock, XCircle, Loader2, Shield, Target, Activity,
  Server, MapPin, DollarSign, ChevronRight, Pause, Users, UserCheck, Building2, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface IRCAlertDetailProps {
  alert: IRCAlert;
  onBack: () => void;
}

const phaseLabels = {
  situation: '1. Situation',
  detection: '2. Detection',
  decision: '3. Decision',
  action: '4. Action',
  resolution: '5. Resolution',
};

const statusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-success" />,
  'in-progress': <Loader2 className="h-4 w-4 text-warning animate-spin" />,
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
  blocked: <XCircle className="h-4 w-4 text-error" />,
};

const riskColors = {
  low: 'text-success border-success/30 bg-success/10',
  medium: 'text-warning border-warning/30 bg-warning/10',
  high: 'text-error border-error/30 bg-error/10',
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

// War Room data
const approvalChain = [
  { level: 1, title: 'Technical Lead Approval', approver: 'Alex Chen', role: 'Senior DevOps Engineer', status: 'pending' },
  { level: 2, title: 'Operations Manager Approval', approver: 'Sarah Mitchell', role: 'Director of Operations', status: 'pending' },
  { level: 3, title: 'Executive Approval', approver: 'Michael Torres', role: 'VP of Infrastructure', status: 'pending' },
];

const coordinationTeams = [
  { id: 1, name: 'Engineering', icon: Building2, members: 12, status: 'standby', lead: 'David Kim' },
  { id: 2, name: 'Customer Success', icon: Headphones, members: 8, status: 'standby', lead: 'Emily Watson' },
  { id: 3, name: 'Finance', icon: DollarSign, members: 4, status: 'standby', lead: 'Robert Chen' },
  { id: 4, name: 'Security', icon: Shield, members: 6, status: 'standby', lead: 'Lisa Park' },
];

export function IRCAlertDetail({ alert, onBack }: IRCAlertDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationRunning, setSimulationRunning] = useState<string | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [workflowTriggered, setWorkflowTriggered] = useState(false);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [warRoomOpen, setWarRoomOpen] = useState(false);
  const [approvals, setApprovals] = useState(approvalChain);
  const [teams, setTeams] = useState(coordinationTeams);
  const [warRoomActive, setWarRoomActive] = useState(false);
  const [decisionTime, setDecisionTime] = useState<number | null>(null);
  const [warRoomStartTime, setWarRoomStartTime] = useState<number | null>(null);

  const handleTakeAction = (action: string) => {
    setActionsTaken(prev => [...prev, action]);
    toast.success(`Action initiated: ${action}`);
  };

  const handleRunSimulation = async (scenario: SimulationScenario) => {
    setSimulationRunning(scenario.id);
    setSelectedSimulation(scenario.id);
    
    // Create simulation steps
    const steps: SimulationStep[] = [
      { id: 1, name: 'Initializing simulation environment', status: 'pending', duration: 1000 },
      { id: 2, name: 'Validating prerequisites', status: 'pending', duration: 800 },
      { id: 3, name: 'Executing primary actions', status: 'pending', duration: 1500 },
      { id: 4, name: 'Verifying system responses', status: 'pending', duration: 1200 },
      { id: 5, name: 'Running health checks', status: 'pending', duration: 900 },
      { id: 6, name: 'Calculating success metrics', status: 'pending', duration: 700 },
    ];
    
    setSimulationSteps(steps);
    toast.info(`Starting simulation: ${scenario.name}`);

    // Run through each step
    for (let i = 0; i < steps.length; i++) {
      if (simulationPaused) {
        await new Promise(resolve => {
          const checkPause = setInterval(() => {
            if (!simulationPaused) {
              clearInterval(checkPause);
              resolve(true);
            }
          }, 100);
        });
      }

      setSimulationSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, steps[i].duration));

      setSimulationSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed' } : s
      ));
    }

    setSimulationRunning(null);
    toast.success(`Simulation complete: ${scenario.successRate}% success probability`);
  };

  const handleTriggerWorkflow = () => {
    setWorkflowTriggered(true);
    toast.success('Workflow triggered - Automated response initiated');
  };

  const handleInitiateWarRoom = () => {
    setWarRoomOpen(true);
    setWarRoomStartTime(Date.now());
    toast.info('HELIOS initiating War Room - Awaiting 3-level approval chain');
    
    // Simulate HELIOS processing approval chain
    setTimeout(() => {
      setApprovals(prev => prev.map((a, i) => i === 0 ? { ...a, status: 'approved' } : a));
      playHeliosNotification();
      toast.info('Technical lead approval received');
    }, 2000);
    
    setTimeout(() => {
      setApprovals(prev => prev.map((a, i) => i <= 1 ? { ...a, status: 'approved' } : a));
      playHeliosNotification();
      toast.info('Operations manager approval received');
    }, 4000);
    
    setTimeout(() => {
      setApprovals(prev => prev.map(a => ({ ...a, status: 'approved' })));
      playHeliosNotification();
      toast.info('Executive approval received - Coordinating with teams');
      
      // Activate teams
      setTimeout(() => {
        setTeams(prev => prev.map(t => ({ ...t, status: 'active' })));
        setWarRoomActive(true);
        const elapsed = ((Date.now() - (warRoomStartTime || Date.now())) / 1000).toFixed(1);
        setDecisionTime(parseFloat(elapsed));
        toast.success(`War Room activated! Decision time: ${elapsed}s (75% faster than manual process)`);
      }, 1500);
    }, 6000);
  };

  const playHeliosNotification = () => {
    // Play soothing alert tone instead of voice
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      
      const tones = [
        { freq: 523, duration: 100, gap: 50 },
        { freq: 659, duration: 150, gap: 0 },
      ];
      
      let timeOffset = 0;
      tones.forEach(({ freq, duration, gap }) => {
        const oscillator = audioContext.createOscillator();
        const toneGain = audioContext.createGain();
        
        oscillator.connect(toneGain);
        toneGain.connect(gainNode);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        toneGain.gain.setValueAtTime(0, audioContext.currentTime + timeOffset / 1000);
        toneGain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + (timeOffset + 20) / 1000);
        toneGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + (timeOffset + duration - 20) / 1000);
        toneGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + (timeOffset + duration) / 1000);
        
        oscillator.start(audioContext.currentTime + timeOffset / 1000);
        oscillator.stop(audioContext.currentTime + (timeOffset + duration) / 1000);
        
        timeOffset += duration + gap;
      });
      
      setTimeout(() => audioContext.close(), timeOffset + 100);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Get actions based on selected simulation
  const getCurrentActions = () => {
    if (selectedSimulation && simulationActions[selectedSimulation]) {
      return simulationActions[selectedSimulation];
    }
    return {
      automated: alert.details.action.automatedActions,
      human: alert.details.action.humanActions
    };
  };

  const currentActions = getCurrentActions();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Alerts
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={cn(
              alert.severity === 'critical' && 'bg-error text-error-foreground',
              alert.severity === 'high' && 'bg-warning text-warning-foreground',
              alert.severity === 'medium' && 'bg-noc text-noc-foreground',
              alert.severity === 'low' && 'bg-muted text-muted-foreground'
            )}>
              {alert.severity.toUpperCase()}
            </Badge>
            <span className="font-mono text-sm">{alert.id}</span>
          </div>
          <h1 className="text-2xl font-bold">{alert.title}</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Detected</p>
              <p className="text-sm font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Region</p>
              <p className="text-sm font-medium">{alert.region}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <Server className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Systems</p>
              <p className="text-sm font-medium">{alert.affectedSystems.length} affected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-error/30 bg-error/5">
          <CardContent className="p-3 flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-error" />
            <div>
              <p className="text-xs text-muted-foreground">Impact</p>
              <p className="text-sm font-medium text-error">{alert.businessImpact.split(' - ')[1] || alert.businessImpact}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="text-xs px-2 py-2">
            <FileText className="h-3 w-3 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs px-2 py-2">
            <Brain className="h-3 w-3 mr-1" />
            AI Recs
          </TabsTrigger>
          <TabsTrigger value="decision" className="text-xs px-2 py-2">
            <Target className="h-3 w-3 mr-1" />
            Decision
          </TabsTrigger>
          <TabsTrigger value="simulation" className="text-xs px-2 py-2">
            <Play className="h-3 w-3 mr-1" />
            Simulation
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs px-2 py-2">
            <Zap className="h-3 w-3 mr-1" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="workflow" className="text-xs px-2 py-2">
            <GitBranch className="h-3 w-3 mr-1" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="phases" className="text-xs px-2 py-2">
            <Activity className="h-3 w-3 mr-1" />
            Phases
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Merged with Details */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Incident Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Alert Details (merged from Details tab) */}
              <div className="grid md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Alert ID</h4>
                  <p className="font-mono">{alert.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                  <p>{alert.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Timestamp</h4>
                  <p>{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Current Phase</h4>
                  <Badge>{phaseLabels[alert.phase]}</Badge>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-error/30 bg-error/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">SLA Risk</h4>
                <p className="text-error font-medium">{alert.slaRisk}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Business Context</h4>
                <p className="text-muted-foreground">{alert.details.situation.businessContext}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-soc" />
                    SOC Role
                  </h4>
                  <p className="text-sm text-muted-foreground">{alert.details.situation.socRole}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-noc" />
                    NOC Role
                  </h4>
                  <p className="text-sm text-muted-foreground">{alert.details.situation.nocRole}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Affected Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {alert.affectedSystems.map((system, i) => (
                    <Badge key={i} variant="outline">{system}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab - Now after Overview */}
        <TabsContent value="ai" className="mt-6 space-y-4">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                HELIOS AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alert.details.aiRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="p-1 rounded bg-primary/20">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{rec}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleTakeAction(rec)}>
                    Apply
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Tab */}
        <TabsContent value="decision" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-warning" />
                Decision Making Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
                <h4 className="font-semibold mb-2">Leader's Role</h4>
                <p className="text-muted-foreground">{alert.details.decision.leaderRole}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SOC/NOC Functionality</h4>
                <p className="text-muted-foreground">{alert.details.decision.socNocFunctionality}</p>
              </div>
              {/* Challenge Today - Commented out as requested */}
              {/* <div className="p-4 rounded-lg border border-error/30 bg-error/5">
                <h4 className="font-semibold mb-2 text-error">Challenge Today</h4>
                <p className="text-muted-foreground">{alert.details.decision.challengeToday}</p>
              </div> */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleTakeAction('Approve Failover')} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve Failover
                </Button>
                <Button variant="outline" onClick={() => handleTakeAction('Override Prioritization')}>
                  Override Prioritization
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleInitiateWarRoom}
                  className="gap-2 border-primary/50 hover:bg-primary/10"
                >
                  <Users className="h-4 w-4" />
                  Initiate War Room
                </Button>
              </div>
              
              {/* War Room Status */}
              {warRoomActive && (
                <Card className="mt-4 border-success/30 bg-success/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success">War Room Active</span>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success">
                        Decision Time: {decisionTime}s
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      HELIOS coordinated 3-level approval chain and 4 teams, reducing decision time by 75%
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulation Tab - Now with step-by-step visualization */}
        <TabsContent value="simulation" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-noc" />
                Simulation Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alert.details.simulationScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    riskColors[scenario.riskLevel],
                    selectedSimulation === scenario.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{scenario.name}</h4>
                    <Badge variant="outline" className={riskColors[scenario.riskLevel]}>
                      {scenario.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span>Est. Time: {scenario.estimatedTime}</span>
                      <span>Success Rate: {scenario.successRate}%</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRunSimulation(scenario)}
                      disabled={simulationRunning !== null}
                    >
                      {simulationRunning === scenario.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Progress value={scenario.successRate} className="h-2" />
                  </div>

                  {/* Step-by-step simulation visualization */}
                  {simulationRunning === scenario.id && simulationSteps.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-sm">Simulation Progress</h5>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSimulationPaused(!simulationPaused)}
                        >
                          {simulationPaused ? (
                            <><Play className="h-3 w-3 mr-1" /> Resume</>
                          ) : (
                            <><Pause className="h-3 w-3 mr-1" /> Pause</>
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {simulationSteps.map((step) => (
                          <div key={step.id} className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                              {step.status === 'running' && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                              {step.status === 'pending' && <Clock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <span className={cn(
                              "text-sm flex-1",
                              step.status === 'completed' && "text-success",
                              step.status === 'running' && "text-primary font-medium",
                              step.status === 'pending' && "text-muted-foreground"
                            )}>
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab - Now changes based on simulation */}
        <TabsContent value="actions" className="mt-6 space-y-4">
          {selectedSimulation && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 mb-4">
              <p className="text-sm text-primary">
                <Zap className="h-4 w-4 inline mr-1" />
                Actions updated based on simulation: <strong>{alert.details.simulationScenarios.find(s => s.id === selectedSimulation)?.name}</strong>
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Automated Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentActions.automated.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <Button
                      size="sm"
                      variant={actionsTaken.includes(action) ? "default" : "outline"}
                      onClick={() => handleTakeAction(action)}
                      disabled={actionsTaken.includes(action)}
                    >
                      {actionsTaken.includes(action) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-warning" />
                  Human Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentActions.human.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <Button
                      size="sm"
                      variant={actionsTaken.includes(action) ? "default" : "outline"}
                      onClick={() => handleTakeAction(action)}
                      disabled={actionsTaken.includes(action)}
                    >
                      {actionsTaken.includes(action) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Challenge Today - Commented out as requested */}
          {/* <Card className="border-error/30 bg-error/5">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-error">Challenge Today</h4>
              <p className="text-muted-foreground">{alert.details.action.challengeToday}</p>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-soc" />
                Workflow Impact & Status
              </CardTitle>
              <Button
                onClick={handleTriggerWorkflow}
                disabled={workflowTriggered}
                className="gap-2"
              >
                {workflowTriggered ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Triggered
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Trigger Workflow
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {alert.details.workflowImpact.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {statusIcons[step.status]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.name}</h4>
                      <span className="text-sm text-muted-foreground">{step.duration}</span>
                    </div>
                    {step.dependencies.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Depends on: {step.dependencies.join(', ')}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className={cn(
                    step.status === 'completed' && 'bg-success/10 text-success',
                    step.status === 'in-progress' && 'bg-warning/10 text-warning',
                    step.status === 'pending' && 'bg-muted',
                    step.status === 'blocked' && 'bg-error/10 text-error'
                  )}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases" className="mt-6 space-y-4">
          {Object.entries(phaseLabels).map(([phase, label]) => (
            <Card key={phase} className={cn(
              alert.phase === phase && 'border-primary ring-2 ring-primary/20'
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {alert.phase === phase && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {phase === 'situation' && (
                  <p className="text-muted-foreground">{alert.details.situation.businessContext}</p>
                )}
                {phase === 'detection' && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{alert.details.detection.whatHappens}</p>
                    <p className="text-sm text-primary">Future: {alert.details.detection.futureState}</p>
                  </div>
                )}
                {phase === 'decision' && (
                  <p className="text-muted-foreground">{alert.details.decision.leaderRole}</p>
                )}
                {phase === 'action' && (
                  <div className="space-y-1">
                    {alert.details.action.automatedActions.slice(0, 2).map((a, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {a}</p>
                    ))}
                  </div>
                )}
                {phase === 'resolution' && (
                  <p className="text-muted-foreground">{alert.details.resolution.outcome}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* War Room Dialog */}
      <Dialog open={warRoomOpen} onOpenChange={setWarRoomOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              HELIOS War Room Coordination
            </DialogTitle>
            <DialogDescription>
              Automated 3-level approval chain and 4-team coordination for failover decisions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 3-Level Approval Chain */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                3-Level Approval Chain
              </h4>
              <div className="space-y-2">
                {approvals.map((approval, idx) => (
                  <div
                    key={approval.level}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      approval.status === 'approved' && "border-success/50 bg-success/10",
                      approval.status === 'pending' && "border-border bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      approval.status === 'approved' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {approval.status === 'approved' ? <CheckCircle className="h-4 w-4" /> : approval.level}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{approval.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {approval.approver} • {approval.role}
                      </div>
                    </div>
                    <Badge variant={approval.status === 'approved' ? 'default' : 'outline'} className={cn(
                      approval.status === 'approved' && "bg-success text-success-foreground"
                    )}>
                      {approval.status === 'approved' ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Team Coordination */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                4-Team Coordination
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team) => {
                  const TeamIcon = team.icon;
                  return (
                    <div
                      key={team.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        team.status === 'active' && "border-primary/50 bg-primary/10",
                        team.status === 'standby' && "border-border bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        team.status === 'active' ? "bg-primary/20" : "bg-muted"
                      )}>
                        <TeamIcon className={cn(
                          "h-5 w-5",
                          team.status === 'active' ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Lead: {team.lead} • {team.members} members
                        </div>
                      </div>
                      <Badge variant={team.status === 'active' ? 'default' : 'outline'} className={cn(
                        team.status === 'active' && "bg-primary"
                      )}>
                        {team.status === 'active' ? 'Active' : 'Standby'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Time Metric */}
            {warRoomActive && (
              <Card className="border-success/30 bg-success/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-success">{decisionTime}s</div>
                      <div className="text-sm text-muted-foreground">Total Decision Time</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-success">75% Faster</div>
                      <div className="text-sm text-muted-foreground">vs. Manual Process (~30s avg)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
