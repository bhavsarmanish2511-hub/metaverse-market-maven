import { useState } from 'react';
import { OffensiveTesterAlert, SimulationScenario, WorkflowStep } from '@/lib/offensiveTesterAlertData';
import {
  ArrowLeft, AlertTriangle, Brain, Play, Zap, GitBranch, FileText,
  CheckCircle, Clock, XCircle, Loader2, Shield, Target, Activity,
  Server, MapPin, Crosshair, ChevronRight, Pause, Users, UserCheck, Building2, Headphones, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface OffensiveTesterAlertDetailProps {
  alert: OffensiveTesterAlert;
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
      'Initiating model checkpoint rollback',
      'Validating model weights integrity',
      'Restoring clean training pipeline',
      'Applying data quality filters',
      'Enabling model integrity monitoring'
    ],
    human: [
      'Validate rollback success via adversarial tests',
      'Review attack vector documentation',
      'Update threat intelligence database',
      'Coordinate with ML team on model health'
    ]
  },
  'SIM-002': {
    automated: [
      'Identifying poisoned data samples',
      'Removing flagged training data',
      'Initiating incremental retraining',
      'Monitoring model drift metrics'
    ],
    human: [
      'Review data cleansing accuracy',
      'Validate model predictions post-cleansing',
      'Document lessons learned'
    ]
  },
  'SIM-003': {
    automated: [
      'Blocking compromised API endpoint',
      'Enabling enhanced traffic monitoring',
      'Alerting downstream systems'
    ],
    human: [
      'Monitor model behavior for anomalies',
      'Prepare full rollback if needed',
      'Coordinate with API security team'
    ]
  }
};

interface SimulationStep {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
  duration: number;
}

// Remediation team data for AI incidents
const remediationTeams = [
  { id: 1, name: 'ML Engineering', icon: Brain, members: 8, status: 'standby', lead: 'Dr. Sarah Chen' },
  { id: 2, name: 'API Security', icon: Shield, members: 6, status: 'standby', lead: 'Marcus Williams' },
  { id: 3, name: 'Data Engineering', icon: Server, members: 5, status: 'standby', lead: 'Priya Sharma' },
  { id: 4, name: 'Threat Intelligence', icon: Crosshair, members: 4, status: 'standby', lead: 'Alex Rodriguez' },
];

const approvalChain = [
  { level: 1, title: 'Security Lead Approval', approver: 'James Park', role: 'Senior Security Engineer', status: 'pending' },
  { level: 2, title: 'ML Operations Approval', approver: 'Dr. Emily Watson', role: 'ML Ops Director', status: 'pending' },
  { level: 3, title: 'CISO Approval', approver: 'Robert Chen', role: 'Chief Information Security Officer', status: 'pending' },
];

export function OffensiveTesterAlertDetail({ alert, onBack }: OffensiveTesterAlertDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationRunning, setSimulationRunning] = useState<string | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [workflowTriggered, setWorkflowTriggered] = useState(false);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [remediationOpen, setRemediationOpen] = useState(false);
  const [approvals, setApprovals] = useState(approvalChain);
  const [teams, setTeams] = useState(remediationTeams);
  const [remediationActive, setRemediationActive] = useState(false);
  const [decisionTime, setDecisionTime] = useState<number | null>(null);
  const [remediationStartTime, setRemediationStartTime] = useState<number | null>(null);

  const handleTakeAction = (action: string) => {
    setActionsTaken(prev => [...prev, action]);
    toast.success(`Action initiated: ${action}`);
  };

  const handleRunSimulation = async (scenario: SimulationScenario) => {
    setSimulationRunning(scenario.id);
    setSelectedSimulation(scenario.id);
    
    const steps: SimulationStep[] = [
      { id: 1, name: 'Initializing adversarial environment', status: 'pending', duration: 1000 },
      { id: 2, name: 'Validating model checkpoint', status: 'pending', duration: 800 },
      { id: 3, name: 'Executing remediation actions', status: 'pending', duration: 1500 },
      { id: 4, name: 'Verifying model integrity', status: 'pending', duration: 1200 },
      { id: 5, name: 'Running adversarial tests', status: 'pending', duration: 900 },
      { id: 6, name: 'Calculating success metrics', status: 'pending', duration: 700 },
    ];
    
    setSimulationSteps(steps);
    toast.info(`Starting simulation: ${scenario.name}`);

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
    toast.success('Workflow triggered - Automated AI incident response initiated');
  };

  const handleInitiateRemediation = () => {
    setRemediationOpen(true);
    setRemediationStartTime(Date.now());
    toast.info('HELIOS initiating AI Incident Remediation - Awaiting 3-level approval chain');
    
    setTimeout(() => {
      setApprovals(prev => prev.map((a, i) => i === 0 ? { ...a, status: 'approved' } : a));
      playHeliosNotification();
      toast.info('Security lead approval received');
    }, 2000);
    
    setTimeout(() => {
      setApprovals(prev => prev.map((a, i) => i <= 1 ? { ...a, status: 'approved' } : a));
      playHeliosNotification();
      toast.info('ML Operations approval received');
    }, 4000);
    
    setTimeout(() => {
      setApprovals(prev => prev.map(a => ({ ...a, status: 'approved' })));
      playHeliosNotification();
      toast.info('CISO approval received - Coordinating with teams');
      
      setTimeout(() => {
        setTeams(prev => prev.map(t => ({ ...t, status: 'active' })));
        setRemediationActive(true);
        const elapsed = ((Date.now() - (remediationStartTime || Date.now())) / 1000).toFixed(1);
        setDecisionTime(parseFloat(elapsed));
        toast.success(`Remediation activated! Decision time: ${elapsed}s (80% faster than manual process)`);
      }, 1500);
    }, 6000);
  };

  const playHeliosNotification = () => {
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
            <Brain className="h-5 w-5 text-error" />
            <div>
              <p className="text-xs text-muted-foreground">Impact</p>
              <p className="text-sm font-medium text-error">AI Model Risk</p>
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
            AI recommendations
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-error" />
                AI Security Incident Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

        {/* AI Recommendations Tab */}
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
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-error/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-error" />
                AI Incident Remediation Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Initiate coordinated AI incident response with automated 3-level approval chain and team coordination.
              </p>
              <Button 
                onClick={handleInitiateRemediation}
                className="bg-error hover:bg-error/90 text-error-foreground"
                disabled={remediationActive}
              >
                {remediationActive ? 'Remediation Active' : 'Initiate AI Incident Response'}
              </Button>
              {decisionTime && (
                <p className="text-sm text-success mt-2">
                  Decision time: {decisionTime}s (80% faster than manual process)
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Tab */}
        <TabsContent value="decision" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-warning" />
                Tester Decision Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-error">Tester's Role</h4>
                <p className="text-muted-foreground">{alert.details.decision.testerRole}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SOC/NOC Functionality</h4>
                <p className="text-muted-foreground">{alert.details.decision.socNocFunctionality}</p>
              </div>
              <div className="p-3 rounded-lg border border-warning/30 bg-warning/5">
                <h4 className="font-semibold mb-1 text-warning">Challenge Today</h4>
                <p className="text-sm text-muted-foreground">{alert.details.decision.challengeToday}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Remediation Simulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alert.details.simulationScenarios.map((scenario) => (
                <div 
                  key={scenario.id} 
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    selectedSimulation === scenario.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{scenario.name}</h4>
                        <Badge className={riskColors[scenario.riskLevel]}>
                          {scenario.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Est. Time: {scenario.estimatedTime}</span>
                        <span>Success Rate: {scenario.successRate}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRunSimulation(scenario)}
                      disabled={simulationRunning !== null}
                      className="gap-2"
                    >
                      {simulationRunning === scenario.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Running
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Run
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {simulationRunning === scenario.id && simulationSteps.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {simulationSteps.map((step) => (
                        <div key={step.id} className="flex items-center gap-3 text-sm">
                          {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                          {step.status === 'running' && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                          {step.status === 'pending' && <Clock className="h-4 w-4 text-muted-foreground" />}
                          <span className={cn(
                            step.status === 'completed' && 'text-success',
                            step.status === 'running' && 'text-primary',
                            step.status === 'pending' && 'text-muted-foreground'
                          )}>
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  Automated Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentActions.automated.map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-warning" />
                  Human Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentActions.human.map((action, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span className="text-sm">{action}</span>
                    <Button
                      size="sm"
                      variant={actionsTaken.includes(action) ? "outline" : "default"}
                      onClick={() => handleTakeAction(action)}
                      disabled={actionsTaken.includes(action)}
                      className="shrink-0"
                    >
                      {actionsTaken.includes(action) ? 'Done' : 'Take'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <Card className="border-warning/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-1 text-warning">Challenge Today</h4>
              <p className="text-sm text-muted-foreground">{alert.details.action.challengeToday}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                Workflow Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!workflowTriggered ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Trigger the automated workflow to begin incident response</p>
                  <Button onClick={handleTriggerWorkflow} className="gap-2">
                    <Play className="h-4 w-4" />
                    Trigger Workflow
                  </Button>
                </div>
              ) : (
                alert.details.workflowImpact.map((step) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                    {statusIcons[step.status]}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{step.name}</span>
                        <span className="text-xs text-muted-foreground">{step.duration}</span>
                      </div>
                      {step.status === 'in-progress' && (
                        <Progress value={65} className="h-1 mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases" className="mt-6 space-y-4">
          {Object.entries(phaseLabels).map(([key, label]) => {
            const phaseKey = key as keyof typeof alert.details;
            const phaseData = alert.details[phaseKey];
            
            if (!phaseData || typeof phaseData !== 'object') return null;
            
            return (
              <Card key={key} className={cn(
                "border-l-4",
                alert.phase === key ? "border-l-primary" : "border-l-muted"
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {alert.phase === key && <Activity className="h-4 w-4 text-primary animate-pulse" />}
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {key === 'situation' && (
                    <>
                      <p><strong>Business Context:</strong> {(phaseData as any).businessContext}</p>
                      <p><strong>SOC Role:</strong> {(phaseData as any).socRole}</p>
                      <p><strong>NOC Role:</strong> {(phaseData as any).nocRole}</p>
                    </>
                  )}
                  {key === 'detection' && (
                    <>
                      <p><strong>What Happens:</strong> {(phaseData as any).whatHappens}</p>
                      <p className="text-warning"><strong>Challenge Today:</strong> {(phaseData as any).challengeToday}</p>
                      <p className="text-success"><strong>Future State:</strong> {(phaseData as any).futureState}</p>
                    </>
                  )}
                  {key === 'decision' && (
                    <>
                      <p><strong>Tester's Role:</strong> {(phaseData as any).testerRole}</p>
                      <p><strong>SOC/NOC Functionality:</strong> {(phaseData as any).socNocFunctionality}</p>
                      <p className="text-warning"><strong>Challenge Today:</strong> {(phaseData as any).challengeToday}</p>
                    </>
                  )}
                  {key === 'action' && (
                    <>
                      <p><strong>Automated:</strong> {(phaseData as any).automatedActions?.join(', ')}</p>
                      <p><strong>Human Actions:</strong> {(phaseData as any).humanActions?.join(', ')}</p>
                      <p className="text-warning"><strong>Challenge Today:</strong> {(phaseData as any).challengeToday}</p>
                    </>
                  )}
                  {key === 'resolution' && (
                    <>
                      <p><strong>Outcome:</strong> {(phaseData as any).outcome}</p>
                      <p><strong>SOC/NOC Role:</strong> {(phaseData as any).socNocRole}</p>
                      <p className="text-warning"><strong>Challenge Today:</strong> {(phaseData as any).challengeToday}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Remediation Dialog */}
      <Dialog open={remediationOpen} onOpenChange={setRemediationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-error" />
              AI Incident Remediation Center
            </DialogTitle>
            <DialogDescription>
              HELIOS is coordinating approval chain and team mobilization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Approval Chain */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Approval Chain
              </h4>
              <div className="space-y-2">
                {approvals.map((approval) => (
                  <div key={approval.level} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      {approval.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                      )}
                      <div>
                        <p className="font-medium">{approval.title}</p>
                        <p className="text-xs text-muted-foreground">{approval.approver} - {approval.role}</p>
                      </div>
                    </div>
                    <Badge className={approval.status === 'approved' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                      {approval.status === 'approved' ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Coordination */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Coordination
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team) => (
                  <div key={team.id} className={cn(
                    "p-3 rounded-lg border transition-all",
                    team.status === 'active' ? "border-success bg-success/5" : "border-border/50"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <team.icon className={cn(
                        "h-4 w-4",
                        team.status === 'active' ? "text-success" : "text-muted-foreground"
                      )} />
                      <span className="font-medium text-sm">{team.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{team.members} members • Lead: {team.lead}</p>
                    <Badge className={cn(
                      "mt-2 text-xs",
                      team.status === 'active' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {team.status === 'active' ? 'Active' : 'Standby'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
