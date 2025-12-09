export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'investigating' | 'mitigating' | 'resolved';
export type IncidentPhase = 'situation' | 'detection' | 'decision' | 'action' | 'resolution';

export interface OffensiveTesterAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  source: string;
  affectedSystems: string[];
  businessImpact: string;
  slaRisk: string;
  region: string;
  phase: IncidentPhase;
  details: AlertDetails;
}

export interface AlertDetails {
  situation: {
    businessContext: string;
    socRole: string;
    nocRole: string;
  };
  detection: {
    whatHappens: string;
    challengeToday: string;
    futureState: string;
  };
  decision: {
    testerRole: string;
    socNocFunctionality: string;
    challengeToday: string;
  };
  action: {
    automatedActions: string[];
    humanActions: string[];
    challengeToday: string;
  };
  resolution: {
    outcome: string;
    socNocRole: string;
    challengeToday: string;
  };
  aiRecommendations: string[];
  workflowImpact: WorkflowStep[];
  simulationScenarios: SimulationScenario[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  duration: string;
  dependencies: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedTime: string;
  successRate: number;
}

export const offensiveTesterAlerts: OffensiveTesterAlert[] = [
  {
    id: 'OT-2024-001',
    title: 'Critical: AI Model Poisoning Attempt via Compromised API',
    severity: 'critical',
    status: 'active',
    timestamp: new Date().toISOString(),
    source: 'SIEM / Threat Intelligence Platform',
    affectedSystems: ['Predictive Analytics Engine', 'ML Pipeline API', 'Data Quality Service', 'Model Registry'],
    businessImpact: 'Risk of poisoned AI decisions affecting business analytics',
    slaRisk: 'Model integrity compromised - Immediate action required',
    region: 'Global',
    phase: 'detection',
    details: {
      situation: {
        businessContext: 'Predictive analytics engine shows drift; risk of poisoned AI decisions. Adversarial inputs detected in training data pipeline via compromised API endpoint.',
        socRole: 'SOC monitors anomalies via SIEM. Correlating API access patterns with known attack signatures. Tracking model behavior deviations.',
        nocRole: 'NOC ensures API connectivity and monitors network traffic patterns. Tracking data flow to ML pipelines.',
      },
      detection: {
        whatHappens: 'Tester runs adversarial simulation; SIEM flags anomalies in model input patterns. TIP confirms global campaign targeting AI pipelines across multiple organizations.',
        challengeToday: 'No native AI integrity monitoring in SOC/NOC tools. Model drift detection relies on manual analysis.',
        futureState: 'HELIOS Model Integrity Agent validates model health continuously and detects adversarial inputs in real-time.',
      },
      decision: {
        testerRole: 'Recommends isolation of compromised API. Requests rollback to clean model checkpoint. Initiates forensic analysis of poisoned data.',
        socNocFunctionality: 'XDR executes API isolation playbook. ITSM logs rollback request and tracks remediation progress.',
        challengeToday: 'Manual sandbox validation slows response. No automated model integrity verification.',
      },
      action: {
        automatedActions: [
          'XDR disconnects compromised API endpoint',
          'Model Registry triggers rollback to last verified checkpoint',
          'Data Quality Agent applies anomaly filters to input pipeline',
          'Quarantine poisoned training data samples',
          'Enable enhanced API authentication requirements',
        ],
        humanActions: [
          'Tester validates rollback integrity via adversarial testing',
          'Updates adversarial testing playbook with new attack vectors',
          'Security team performs forensic analysis on compromised API',
          'ML team reviews model behavior post-restoration',
        ],
        challengeToday: 'RCA for AI incidents is manual and delayed. No standardized AI incident response procedures.',
      },
      resolution: {
        outcome: 'AI model restored to clean state; poisoned data quarantined. RCA generated with zero-trust API integration recommended. Attack vector documented for future prevention.',
        socNocRole: 'SOC logs comprehensive RCA in SIEM. NOC updates API routing policies and implements additional network monitoring.',
        challengeToday: 'Vulnerability scanning doesn\'t cover AI/ML threats. Limited tooling for AI-specific security assessments.',
      },
      aiRecommendations: [
        'Implement model integrity monitoring with continuous validation checks',
        'Deploy adversarial input detection at API gateway level',
        'Enable zero-trust architecture for all ML pipeline APIs',
        'Create AI-specific incident response playbook for future attacks',
        'Implement data provenance tracking for training datasets',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'API Isolation', status: 'completed', duration: '1m 23s', dependencies: [] },
        { id: 'WF-002', name: 'Model Rollback', status: 'in-progress', duration: '4m 56s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Data Quarantine', status: 'in-progress', duration: '3m 12s', dependencies: ['WF-001'] },
        { id: 'WF-004', name: 'Integrity Verification', status: 'pending', duration: 'Est. 8m', dependencies: ['WF-002'] },
        { id: 'WF-005', name: 'API Security Hardening', status: 'pending', duration: 'Est. 15m', dependencies: ['WF-003'] },
        { id: 'WF-006', name: 'Model Validation', status: 'pending', duration: 'Est. 20m', dependencies: ['WF-004', 'WF-005'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Full Model Rollback', description: 'Complete rollback to last verified clean checkpoint', riskLevel: 'medium', estimatedTime: '25 minutes', successRate: 96.2 },
        { id: 'SIM-002', name: 'Partial Data Cleansing', description: 'Remove only identified poisoned samples, retrain incrementally', riskLevel: 'high', estimatedTime: '45 minutes', successRate: 78.5 },
        { id: 'SIM-003', name: 'API Quarantine Only', description: 'Isolate API while maintaining current model state', riskLevel: 'low', estimatedTime: '5 minutes', successRate: 99.1 },
      ],
    },
  },
  {
    id: 'OT-2024-002',
    title: 'High: Unauthorized API Access Pattern Detected',
    severity: 'high',
    status: 'investigating',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'API Gateway / WAF',
    affectedSystems: ['Public API Gateway', 'Internal Microservices', 'Authentication Service'],
    businessImpact: 'Potential data exfiltration risk',
    slaRisk: 'Security breach investigation in progress',
    region: 'US-East-1',
    phase: 'detection',
    details: {
      situation: {
        businessContext: 'Unusual API access patterns detected from multiple geographic locations using valid credentials. Possible credential stuffing or token theft.',
        socRole: 'SOC analyzing access logs and correlating with known threat patterns.',
        nocRole: 'NOC monitoring bandwidth and connection patterns for anomalies.',
      },
      detection: {
        whatHappens: 'WAF flagging unusual request volumes. API rate limits triggered for multiple accounts simultaneously.',
        challengeToday: 'Manual correlation of API logs across multiple services.',
        futureState: 'HELIOS API Security Agent provides unified visibility and automated threat response.',
      },
      decision: {
        testerRole: 'Initiates credential validation sweep. Recommends token rotation for affected accounts.',
        socNocFunctionality: 'XDR initiates account lockdown procedures. SIEM correlates with historical attack patterns.',
        challengeToday: 'No automated credential health monitoring.',
      },
      action: {
        automatedActions: [
          'Rate limiting enforced on suspicious accounts',
          'Token blacklisting initiated',
          'Enhanced logging enabled for affected endpoints',
        ],
        humanActions: [
          'Security team reviewing access patterns',
          'User accounts flagged for password reset',
          'Legal team notified for potential breach reporting',
        ],
        challengeToday: 'Manual account remediation process.',
      },
      resolution: {
        outcome: 'Compromised credentials identified and revoked. Users notified for password reset.',
        socNocRole: 'SOC documenting attack vectors. NOC implementing additional network controls.',
        challengeToday: 'Limited visibility into third-party credential leaks.',
      },
      aiRecommendations: [
        'Implement behavioral analytics for API access patterns',
        'Deploy continuous credential monitoring against known breach databases',
        'Enable adaptive MFA for high-risk API operations',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Pattern Analysis', status: 'completed', duration: '8m 34s', dependencies: [] },
        { id: 'WF-002', name: 'Credential Audit', status: 'in-progress', duration: '15m 22s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Token Rotation', status: 'pending', duration: 'Est. 10m', dependencies: ['WF-002'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Mass Token Revocation', description: 'Revoke all active tokens and force re-authentication', riskLevel: 'medium', estimatedTime: '10 minutes', successRate: 100 },
        { id: 'SIM-002', name: 'Targeted Account Lockdown', description: 'Lock only flagged accounts', riskLevel: 'low', estimatedTime: '3 minutes', successRate: 95.6 },
      ],
    },
  },
];
