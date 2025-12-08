// Mock data service for real-time simulation

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'SOC' | 'NOC';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
  requiresIRCLeader?: boolean;
}

export interface SystemHealth {
  category: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ThreatData {
  id: string;
  location: { lat: number; lng: number };
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface MetricData {
  timestamp: string;
  value: number;
  category?: string;
}

// Generate mock alerts
export const generateAlerts = (): Alert[] => {
  const socAlerts = [
    {
      id: '0',
      type: 'critical' as const,
      category: 'NOC' as const,
      title: 'Cloud provider outage impacting core services',
      description: 'AWS US-East-1 experiencing severe degradation. HELIOS detected IRC Leader intervention required.',
      timestamp: new Date(Date.now() - 2 * 60000),
      status: 'active' as const,
      requiresIRCLeader: true,
    },
    {
      id: '1',
      type: 'warning' as const,
      category: 'SOC' as const,
      title: 'Potential DDoS Attack Detected',
      description: 'Unusual traffic spike from multiple IPs targeting web servers',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'resolved' as const,
    },
    {
      id: '2',
      type: 'info' as const,
      category: 'SOC' as const,
      title: 'Failed Login Attempts',
      description: 'Multiple failed authentication attempts from IP 192.168.1.45',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'resolved' as const,
    },
    {
      id: '3',
      type: 'info' as const,
      category: 'SOC' as const,
      title: 'Security Patch Applied',
      description: 'Critical security updates deployed across all systems',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'resolved' as const,
    },
  ];

  const nocAlerts = [
    {
      id: '4',
      type: 'info' as const,
      category: 'NOC' as const,
      title: 'High Bandwidth Usage',
      description: 'Network bandwidth exceeding 85% on primary link',
      timestamp: new Date(Date.now() - 10 * 60000),
      status: 'resolved' as const,
    },
    {
      id: '5',
      type: 'warning' as const,
      category: 'NOC' as const,
      title: 'Router Failure Detected',
      description: 'Core router RTR-01 not responding - failover initiated',
      timestamp: new Date(Date.now() - 2 * 60000),
      status: 'resolved' as const,
    },
  ];

  return [...socAlerts, ...nocAlerts];
};

// Generate system health metrics
export const generateSystemHealth = (): SystemHealth[] => {
  return [
    {
      category: 'Network Performance',
      status: 'healthy',
      value: 98.5,
      trend: 'stable',
    },
    {
      category: 'Security Posture',
      status: 'warning',
      value: 85.2,
      trend: 'down',
    },
    {
      category: 'System Availability',
      status: 'healthy',
      value: 99.9,
      trend: 'up',
    },
    {
      category: 'Threat Detection',
      status: 'healthy',
      value: 94.7,
      trend: 'stable',
    },
  ];
};

// Generate mock threat map data
export const generateThreatData = (): ThreatData[] => {
  const threats: ThreatData[] = [];
  const types = ['Malware', 'Phishing', 'DDoS', 'Intrusion', 'Ransomware'];
  const severities = ['low', 'medium', 'high', 'critical'] as const;

  for (let i = 0; i < 20; i++) {
    threats.push({
      id: `threat-${i}`,
      location: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      },
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(Date.now() - Math.random() * 3600000),
    });
  }

  return threats;
};

// Generate time series data for charts
export const generateTimeSeriesData = (hours: number = 24): MetricData[] => {
  const data: MetricData[] = [];
  const now = Date.now();

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000);
    data.push({
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.floor(Math.random() * 100) + 20,
    });
  }

  return data;
};

// Generate multi-category data
export const generateCategoryData = (hours: number = 24): MetricData[] => {
  const data: MetricData[] = [];
  const now = Date.now();
  const categories = ['Threats Blocked', 'Traffic Analyzed', 'Incidents Resolved'];

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    categories.forEach(category => {
      data.push({
        timestamp,
        value: Math.floor(Math.random() * 100) + 20,
        category,
      });
    });
  }

  return data;
};

// Generate real-time metric
export const generateRealtimeMetric = (): number => {
  return Math.floor(Math.random() * 100);
};
