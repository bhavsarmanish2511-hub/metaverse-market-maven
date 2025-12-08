import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Target, Globe, Server, Cloud, Database, Wifi, AlertTriangle, Shield, RefreshCw, Search, ExternalLink } from 'lucide-react';

const assetCategories = [
  { name: 'Web Applications', count: 47, critical: 8, icon: Globe, color: 'text-blue-500' },
  { name: 'API Endpoints', count: 156, critical: 23, icon: Server, color: 'text-green-500' },
  { name: 'Cloud Services', count: 34, critical: 5, icon: Cloud, color: 'text-purple-500' },
  { name: 'Databases', count: 18, critical: 4, icon: Database, color: 'text-orange-500' },
  { name: 'Network Devices', count: 89, critical: 12, icon: Wifi, color: 'text-cyan-500' },
];

const discoveredAssets = [
  { id: 1, name: 'api.company.com', type: 'API Gateway', risk: 'critical', ports: [443, 8080], lastScan: '2 hours ago' },
  { id: 2, name: 'admin.internal.net', type: 'Admin Panel', risk: 'high', ports: [443, 22], lastScan: '4 hours ago' },
  { id: 3, name: 'db-primary.prod', type: 'PostgreSQL', risk: 'high', ports: [5432], lastScan: '1 day ago' },
  { id: 4, name: 'legacy-app.company.com', type: 'Web Application', risk: 'critical', ports: [80, 443], lastScan: '6 hours ago' },
  { id: 5, name: 's3-backup.aws', type: 'S3 Bucket', risk: 'medium', ports: [443], lastScan: '12 hours ago' },
  { id: 6, name: 'vpn.company.com', type: 'VPN Gateway', risk: 'low', ports: [443, 1194], lastScan: '3 hours ago' },
];

const riskColors = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-warning text-warning-foreground',
  medium: 'bg-orange-500/20 text-orange-400',
  low: 'bg-success/20 text-success',
};

export default function AttackSurface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const filteredAssets = discoveredAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/20 rounded-lg">
            <Target className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Attack Surface Management</h1>
            <p className="text-muted-foreground">Discover, map, and monitor external attack vectors</p>
          </div>
        </div>
        <Button onClick={handleScan} disabled={isScanning} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Run Discovery'}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {assetCategories.map((category) => (
          <Card key={category.name} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <category.icon className={`h-5 w-5 ${category.color}`} />
                {category.critical > 0 && (
                  <Badge variant="destructive" className="text-xs">{category.critical} Critical</Badge>
                )}
              </div>
              <div className="text-2xl font-bold">{category.count}</div>
              <p className="text-xs text-muted-foreground">{category.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Discovered Assets</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{asset.name}</span>
                        <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>Ports: {asset.ports.join(', ')}</span>
                        <span>•</span>
                        <span>Last scan: {asset.lastScan}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={riskColors[asset.risk as keyof typeof riskColors]}>
                      {asset.risk.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-destructive">Critical</span>
                  <span>52 assets</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-warning">High</span>
                  <span>87 assets</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-400">Medium</span>
                  <span>124 assets</span>
                </div>
                <Progress value={36} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-success">Low</span>
                  <span>81 assets</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Shield className="h-4 w-4" />
                <span>Coverage Score</span>
              </div>
              <div className="text-3xl font-bold text-warning">78%</div>
              <p className="text-xs text-muted-foreground mt-1">22% of assets need assessment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
