export type AlertSeverity = 'critical' | 'medium' | 'low';
export type AlertStatus = 'active' | 'resolved';
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
  regionalData?: RegionalImpactData[];
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
  howItWorks?: string;
  resolutionPath?: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedTime: string;
  successRate: number;
}

export interface RegionalImpactData {
  region: string;
  peakHoursUTC: string;
  currentTrafficLoad: number;
  revenuePerHour: string;
  currency: string;
  isCurrentlyPeak: boolean;
  failoverTarget: string;
  latencyBaseline: number;
  currentLatency: number;
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
        businessContext: 'Primary cloud region (US-East-1) experiencing severe degradation due to fiber cut affecting Availability Zone A. Payment processing APIs returning 503 errors globally. Customer transactions failing at rate of 847/minute. EU-West-1 currently in peak hours (14:23 UTC), AP-Southeast-1 entering evening peak (16:23 SGT).',
        socRole: 'SOC monitoring SLA breaches via Splunk SIEM. Tracking authentication failures and API anomalies. Correlating with AWS Health Dashboard for official incident status. No indicators of malicious activity - confirmed infrastructure issue.',
        nocRole: 'NOC tracking connectivity via SolarWinds NMS. BGP routing instability detected on primary circuits. Latency spikes from 23ms to 1,847ms. AWS Direct Connect links showing intermittent packet loss of 34%.',
      },
      detection: {
        whatHappens: 'SIEM showing 12,847 API failure events in last 15 minutes. Error rate increased from 0.01% to 34.7%. AWS CloudWatch triggered automated alarm at 08:20 UTC. Payment gateway health checks failing from all external monitoring points.',
        challengeToday: 'No unified view correlating cloud provider status, application health, and business impact. SOC and NOC operating in separate dashboards with 3-minute data lag.',
        futureState: 'HELIOS Predictive Analytics Agent forecasts 2-hour downtime window based on similar AWS incidents. Estimated $4.6M potential SLA penalty exposure if not mitigated within 45 minutes.',
      },
      decision: {
        leaderRole: 'Approve automated failover to US-West-2 via XDR playbook. Override default prioritization to protect EU traffic first (currently in peak hours at €1.2M/hour). Initiate War Room with Engineering, Customer Success, and Finance stakeholders.',
        socNocFunctionality: 'XDR executes pre-approved failover scripts. NOC applies emergency BGP route changes via Cisco DNA Center. AWS Route 53 health checks trigger automatic DNS failover.',
        challengeToday: 'Failover decisions require 3-level approval chain. Manual coordination between 4 teams. Average decision time: 23 minutes.',
      },
      action: {
        automatedActions: [
          'Route 53 DNS failover triggered - TTL reduced to 60 seconds',
          'Application Load Balancer health checks updated to 10-second intervals',
          'Aurora Global Database promoting US-West-2 read replica to primary (RPO: 0, RTO: <1 minute)',
          'ElastiCache cluster failover initiated to secondary region',
          'CloudFront origin failover activated for dynamic content',
        ],
        humanActions: [
          'Leader escalating to AWS Enterprise Support via TAM direct line (Case ID: AWS-7834521)',
          'Engineering team validating data consistency post-Aurora promotion',
          'Customer Success preparing proactive communication for 23 enterprise clients (>$1M ARR)',
          'Finance team calculating real-time revenue impact by region',
        ],
        challengeToday: 'Vendor escalation requires manual ticket creation. SLA reporting pulls data from 6 different systems.',
      },
      resolution: {
        outcome: 'Failover completed in 14 minutes 23 seconds. 96.7% of traffic restored. Remaining 3.3% requires client-side DNS cache expiration (TTL-dependent). RCA initiated with AWS - confirmed cause: fiber cut affecting AZ-A in US-East-1.',
        socNocRole: 'SOC logging comprehensive RCA in ServiceNow (INC0847234). NOC documenting BGP changes and updating runbook. Automated playbook capturing lessons learned.',
        challengeToday: 'RCA assembly requires manual data collection from 12 tools. Playbook updates are manual and often delayed 2-3 weeks.',
      },
      aiRecommendations: [
        'Execute immediate failover to US-West-2 - 94.7% historical success rate for AZ-level outages',
        'Prioritize EU-West-1 traffic routing first (currently €1.2M/hour peak) before AP-Southeast-1 (¥890K/hour)',
        'Pre-scale US-West-2 ECS services by 340% based on incoming traffic redistribution',
        'Enable Route 53 Application Recovery Controller for coordinated multi-service failover',
        'Extend Aurora connection timeout from 30s to 120s during Global Database promotion',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Route 53 DNS Failover', status: 'completed', duration: '2m 34s', dependencies: [] },
        { id: 'WF-002', name: 'Aurora Global DB Promotion', status: 'in-progress', duration: '8m 12s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'ECS Service Scaling', status: 'in-progress', duration: '5m 47s', dependencies: ['WF-001'] },
        { id: 'WF-004', name: 'ALB Target Registration', status: 'pending', duration: 'Est. 3m', dependencies: ['WF-002', 'WF-003'] },
        { id: 'WF-005', name: 'Health Check Validation', status: 'pending', duration: 'Est. 2m', dependencies: ['WF-004'] },
        { id: 'WF-006', name: 'Traffic Steering Complete', status: 'pending', duration: 'Est. 4m', dependencies: ['WF-005'] },
      ],
      simulationScenarios: [
        { 
          id: 'SIM-001', 
          name: 'Full Regional Failover to US-West-2', 
          description: 'Complete traffic migration using Route 53 ARC and Aurora Global Database. Maintains data consistency with zero RPO.',
          howItWorks: 'Route 53 Application Recovery Controller triggers coordinated failover across all services. Aurora Global Database promotes US-West-2 read replica to primary writer (RTO <60s, RPO 0). ALB target groups update to US-West-2 ECS tasks. CloudFront origins switch to Oregon edge locations. ElastiCache replication promotes secondary cluster.',
          resolutionPath: '1. Route 53 ARC initiates failover sequence → 2. Aurora Global DB promotes replica (45-60s) → 3. ECS services register with new ALB targets (2-3min) → 4. Health checks validate endpoint availability → 5. DNS TTL expiration completes traffic shift → 6. Monitor for 5 minutes post-failover → 7. Confirm data consistency via checksums',
          riskLevel: 'medium', 
          estimatedTime: '15 minutes', 
          successRate: 87.3 
        },
        { 
          id: 'SIM-002', 
          name: 'Prioritized EU/APAC Traffic Steering', 
          description: 'Migrate EU-West-1 and AP-Southeast-1 traffic first (currently in peak hours), maintain US traffic on degraded primary with aggressive rate limiting.',
          howItWorks: 'Route 53 weighted routing policies redirect EU traffic to EU-Central-1 (Frankfurt) and APAC traffic to AP-Northeast-1 (Tokyo). US-East-1 traffic gets rate-limited to 30% capacity via ALB rules. This preserves revenue in peak regions while minimizing impact during US off-peak hours.',
          resolutionPath: '1. Update Route 53 weighted policies (EU: 100% → Frankfurt, APAC: 100% → Tokyo) → 2. Apply ALB rate limiting rules for US traffic → 3. Scale EU-Central-1 and AP-Northeast-1 by 200% → 4. Monitor latency and error rates per region → 5. Gradual US traffic migration after EU/APAC stable → 6. Full failover if US-East-1 degrades further',
          riskLevel: 'low', 
          estimatedTime: '8 minutes', 
          successRate: 94.6 
        },
        { 
          id: 'SIM-003', 
          name: 'Hybrid Failover with Cache Warming', 
          description: 'Partial failover with pre-warmed ElastiCache clusters in secondary region to minimize cold-start latency impact.',
          howItWorks: 'Before executing full failover, initiate cache replication from US-East-1 to US-West-2 ElastiCache. This prevents cache miss storms that typically cause 40% performance degradation post-failover. Aurora read replica handles read traffic while cache warms.',
          resolutionPath: '1. Trigger ElastiCache cross-region replication → 2. Wait for cache sync (3-5 min for hot keys) → 3. Route read traffic to Aurora US-West-2 replica → 4. Promote Aurora replica to primary → 5. Switch write traffic → 6. Validate cache hit ratio >85% → 7. Complete DNS failover',
          riskLevel: 'medium', 
          estimatedTime: '12 minutes', 
          successRate: 91.2 
        },
        { 
          id: 'SIM-004', 
          name: 'Wait for AWS Recovery', 
          description: 'Monitor AWS status page and wait for provider resolution. AWS ETA: 45 minutes. High risk of extended SLA breach.',
          howItWorks: 'Passive monitoring approach relying on AWS infrastructure team to resolve the underlying fiber cut. Continuous polling of AWS Health Dashboard API. Customer communication prepared but not sent. All automated failover mechanisms on standby.',
          resolutionPath: '1. Monitor AWS Health Dashboard every 60 seconds → 2. Track AWS Case ID: AWS-7834521 for updates → 3. Prepare customer communication templates → 4. Keep failover runbooks ready for manual trigger → 5. Escalate to AWS TAM at 30-minute mark if no progress → 6. Auto-trigger failover if error rate exceeds 50%',
          riskLevel: 'high', 
          estimatedTime: '45-90 minutes (AWS dependent)', 
          successRate: 62.8 
        },
        { 
          id: 'SIM-005', 
          name: 'Graceful Degradation Mode', 
          description: 'Enable circuit breakers and serve cached responses for non-critical endpoints while payment APIs fail over.',
          howItWorks: 'Hystrix circuit breakers activate for non-essential services (analytics, recommendations, notifications). CDN serves stale cached content for static pages. Only payment-critical paths get priority routing to healthy infrastructure. Reduces blast radius while preserving core revenue.',
          resolutionPath: '1. Activate circuit breakers for non-critical services → 2. Configure CDN stale-while-revalidate for 30 minutes → 3. Priority queue payment API requests → 4. Failover only payment-gateway and auth services → 5. Monitor payment success rate target: >95% → 6. Gradually restore non-critical services post-recovery',
          riskLevel: 'low', 
          estimatedTime: '5 minutes', 
          successRate: 96.4 
        },
      ],
      regionalData: [
        {
          region: 'EU-West-1 (Ireland)',
          peakHoursUTC: '09:00-17:00 UTC',
          currentTrafficLoad: 89,
          revenuePerHour: '€1,200,000',
          currency: 'EUR',
          isCurrentlyPeak: true,
          failoverTarget: 'EU-Central-1 (Frankfurt)',
          latencyBaseline: 18,
          currentLatency: 1247,
        },
        {
          region: 'AP-Southeast-1 (Singapore)',
          peakHoursUTC: '01:00-09:00 UTC',
          currentTrafficLoad: 72,
          revenuePerHour: '¥890,000,000',
          currency: 'JPY',
          isCurrentlyPeak: true,
          failoverTarget: 'AP-Northeast-1 (Tokyo)',
          latencyBaseline: 45,
          currentLatency: 1834,
        },
        {
          region: 'US-East-1 (N. Virginia)',
          peakHoursUTC: '13:00-21:00 UTC',
          currentTrafficLoad: 34,
          revenuePerHour: '$847,000',
          currency: 'USD',
          isCurrentlyPeak: false,
          failoverTarget: 'US-West-2 (Oregon)',
          latencyBaseline: 23,
          currentLatency: 1847,
        },
      ],
    },
  },
  {
    id: 'INC-2024-002',
    title: 'Medium: DDoS Attack Detected on Authentication Services',
    severity: 'medium',
    status: 'active',
    timestamp: '2024-12-04T09:15:00Z',
    source: 'Cloudflare WAF / Threat Intelligence',
    affectedSystems: ['Auth0 Integration', 'SSO Gateway', 'MFA Services'],
    businessImpact: 'User login success rate dropped to 43%',
    slaRisk: 'Authentication SLA at risk - 99.9% target',
    region: 'Global',
    phase: 'detection',
    details: {
      situation: {
        businessContext: 'Layer 7 DDoS attack targeting authentication endpoints. 2.3 million requests/second from 47 countries via IoT botnet. Legitimate users experiencing 15-second login delays. Attack coincides with EU business hours.',
        socRole: 'SOC correlating attack patterns with Mirai botnet variant signatures. Cross-referencing IP addresses with threat intelligence feeds (CrowdStrike, VirusTotal). No data exfiltration indicators detected.',
        nocRole: 'NOC monitoring bandwidth saturation on edge nodes. 340 Gbps inbound traffic vs 45 Gbps baseline. Implementing rate limiting on /auth/* endpoints.',
      },
      detection: {
        whatHappens: 'Cloudflare WAF blocking 89% of malicious traffic. Remaining 11% (253K req/s) overwhelming Auth0 rate limits. Attack pattern: credential stuffing combined with HTTP flood.',
        challengeToday: 'Manual correlation between WAF logs and authentication metrics. No automated threat scoring for L7 attacks.',
        futureState: 'HELIOS Threat Intelligence Agent automatically correlates attack vectors and recommends geo-blocking thresholds.',
      },
      decision: {
        leaderRole: 'Approve emergency geo-blocking for top 5 attacking source countries. Enable Cloudflare Under Attack Mode. Authorize Auth0 Enterprise scaling from 50K to 250K logins/minute.',
        socNocFunctionality: 'WAF deploys custom rate limiting rules. NOC provisions additional authentication capacity via Auth0 API.',
        challengeToday: 'Geo-blocking requires legal review for GDPR compliance. Auth0 scaling takes 8-10 minutes.',
      },
      action: {
        automatedActions: [
          'Cloudflare JS Challenge deployed for suspicious traffic patterns',
          'Rate limiting: 10 requests/minute per IP on /auth/* endpoints',
          'Bot Management: Enable ML-based bot scoring threshold at 30',
          'Auth0 rate limit increased via Emergency API override',
        ],
        humanActions: [
          'Security team preparing IOC report for threat intel sharing',
          'Legal confirming geo-blocking compliance for RU, CN, BR, ID, VN',
          'Customer Support preparing macro for authentication issue inquiries',
        ],
        challengeToday: 'Manual deployment of WAF rules across 23 edge locations.',
      },
      resolution: {
        outcome: 'Attack mitigated within 34 minutes. Authentication restored to 99.7% success rate. No credential compromise detected. IOCs shared with ISAC.',
        socNocRole: 'SOC documenting attack vectors for threat intelligence sharing. NOC optimizing permanent rate limiting policies.',
        challengeToday: 'Post-incident threat sharing is manual process via email.',
      },
      aiRecommendations: [
        'Enable Cloudflare Under Attack Mode immediately - 96.4% effectiveness for similar L7 attacks',
        'Implement adaptive rate limiting based on user behavior patterns',
        'Pre-authorize geo-blocking for high-risk countries during attack conditions',
        'Deploy additional Auth0 capacity in anticipation of attack escalation',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Threat Assessment', status: 'completed', duration: '4m 12s', dependencies: [] },
        { id: 'WF-002', name: 'WAF Rule Deployment', status: 'in-progress', duration: '12m 34s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Auth0 Capacity Scaling', status: 'pending', duration: 'Est. 8m', dependencies: ['WF-001'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Cloudflare Under Attack Mode', description: 'Enable JS challenge for all visitors. Legitimate users see 5-second interstitial.', howItWorks: 'Cloudflare WAF enables JavaScript challenge that requires browser execution, filtering out bot traffic that cannot execute JS. Legitimate users pass challenge automatically after 5-second verification.', resolutionPath: '1. Enable Under Attack Mode via Cloudflare API → 2. Monitor challenge pass rate → 3. Adjust sensitivity threshold based on false positives → 4. Disable after attack subsides', riskLevel: 'low', estimatedTime: '2 minutes', successRate: 89.7 },
        { id: 'SIM-002', name: 'Geo-Block Attack Sources', description: 'Block traffic from top attacking countries: RU, CN, BR, ID, VN. May affect 0.3% legitimate users.', howItWorks: 'WAF firewall rules block all traffic originating from identified attack source countries at edge level. GDPR-compliant blocking with appropriate error messaging for affected regions.', resolutionPath: '1. Analyze attack source IPs by country → 2. Deploy geo-blocking rules via WAF → 3. Monitor blocked request volume → 4. Review false positive reports → 5. Gradually whitelist legitimate IPs', riskLevel: 'medium', estimatedTime: '5 minutes', successRate: 84.3 },
        { id: 'SIM-003', name: 'Adaptive Rate Limiting', description: 'Implement behavioral rate limiting based on request patterns and user reputation scores.', howItWorks: 'ML-based bot scoring analyzes request patterns, device fingerprints, and behavioral signals. Requests scoring below threshold get rate-limited progressively rather than blocked outright.', resolutionPath: '1. Enable bot management ML scoring → 2. Set threshold at score 30 → 3. Apply progressive rate limits (10→5→1 req/min) → 4. Monitor authentication success rate → 5. Tune thresholds based on results', riskLevel: 'low', estimatedTime: '8 minutes', successRate: 92.1 },
      ],
    },
  },
  {
    id: 'INC-2024-003',
    title: 'Medium: Aurora PostgreSQL Replication Lag Exceeding Threshold',
    severity: 'medium',
    status: 'active',
    timestamp: '2024-12-04T07:45:00Z',
    source: 'AWS CloudWatch / Datadog APM',
    affectedSystems: ['Aurora PostgreSQL Primary', 'Read Replicas (3)', 'Analytics Pipeline', 'Reporting Dashboard'],
    businessImpact: 'Real-time analytics delayed by 23 seconds, stale data in customer dashboards',
    slaRisk: 'Analytics SLA at 98.5% (target: 99%)',
    region: 'US-East-1',
    phase: 'action',
    details: {
      situation: {
        businessContext: 'Aurora PostgreSQL replication lag causing stale data in analytics dashboards. BI reports showing outdated metrics. Triggered by marketing campaign generating 340% increase in write IOPS.',
        socRole: 'SOC monitoring for potential data integrity issues. No unauthorized access patterns detected. Write surge correlates with scheduled marketing email blast.',
        nocRole: 'NOC tracking database performance metrics. Writer instance at 89% CPU, storage IOPS at 94% of provisioned capacity.',
      },
      detection: {
        whatHappens: 'Replication lag increased from 200ms to 23 seconds. AuroraReplicaLag CloudWatch metric triggered alarm. Correlated with campaign start at 07:30 UTC.',
        challengeToday: 'No automated correlation between application events (marketing campaigns) and database performance.',
        futureState: 'HELIOS Predictive Analytics forecasts replication issues 15 minutes in advance based on scheduled events.',
      },
      decision: {
        leaderRole: 'Approve storage IOPS increase from 10K to 30K. Authorize read traffic redistribution to reduce replica load.',
        socNocFunctionality: 'DBA team modifying Aurora storage configuration. Application team enabling read query routing optimization.',
        challengeToday: 'Aurora storage scaling takes 15-20 minutes to take effect.',
      },
      action: {
        automatedActions: [
          'Aurora storage IOPS increased from 10,000 to 30,000 via modify-db-cluster',
          'Read replica promotion temporarily disabled to prioritize replication',
          'Connection pooling via PgBouncer adjusted: pool_mode=transaction',
          'Slow query logging enabled for queries >1 second',
        ],
        humanActions: [
          'DBA reviewing pg_stat_statements for query optimization opportunities',
          'Application team implementing read query caching with 30-second TTL',
          'Marketing team notified of database constraints for future campaigns',
        ],
        challengeToday: 'Database scaling requires coordination across 3 teams.',
      },
      resolution: {
        outcome: 'Replication lag reduced to 450ms after IOPS increase took effect. Campaign traffic normalized after 2 hours.',
        socNocRole: 'Documenting capacity requirements. Creating runbook for marketing campaign database prep.',
        challengeToday: 'Capacity planning documentation scattered across multiple tools.',
      },
      aiRecommendations: [
        'Increase Aurora storage IOPS immediately - 15-20 minute propagation time',
        'Schedule future batch operations during low-traffic windows (2-5 AM UTC)',
        'Implement Aurora Serverless v2 for automatic capacity scaling during campaigns',
        'Pre-provision additional IOPS 24 hours before scheduled marketing events',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'Performance Diagnosis', status: 'completed', duration: '6m 45s', dependencies: [] },
        { id: 'WF-002', name: 'IOPS Scaling Initiated', status: 'completed', duration: '2m 12s', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'IOPS Propagation', status: 'in-progress', duration: '18m 34s', dependencies: ['WF-002'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Increase Provisioned IOPS', description: 'Scale Aurora storage from 10K to 30K IOPS. Takes 15-20 minutes to propagate.', howItWorks: 'Aurora storage auto-scaling triggered via modify-db-cluster API. IOPS increase allows writer instance to handle higher write throughput, reducing replication queue backlog.', resolutionPath: '1. Execute modify-db-cluster with new IOPS value → 2. Monitor StorageIOPS CloudWatch metric → 3. Wait for "storage-optimization" status → 4. Verify replication lag reduction → 5. Document baseline for capacity planning', riskLevel: 'low', estimatedTime: '20 minutes', successRate: 97.8 },
        { id: 'SIM-002', name: 'Enable Read Query Caching', description: 'Implement application-level caching with 30-second TTL. Immediate effect but introduces stale data risk.', howItWorks: 'Redis cache layer intercepts read queries and serves cached results. Cache invalidation on write operations. Reduces read replica load by 60-70% for frequently accessed data.', resolutionPath: '1. Deploy Redis cache configuration → 2. Update application connection strings → 3. Set TTL based on data freshness requirements → 4. Monitor cache hit ratio → 5. Implement cache warming for critical queries', riskLevel: 'medium', estimatedTime: '5 minutes', successRate: 88.4 },
        { id: 'SIM-003', name: 'Query Optimization Sprint', description: 'Identify and optimize top 10 slow queries contributing to replication lag.', howItWorks: 'Analyze pg_stat_statements for queries with highest total_time. Add missing indexes, rewrite inefficient JOINs, and implement query hints for problematic execution plans.', resolutionPath: '1. Query pg_stat_statements for top offenders → 2. Run EXPLAIN ANALYZE on slow queries → 3. Add covering indexes where beneficial → 4. Rewrite queries using CTEs where applicable → 5. Monitor query execution time post-optimization', riskLevel: 'low', estimatedTime: '45 minutes', successRate: 82.6 },
      ],
    },
  },
  {
    id: 'INC-2024-004',
    title: 'Low: SSL/TLS Certificate Expiring in 7 Days',
    severity: 'low',
    status: 'active',
    timestamp: '2024-12-04T06:00:00Z',
    source: 'AWS Certificate Manager / SSL Labs',
    affectedSystems: ['api.securenet.io', 'portal.securenet.io'],
    businessImpact: 'Potential service disruption if not renewed by December 11, 2024',
    slaRisk: 'No immediate SLA risk - proactive alert',
    region: 'Global',
    phase: 'situation',
    details: {
      situation: {
        businessContext: 'ACM-managed certificates for two production domains expiring December 11, 2024. Auto-renewal failed due to DNS validation issue - Route 53 CNAME record missing after recent DNS migration.',
        socRole: 'SOC verifying certificate chain integrity. No indicators of certificate compromise or MitM attempts. Routine certificate lifecycle event.',
        nocRole: 'NOC coordinating with DNS team to restore ACM validation CNAME records in Route 53.',
      },
      detection: {
        whatHappens: 'ACM Certificate Status changed from "Issued" to "Pending validation". CloudWatch alarm triggered at 7-day expiration threshold.',
        challengeToday: 'Certificate management across 47 domains is partially automated. DNS migration broke ACM validation chain.',
        futureState: 'HELIOS automates certificate lifecycle management with 30-day advance warnings and automatic DNS validation.',
      },
      decision: {
        leaderRole: 'Approve DNS record restoration. No escalation required - standard operational procedure.',
        socNocFunctionality: 'NOC updating Route 53 hosted zone with ACM CNAME validation records.',
        challengeToday: 'Cross-team coordination for certificate renewals averages 3 days.',
      },
      action: {
        automatedActions: [
          'ACM renewal validation pending - awaiting DNS record propagation',
          'CloudWatch alarm configured for renewal status monitoring',
          'Backup certificate request submitted as contingency',
        ],
        humanActions: [
          'DNS team adding _acme-challenge CNAME records to Route 53',
          'Security team validating certificate configuration post-renewal',
          'Runbook updated with DNS migration checklist for ACM certificates',
        ],
        challengeToday: 'Manual DNS record creation required after migration.',
      },
      resolution: {
        outcome: 'DNS records restored. ACM validation succeeded. Certificate renewed with new expiration: December 4, 2025.',
        socNocRole: 'Documenting DNS migration impact on ACM. Updating change management process.',
        challengeToday: 'No automated post-renewal validation workflow.',
      },
      aiRecommendations: [
        'Restore Route 53 CNAME records for ACM DNS validation - standard procedure',
        'Implement automated DNS validation check in CI/CD pipeline',
        'Migrate to wildcard certificates to reduce management overhead',
        'Configure 45-day advance renewal to allow for validation issues',
      ],
      workflowImpact: [
        { id: 'WF-001', name: 'DNS Record Restoration', status: 'in-progress', duration: '1h 23m', dependencies: [] },
        { id: 'WF-002', name: 'ACM Validation', status: 'pending', duration: 'Est. 30m', dependencies: ['WF-001'] },
        { id: 'WF-003', name: 'Certificate Deployment', status: 'pending', duration: 'Est. 15m', dependencies: ['WF-002'] },
      ],
      simulationScenarios: [
        { id: 'SIM-001', name: 'Restore DNS + Auto-Renew', description: 'Add ACM CNAME records to Route 53, trigger automatic certificate renewal via DNS validation.', howItWorks: 'ACM DNS validation requires specific CNAME records in Route 53 hosted zone. Once records propagate, ACM automatically validates domain ownership and issues renewed certificate.', resolutionPath: '1. Retrieve ACM validation CNAME from certificate details → 2. Add record to Route 53 hosted zone → 3. Wait for DNS propagation (5-10 min) → 4. ACM validates and renews certificate → 5. Verify certificate status changes to "Issued"', riskLevel: 'low', estimatedTime: '30 minutes', successRate: 99.2 },
        { id: 'SIM-002', name: 'Manual Certificate Import', description: 'Generate Let\'s Encrypt certificate using certbot and import to ACM manually as backup approach.', howItWorks: 'Certbot generates certificate via ACME protocol with HTTP-01 challenge. Certificate files are then imported to ACM, which handles distribution to CloudFront and ALB.', resolutionPath: '1. Run certbot with HTTP-01 challenge → 2. Verify domain ownership via web server → 3. Download certificate files (cert, chain, key) → 4. Import to ACM via aws acm import-certificate → 5. Update CloudFront/ALB to use new certificate ARN', riskLevel: 'low', estimatedTime: '2 hours', successRate: 99.9 },
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
  { id: 'offensive_tester', name: 'Offensive Tester', description: 'Security Assessment', icon: 'Target' },
];
