export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'investigating' | 'mitigating' | 'resolved';
export type IncidentPhase = 'situation' | 'detection' | 'decision' | 'action' | 'resolution';

export interface IRCAlert {
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
    leaderRole: string;
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

export const ircAlerts: IRCAlert[] = [
  {
    id: 'INC-2024-001',
    title: 'Critical: AWS US-East-1 Cloud Provider Outage - Payment APIs Disrupted',
    severity: 'critical',
    status: 'active',
    timestamp: '2024-12-04T08:23:00Z',
    source: 'AWS CloudWatch / SIEM',
    affectedSystems: ['Payment Gateway API', 'Customer Database', 'Authentication Services', 'CDN Edge Nodes'],
    businessImpact: 'Global payment processing disrupted - $2.3M/hour revenue at risk',
    slaRisk: 'SLA breach in 45 minutes - 99.99% uptime commitment',
    region: 'US-East-1, EU-West-1, AP-Southeast-1',
    phase: 'detection',
    details: {
      situation: {
        businessContext: 'Primary cloud region (US-East-1) experiencing severe degradation. Payment processing APIs returning 503 errors globally. Customer transactions failing at rate of 847/minute. Peak business hours in EU/APAC regions.',
        socRole: 'SOC monitoring SLA breaches via Splunk SIEM. Tracking authentication failures and API anomalies. Correlating with threat intelligence for potential DDoS indicators.',
        nocRole: 'NOC tracking connectivity via SolarWinds NMS. BGP routing instability detected. Latency spikes from 23ms to 1,847ms on primary circuits.',
      },
      detection: {
        whatHappens: 'SIEM showing 12,847 API failure events in last 15 minutes. Error rate increased from 0.01% to 34.7%. Predictive analytics flagged anomaly 3 minutes before first customer impact.',
        challengeToday: 'No unified view correlating cloud provider status, application health, and business impact. SOC and NOC operating in separate dashboards.',
        futureState: 'HELIOS Predictive Analytics Agent forecasts 2-hour downtime window and $4.6M potential SLA penalty exposure.',
      },
      decision: {
        leaderRole: 'Approve automated failover to US-West-2 via XDR playbook. Override default prioritization to protect EU/APAC revenue streams (peak hours). Initiate War Room with stakeholders from Engineering, Customer Success, and Finance.',
        socNocFunctionality: 'XDR executes pre-approved failover scripts. NOC applies emergency routing changes via Cisco DNA Center. Traffic steering to secondary cloud region initiated.',
        challengeToday: 'Failover decisions require 3-level approval chain. Manual coordination between 4 teams. Average decision time: 23 minutes.',
      },
      action: {
        automatedActions: [
          'XDR spinning up 847 redundant containers in US-West-2',
          'DNS TTL reduced to 60 seconds globally',
          'Load balancer health checks updated to 10-second intervals',
          'Database read replicas promoted in secondary region',
          'CDN cache invalidation triggered for dynamic content',
        ],
        humanActions: [
          'Leader escalating to AWS Enterprise Support (TAM direct line)',
          'Communicating status to C-suite via Slack executive channel',
          'Customer Success preparing proactive communication for enterprise clients',
          'Finance team calculating real-time revenue impact',
        ],
        challengeToday: 'Vendor escalation requires manual ticket creation. SLA reporting pulls data from 6 different systems.',
      },
      resolution: {
        outcome: 'Failover completed in 14 minutes 23 seconds. 96.7% of traffic restored. Remaining 3.3% requires manual DNS cache flush at client ISPs. RCA initiated with AWS - preliminary cause: fiber cut affecting AZ-A.',
        socNocRole: 'SOC logging comprehensive RCA in ServiceNow. NOC updating routing policies and documenting BGP changes. Playbook automatically updated with lessons learned.',
        challengeToday: 'RCA assembly requires manual data collection from 12 tools. Playbook updates are manual and often delayed 2-3 weeks.',
      },
      aiRecommendations: [
        'Recommend immediate failover to US-West-2 based on 94.7% historical success rate for similar incidents',
        'Suggest prioritizing EU payment gateway (€847K/hour) over APAC (¥423K/hour) if partial failover required',
        'Pre-emptively scale authentication services by 340% based on post-failover traffic patterns',
        'Alert Customer Success to prepare communication for 23 enterprise clients with >$1M annual contracts',
        'Recommend extending database connection pool timeout from 30s to 120s during transition',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Failover Initiation', status: 'completed', duration: '2m 34s', dependencies: [] },
        { id: 'WF-002', name: 'DNS Propagation', status: 'in-progress', duration: '8m 12s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Database Sync', status: 'in-progress', duration: '5m 47s', dependencies: ['WF-001'] },
        { id: 'WF-004', name: 'Load Balancer Update', status: 'pending', duration: 'Est. 3m', dependencies: ['WF-002'] },
        { id: 'WF-005', name: 'Health Check Validation', status: 'pending', duration: 'Est. 2m', dependencies: ['WF-003', 'WF-004'] },
        { id: 'WF-006', name: 'Traffic Steering', status: 'pending', duration: 'Est. 4m', dependencies: ['WF-005'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Full Failover to US-West-2', description: 'Complete traffic migration to secondary region', riskLevel: 'medium', estimatedTime: '15 minutes', successRate: 94.7 },
        { id: 'SIM-002', name: 'Partial Failover (EU/APAC only)', description: 'Migrate only international traffic, keep US on degraded primary', riskLevel: 'low', estimatedTime: '8 minutes', successRate: 98.2 },
        { id: 'SIM-003', name: 'Wait for AWS Recovery', description: 'Monitor AWS status, no active intervention', riskLevel: 'high', estimatedTime: 'Unknown (AWS ETA: 45 min)', successRate: 67.3 },
      ],
    },
  },
  {
    id: 'INC-2024-002',
    title: 'High: DDoS Attack Detected on Authentication Services',
    severity: 'high',
    status: 'investigating',
    timestamp: '2024-12-04T09:15:00Z',
    source: 'Cloudflare WAF / Threat Intelligence',
    affectedSystems: ['Auth0 Integration', 'SSO Gateway', 'MFA Services'],
    businessImpact: 'User login success rate dropped to 43%',
    slaRisk: 'Authentication SLA at risk - 99.9% target',
    region: 'Global',
    phase: 'detection',
    details: {
      situation: {
        businessContext: 'Distributed denial of service attack targeting authentication endpoints. 2.3 million requests/second from 47 countries. Legitimate users experiencing 15-second login delays.',
        socRole: 'SOC correlating attack patterns with known botnet signatures. Cross-referencing IP addresses with threat intelligence feeds.',
        nocRole: 'NOC monitoring bandwidth saturation on edge nodes. Implementing rate limiting on affected endpoints.',
      },
      detection: {
        whatHappens: 'WAF blocking 89% of malicious traffic. Remaining 11% overwhelming authentication infrastructure. Pattern matches Mirai botnet variant.',
        challengeToday: 'Manual correlation between WAF logs and authentication metrics. No automated threat scoring.',
        futureState: 'HELIOS Threat Intelligence Agent automatically correlates and scores threat severity.',
      },
      decision: {
        leaderRole: 'Approve emergency geo-blocking for top 5 attacking countries. Enable enhanced bot detection. Authorize scaling authentication infrastructure by 500%.',
        socNocFunctionality: 'XDR deploys additional WAF rules. NOC provisions additional authentication capacity.',
        challengeToday: 'Geo-blocking requires legal review for GDPR compliance. 2-hour minimum delay.',
      },
      action: {
        automatedActions: [
          'WAF rules updated with new attack signatures',
          'Rate limiting enabled: 10 requests/minute per IP',
          'CAPTCHA challenge deployed for suspicious traffic',
        ],
        humanActions: [
          'Security team analyzing attack source for attribution',
          'Legal reviewing geo-blocking compliance',
          'PR preparing statement for potential customer inquiries',
        ],
        challengeToday: 'Manual deployment of WAF rules across 23 edge locations.',
      },
      resolution: {
        outcome: 'Attack mitigated within 34 minutes. No data breach detected. Authentication restored to 99.7% success rate.',
        socNocRole: 'SOC documenting attack vectors for threat intelligence sharing. NOC optimizing rate limiting policies.',
        challengeToday: 'Post-incident threat sharing is manual process.',
      },
      aiRecommendations: [
        'Implement adaptive rate limiting based on user behavior patterns',
        'Pre-authorize geo-blocking for known high-risk countries during attacks',
        'Deploy additional authentication pods in anticipation of attack escalation',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Threat Assessment', status: 'completed', duration: '4m 12s', dependencies: [] },
        { id: 'WF-002', name: 'WAF Rule Deployment', status: 'in-progress', duration: '12m 34s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Capacity Scaling', status: 'pending', duration: 'Est. 8m', dependencies: ['WF-001'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Full Geo-Block', description: 'Block all traffic from attacking countries', riskLevel: 'medium', estimatedTime: '5 minutes', successRate: 96.4 },
        { id: 'SIM-002', name: 'Enhanced CAPTCHA', description: 'Deploy CAPTCHA for all authentication attempts', riskLevel: 'low', estimatedTime: '2 minutes', successRate: 87.3 },
      ],
    },
  },
  {
    id: 'INC-2024-003',
    title: 'Medium: Database Replication Lag Exceeding Threshold',
    severity: 'medium',
    status: 'mitigating',
    timestamp: '2024-12-04T07:45:00Z',
    source: 'PostgreSQL Monitoring / Datadog',
    affectedSystems: ['Primary Database', 'Read Replicas', 'Analytics Pipeline'],
    businessImpact: 'Real-time analytics delayed by 23 seconds',
    slaRisk: 'Analytics SLA at 98.5% (target: 99%)',
    region: 'US-East-1',
    phase: 'action',
    details: {
      situation: {
        businessContext: 'Database replication lag causing stale data in analytics dashboards. Business intelligence reports showing outdated metrics.',
        socRole: 'SOC monitoring for potential data integrity issues or unauthorized access patterns.',
        nocRole: 'NOC tracking database performance metrics and network latency between primary and replicas.',
      },
      detection: {
        whatHappens: 'Replication lag increased from 200ms to 23 seconds. Correlated with 340% increase in write operations.',
        challengeToday: 'No automated correlation between application load and database performance.',
        futureState: 'HELIOS Predictive Analytics predicts replication issues 15 minutes in advance.',
      },
      decision: {
        leaderRole: 'Approve temporary write throttling. Authorize emergency replica provisioning.',
        socNocFunctionality: 'Database team implementing connection pooling optimization.',
        challengeToday: 'Manual capacity planning based on historical averages.',
      },
      action: {
        automatedActions: [
          'Connection pool size increased from 100 to 250',
          'Query optimization for high-frequency writes',
          'Provisioning additional read replica',
        ],
        humanActions: [
          'DBA reviewing slow query logs',
          'Application team optimizing batch write operations',
        ],
        challengeToday: 'Database scaling requires 15-minute provisioning time.',
      },
      resolution: {
        outcome: 'Replication lag reduced to 450ms. Additional replica online and serving traffic.',
        socNocRole: 'Documenting capacity requirements for future scaling.',
        challengeToday: 'Capacity planning documentation scattered across multiple tools.',
      },
      aiRecommendations: [
        'Schedule batch operations during low-traffic windows (2-5 AM UTC)',
        'Implement write-ahead log compression to reduce replication bandwidth',
        'Pre-provision additional capacity before marketing campaigns',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Diagnosis', status: 'completed', duration: '6m 45s', dependencies: [] },
        { id: 'WF-002', name: 'Throttling Applied', status: 'completed', duration: '2m 12s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Replica Provisioning', status: 'in-progress', duration: '12m 34s', dependencies: ['WF-001'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Add Read Replica', description: 'Provision additional read replica to distribute load', riskLevel: 'low', estimatedTime: '15 minutes', successRate: 99.1 },
        { id: 'SIM-002', name: 'Write Throttling', description: 'Temporarily limit write operations to 80%', riskLevel: 'medium', estimatedTime: '2 minutes', successRate: 94.5 },
      ],
    },
  },
  {
    id: 'INC-2024-004',
    title: 'Low: SSL Certificate Expiring in 7 Days',
    severity: 'low',
    status: 'active',
    timestamp: '2024-12-04T06:00:00Z',
    source: 'Certificate Monitoring / SSL Labs',
    affectedSystems: ['api.securenet.io', 'portal.securenet.io'],
    businessImpact: 'Potential service disruption if not renewed',
    slaRisk: 'No immediate SLA risk',
    region: 'Global',
    phase: 'situation',
    details: {
      situation: {
        businessContext: 'SSL certificates for two production domains expiring December 11, 2024. Auto-renewal failed due to DNS validation issue.',
        socRole: 'SOC verifying certificate chain integrity and monitoring for potential man-in-the-middle attempts.',
        nocRole: 'NOC coordinating with DNS team to resolve validation issues.',
      },
      detection: {
        whatHappens: 'Automated certificate monitoring detected renewal failure. DNS TXT record missing for domain validation.',
        challengeToday: 'Certificate management across 47 domains is manual process.',
        futureState: 'HELIOS automates certificate lifecycle management with 30-day advance warnings.',
      },
      decision: {
        leaderRole: 'Approve expedited manual certificate renewal. Schedule DNS team for immediate remediation.',
        socNocFunctionality: 'NOC updating DNS records. Security team validating new certificate configuration.',
        challengeToday: 'Cross-team coordination for certificate renewals averages 3 days.',
      },
      action: {
        automatedActions: [
          'Backup certificate generated and staged',
          'Monitoring alerts configured for renewal status',
        ],
        humanActions: [
          'DNS team adding validation TXT records',
          'Security team preparing certificate deployment',
        ],
        challengeToday: 'Manual certificate deployment requires 4-hour maintenance window.',
      },
      resolution: {
        outcome: 'DNS records updated. Certificate renewal in progress. Expected completion: 2 hours.',
        socNocRole: 'Documenting renewal process for automation improvement.',
        challengeToday: 'No automated post-renewal validation.',
      },
      aiRecommendations: [
        'Implement automated DNS validation for all certificate renewals',
        'Migrate to wildcard certificates to reduce management overhead',
        'Configure 45-day advance renewal to allow for validation issues',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'DNS Update', status: 'in-progress', duration: '1h 23m', dependencies: [] },
        { id: 'WF-002', name: 'Certificate Renewal', status: 'pending', duration: 'Est. 30m', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Deployment', status: 'pending', duration: 'Est. 15m', dependencies: ['WF-002'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Auto-Renew Retry', description: 'Retry automatic renewal after DNS fix', riskLevel: 'low', estimatedTime: '30 minutes', successRate: 99.8 },
        { id: 'SIM-002', name: 'Manual Certificate', description: 'Generate and deploy certificate manually', riskLevel: 'low', estimatedTime: '2 hours', successRate: 100 },
      ],
    },
  },
];

export type UserRole = 'irc_leader' | 'ops_analyst' | 'offensive_tester' | null;

export interface RoleOption {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
}

export const roleOptions: RoleOption[] = [
  { id: 'irc_leader', name: 'IRC Leader', description: 'Incident Response Commander', icon: 'Shield' },
  { id: 'ops_analyst', name: 'Integrated Operations Analyst', description: 'SOC/NOC Operations', icon: 'Activity' },
  { id: 'offensive_tester', name: 'Offensive Tester', description: 'Red Team Operations', icon: 'Target' },
];
