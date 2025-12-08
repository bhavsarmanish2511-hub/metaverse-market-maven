import { Node, Edge } from "reactflow";

export interface PlaybookTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  nodes: Node[];
  edges: Edge[];
  tags: string[];
}

export const playbookTemplates: PlaybookTemplate[] = [
  {
    id: "phishing-response",
    name: "Phishing Email Response",
    description: "Automated workflow for analyzing and responding to reported phishing emails. Extracts indicators, checks reputation, and takes containment actions.",
    category: "Email Security",
    difficulty: "intermediate",
    estimatedTime: "2-3 minutes",
    tags: ["phishing", "email", "automated"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: {
          triggerType: "email",
          label: "Phishing Email Reported",
          description: "User reports suspicious email",
          config: { mailbox: "phishing@company.com" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 250, y: 180 },
        data: {
          actionType: "email",
          label: "Extract Email Headers",
          description: "Parse email headers and metadata",
          parameters: { fields: "sender, subject, links" }
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 250, y: 310 },
        data: {
          actionType: "enrichment",
          label: "Analyze URLs",
          description: "Check URLs against threat intelligence",
          parameters: { service: "VirusTotal", threshold: 2 }
        }
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 440 },
        data: {
          conditionType: "threshold",
          label: "Is Malicious?",
          description: "Check threat score",
          condition: "threat_score > 70"
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 80, y: 570 },
        data: {
          actionType: "block",
          label: "Block Sender Domain",
          description: "Add to email filter blacklist",
          parameters: { scope: "organization-wide" }
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 420, y: 570 },
        data: {
          actionType: "ticket",
          label: "Create Low Priority Ticket",
          description: "Log for review",
          parameters: { priority: "low" }
        }
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 80, y: 700 },
        data: {
          actionType: "database",
          label: "Search Similar Emails",
          description: "Find other instances",
          parameters: { query: "sender_domain" }
        }
      },
      {
        id: "action-6",
        type: "action",
        position: { x: 80, y: 830 },
        data: {
          actionType: "notify",
          label: "Alert Security Team",
          description: "Notify via Slack",
          parameters: { channel: "#security-alerts", priority: "high" }
        }
      },
      {
        id: "action-7",
        type: "action",
        position: { x: 80, y: 960 },
        data: {
          actionType: "ticket",
          label: "Create Incident Ticket",
          description: "Create high priority ticket",
          parameters: { priority: "high", assignee: "soc-team" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "action-2" },
      { id: "e3", source: "action-2", target: "condition-1" },
      { id: "e4", source: "condition-1", sourceHandle: "true", target: "action-3" },
      { id: "e5", source: "condition-1", sourceHandle: "false", target: "action-4" },
      { id: "e6", source: "action-3", target: "action-5" },
      { id: "e7", source: "action-5", target: "action-6" },
      { id: "e8", source: "action-6", target: "action-7" }
    ]
  },
  {
    id: "malware-containment",
    name: "Malware Containment & Remediation",
    description: "Automated response to malware detections. Isolates infected endpoints, kills malicious processes, and initiates cleanup procedures.",
    category: "Endpoint Security",
    difficulty: "advanced",
    estimatedTime: "1-2 minutes",
    tags: ["malware", "endpoint", "containment"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: {
          triggerType: "alert",
          label: "Malware Detected",
          description: "EDR alerts on malicious file",
          config: { source: "CrowdStrike", severity: "critical" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 250, y: 180 },
        data: {
          actionType: "isolate",
          label: "Isolate Endpoint",
          description: "Network isolation via EDR",
          parameters: { method: "network_containment" }
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 250, y: 310 },
        data: {
          actionType: "script",
          label: "Kill Malicious Process",
          description: "Terminate infected process",
          parameters: { action: "process.kill()" }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 250, y: 440 },
        data: {
          actionType: "enrichment",
          label: "Get File Hash Analysis",
          description: "Query VirusTotal for hash",
          parameters: { service: "VirusTotal", type: "file_hash" }
        }
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 570 },
        data: {
          conditionType: "threshold",
          label: "Known Malware?",
          description: "Check detection rate",
          condition: "detections > 5"
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 80, y: 700 },
        data: {
          actionType: "script",
          label: "Delete Malicious File",
          description: "Remove from filesystem",
          parameters: { force: true }
        }
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 420, y: 700 },
        data: {
          actionType: "script",
          label: "Quarantine File",
          description: "Move to secure location",
          parameters: { location: "/quarantine" }
        }
      },
      {
        id: "action-6",
        type: "action",
        position: { x: 250, y: 830 },
        data: {
          actionType: "database",
          label: "Scan for IOCs",
          description: "Search for related indicators",
          parameters: { ioc_types: "file_hash, ip, domain" }
        }
      },
      {
        id: "action-7",
        type: "action",
        position: { x: 250, y: 960 },
        data: {
          actionType: "notify",
          label: "Notify SOC Team",
          description: "Alert analysts",
          parameters: { urgency: "immediate" }
        }
      },
      {
        id: "action-8",
        type: "action",
        position: { x: 250, y: 1090 },
        data: {
          actionType: "ticket",
          label: "Create Incident",
          description: "Document containment",
          parameters: { type: "malware_incident", priority: "critical" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "action-2" },
      { id: "e3", source: "action-2", target: "action-3" },
      { id: "e4", source: "action-3", target: "condition-1" },
      { id: "e5", source: "condition-1", sourceHandle: "true", target: "action-4" },
      { id: "e6", source: "condition-1", sourceHandle: "false", target: "action-5" },
      { id: "e7", source: "action-4", target: "action-6" },
      { id: "e8", source: "action-5", target: "action-6" },
      { id: "e9", source: "action-6", target: "action-7" },
      { id: "e10", source: "action-7", target: "action-8" }
    ]
  },
  {
    id: "data-breach-response",
    name: "Data Breach Response",
    description: "Comprehensive response to data exfiltration attempts. Monitors unusual data transfers, blocks suspicious activity, and initiates incident response.",
    category: "Data Loss Prevention",
    difficulty: "advanced",
    estimatedTime: "3-5 minutes",
    tags: ["data-breach", "dlp", "exfiltration"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: {
          triggerType: "alert",
          label: "Large Data Transfer Detected",
          description: "DLP system alert",
          config: { threshold: "100MB", timeframe: "5min" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 250, y: 180 },
        data: {
          actionType: "database",
          label: "Get User Activity",
          description: "Query recent user actions",
          parameters: { timeframe: "24h" }
        }
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 310 },
        data: {
          conditionType: "comparison",
          label: "Authorized Transfer?",
          description: "Check against approved transfers",
          condition: "transfer_approved == false"
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 80, y: 440 },
        data: {
          actionType: "block",
          label: "Block Transfer",
          description: "Stop data exfiltration",
          parameters: { method: "firewall_block" }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 420, y: 440 },
        data: {
          actionType: "ticket",
          label: "Log for Review",
          description: "Document approved transfer",
          parameters: { priority: "low" }
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 80, y: 570 },
        data: {
          actionType: "script",
          label: "Disable User Account",
          description: "Suspend account temporarily",
          parameters: { duration: "24h" }
        }
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 80, y: 700 },
        data: {
          actionType: "database",
          label: "Identify Transferred Files",
          description: "Catalog affected data",
          parameters: { classification: "all" }
        }
      },
      {
        id: "condition-2",
        type: "condition",
        position: { x: 80, y: 830 },
        data: {
          conditionType: "comparison",
          label: "Sensitive Data?",
          description: "Check data classification",
          condition: "contains_pii || contains_confidential"
        }
      },
      {
        id: "action-6",
        type: "action",
        position: { x: -90, y: 960 },
        data: {
          actionType: "notify",
          label: "Alert Legal Team",
          description: "Notify for compliance",
          parameters: { team: "legal", urgency: "immediate" }
        }
      },
      {
        id: "action-7",
        type: "action",
        position: { x: 250, y: 960 },
        data: {
          actionType: "notify",
          label: "Alert SOC",
          description: "Standard notification",
          parameters: { team: "soc" }
        }
      },
      {
        id: "action-8",
        type: "action",
        position: { x: 80, y: 1090 },
        data: {
          actionType: "ticket",
          label: "Create Breach Incident",
          description: "Initiate incident response",
          parameters: { type: "data_breach", severity: "critical" }
        }
      },
      {
        id: "action-9",
        type: "action",
        position: { x: 80, y: 1220 },
        data: {
          actionType: "email",
          label: "Notify Management",
          description: "Executive notification",
          parameters: { recipients: "ciso@company.com" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "condition-1" },
      { id: "e3", source: "condition-1", sourceHandle: "true", target: "action-2" },
      { id: "e4", source: "condition-1", sourceHandle: "false", target: "action-3" },
      { id: "e5", source: "action-2", target: "action-4" },
      { id: "e6", source: "action-4", target: "action-5" },
      { id: "e7", source: "action-5", target: "condition-2" },
      { id: "e8", source: "condition-2", sourceHandle: "true", target: "action-6" },
      { id: "e9", source: "condition-2", sourceHandle: "false", target: "action-7" },
      { id: "e10", source: "action-6", target: "action-8" },
      { id: "e11", source: "action-7", target: "action-8" },
      { id: "e12", source: "action-8", target: "action-9" }
    ]
  },
  {
    id: "suspicious-login",
    name: "Suspicious Login Investigation",
    description: "Automated investigation of anomalous authentication attempts. Checks user context, location, and device information before taking action.",
    category: "Identity & Access",
    difficulty: "beginner",
    estimatedTime: "1-2 minutes",
    tags: ["authentication", "identity", "anomaly"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: {
          triggerType: "alert",
          label: "Suspicious Login Detected",
          description: "Unusual login pattern detected",
          config: { source: "Okta", risk_score: ">70" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 250, y: 180 },
        data: {
          actionType: "database",
          label: "Get User Profile",
          description: "Retrieve user information",
          parameters: { fields: "location, devices, login_history" }
        }
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 310 },
        data: {
          conditionType: "comparison",
          label: "New Location?",
          description: "Check if location is new",
          condition: "location not in user.known_locations"
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 80, y: 440 },
        data: {
          actionType: "notify",
          label: "Challenge User",
          description: "Require MFA verification",
          parameters: { method: "push_notification" }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 420, y: 440 },
        data: {
          actionType: "ticket",
          label: "Log Event",
          description: "Record for monitoring",
          parameters: { priority: "informational" }
        }
      },
      {
        id: "condition-2",
        type: "condition",
        position: { x: 80, y: 570 },
        data: {
          conditionType: "timeWindow",
          label: "User Responded?",
          description: "Check if MFA completed",
          condition: "within_minutes(5)"
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: -90, y: 700 },
        data: {
          actionType: "script",
          label: "Terminate Session",
          description: "Force logout",
          parameters: { session_id: "current" }
        }
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 250, y: 700 },
        data: {
          actionType: "database",
          label: "Update User Profile",
          description: "Add location to known locations",
          parameters: { action: "add_trusted_location" }
        }
      },
      {
        id: "action-6",
        type: "action",
        position: { x: -90, y: 830 },
        data: {
          actionType: "notify",
          label: "Alert Security Team",
          description: "Potential account compromise",
          parameters: { urgency: "high" }
        }
      },
      {
        id: "action-7",
        type: "action",
        position: { x: -90, y: 960 },
        data: {
          actionType: "ticket",
          label: "Create Security Incident",
          description: "Investigate potential compromise",
          parameters: { type: "account_compromise", priority: "high" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "condition-1" },
      { id: "e3", source: "condition-1", sourceHandle: "true", target: "action-2" },
      { id: "e4", source: "condition-1", sourceHandle: "false", target: "action-3" },
      { id: "e5", source: "action-2", target: "condition-2" },
      { id: "e6", source: "condition-2", sourceHandle: "true", target: "action-5" },
      { id: "e7", source: "condition-2", sourceHandle: "false", target: "action-4" },
      { id: "e8", source: "action-4", target: "action-6" },
      { id: "e9", source: "action-6", target: "action-7" }
    ]
  },
  {
    id: "ddos-mitigation",
    name: "DDoS Attack Mitigation",
    description: "Rapid response to distributed denial of service attacks. Activates DDoS protection, implements rate limiting, and scales infrastructure.",
    category: "Network Security",
    difficulty: "intermediate",
    estimatedTime: "30 seconds - 1 minute",
    tags: ["ddos", "network", "availability"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: {
          triggerType: "alert",
          label: "Traffic Spike Detected",
          description: "Abnormal traffic volume",
          config: { threshold: "10000 req/sec" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 250, y: 180 },
        data: {
          actionType: "api",
          label: "Analyze Traffic Pattern",
          description: "Identify attack characteristics",
          parameters: { analysis: "source_ips, request_patterns" }
        }
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 310 },
        data: {
          conditionType: "threshold",
          label: "DDoS Attack?",
          description: "Verify attack pattern",
          condition: "unique_sources > 1000 && duration > 60s"
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 80, y: 440 },
        data: {
          actionType: "api",
          label: "Enable DDoS Protection",
          description: "Activate Cloudflare protection",
          parameters: { mode: "under_attack" }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 420, y: 440 },
        data: {
          actionType: "ticket",
          label: "Log Traffic Spike",
          description: "Document for analysis",
          parameters: { priority: "low" }
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 80, y: 570 },
        data: {
          actionType: "api",
          label: "Implement Rate Limiting",
          description: "Throttle requests",
          parameters: { rate: "100/min", scope: "ip" }
        }
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 80, y: 700 },
        data: {
          actionType: "block",
          label: "Block Top Attack IPs",
          description: "Geo-block or IP block",
          parameters: { count: 100, duration: "1h" }
        }
      },
      {
        id: "action-6",
        type: "action",
        position: { x: 80, y: 830 },
        data: {
          actionType: "notify",
          label: "Alert Network Team",
          description: "Notify infrastructure team",
          parameters: { team: "netops", method: "pagerduty" }
        }
      },
      {
        id: "action-7",
        type: "action",
        position: { x: 80, y: 960 },
        data: {
          actionType: "ticket",
          label: "Create DDoS Incident",
          description: "Document attack",
          parameters: { type: "ddos_attack", priority: "critical" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "condition-1" },
      { id: "e3", source: "condition-1", sourceHandle: "true", target: "action-2" },
      { id: "e4", source: "condition-1", sourceHandle: "false", target: "action-3" },
      { id: "e5", source: "action-2", target: "action-4" },
      { id: "e6", source: "action-4", target: "action-5" },
      { id: "e7", source: "action-5", target: "action-6" },
      { id: "e8", source: "action-6", target: "action-7" }
    ]
  }
];
