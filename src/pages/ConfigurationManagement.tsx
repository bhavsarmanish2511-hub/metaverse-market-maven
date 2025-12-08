import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw,
  Search,
  Settings,
  Play,
  History,
  Users,
  FileCode
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for network devices
const devices = [
  { 
    id: 1, 
    name: "Core-SW-01", 
    ip: "192.168.1.1", 
    type: "Switch", 
    vendor: "Cisco", 
    model: "Catalyst 9300", 
    firmware: "17.6.3", 
    lastBackup: "2 hours ago",
    configStatus: "compliant",
    changes: 0
  },
  { 
    id: 2, 
    name: "Edge-RTR-02", 
    ip: "192.168.1.2", 
    type: "Router", 
    vendor: "Cisco", 
    model: "ISR 4451", 
    firmware: "17.3.4", 
    lastBackup: "5 hours ago",
    configStatus: "warning",
    changes: 2
  },
  { 
    id: 3, 
    name: "FW-01", 
    ip: "192.168.1.10", 
    type: "Firewall", 
    vendor: "Palo Alto", 
    model: "PA-3220", 
    firmware: "10.2.3", 
    lastBackup: "1 hour ago",
    configStatus: "compliant",
    changes: 0
  },
  { 
    id: 4, 
    name: "Dist-SW-03", 
    ip: "192.168.1.3", 
    type: "Switch", 
    vendor: "Arista", 
    model: "7050SX3", 
    firmware: "4.28.2F", 
    lastBackup: "3 hours ago",
    configStatus: "critical",
    changes: 5
  },
  { 
    id: 5, 
    name: "Access-SW-10", 
    ip: "192.168.1.20", 
    type: "Switch", 
    vendor: "Cisco", 
    model: "Catalyst 2960X", 
    firmware: "15.2.7", 
    lastBackup: "24 hours ago",
    configStatus: "warning",
    changes: 1
  },
];

// Mock configuration change history
const configHistory = [
  {
    id: 1,
    device: "Core-SW-01",
    timestamp: "2024-01-20 14:30:00",
    user: "admin@company.com",
    action: "Manual Edit",
    changes: "Added VLAN 100",
    status: "approved"
  },
  {
    id: 2,
    device: "Edge-RTR-02",
    timestamp: "2024-01-20 13:15:00",
    user: "network.ops@company.com",
    action: "Config Backup",
    changes: "Scheduled backup completed",
    status: "success"
  },
  {
    id: 3,
    device: "Dist-SW-03",
    timestamp: "2024-01-20 12:00:00",
    user: "system",
    action: "Auto-Rollback",
    changes: "Unauthorized SNMP config change detected",
    status: "reverted"
  },
  {
    id: 4,
    device: "FW-01",
    timestamp: "2024-01-20 10:45:00",
    user: "security.team@company.com",
    action: "Policy Update",
    changes: "Updated firewall rules",
    status: "approved"
  },
];

// Mock compliance policies
const compliancePolicies = [
  {
    id: 1,
    name: "Password Policy",
    description: "Enable secret for all privileged access",
    compliant: 42,
    violations: 3,
    severity: "high"
  },
  {
    id: 2,
    name: "SNMP Security",
    description: "SNMPv3 with encryption enabled",
    compliant: 40,
    violations: 5,
    severity: "critical"
  },
  {
    id: 3,
    name: "AAA Configuration",
    description: "TACACS+ or RADIUS authentication",
    compliant: 45,
    violations: 0,
    severity: "high"
  },
  {
    id: 4,
    name: "SSH Version",
    description: "SSH version 2 only, disable telnet",
    compliant: 43,
    violations: 2,
    severity: "medium"
  },
];

// Mock configlets (automation templates)
const configlets = [
  {
    id: 1,
    name: "Change Enable Password",
    description: "Update enable password across all devices",
    category: "Security",
    lastUsed: "2024-01-19",
    devices: 45
  },
  {
    id: 2,
    name: "Add Management VLAN",
    description: "Configure management VLAN on switches",
    category: "Network",
    lastUsed: "2024-01-18",
    devices: 30
  },
  {
    id: 3,
    name: "Update NTP Servers",
    description: "Configure NTP servers for time sync",
    category: "System",
    lastUsed: "2024-01-20",
    devices: 45
  },
  {
    id: 4,
    name: "SNMP Community String Rotation",
    description: "Rotate SNMP community strings quarterly",
    category: "Security",
    lastUsed: "2024-01-15",
    devices: 45
  },
];

const ConfigurationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<typeof devices[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Compliant</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Warning</Badge>;
      case "critical":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Critical</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getActionBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "success":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{status}</Badge>;
      case "reverted":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ip.includes(searchQuery) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuration Management</h1>
        <p className="text-muted-foreground">
          Network Configuration Manager - Backup, restore, and audit device configurations
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              5 pending backup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93.3%</div>
            <p className="text-xs text-muted-foreground">
              10 violations detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Config Changes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h ago</div>
            <p className="text-xs text-muted-foreground">
              All devices backed up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">
            <Server className="h-4 w-4 mr-2" />
            Device Inventory
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Change History
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="configlets">
            <FileCode className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Device Inventory Tab */}
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Network Device Inventory</CardTitle>
                  <CardDescription>Manage and monitor all network devices</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Backup All
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search devices by name, IP, or type..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vendor/Model</TableHead>
                      <TableHead>Firmware</TableHead>
                      <TableHead>Last Backup</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-muted-foreground">{device.ip}</div>
                          </div>
                        </TableCell>
                        <TableCell>{device.type}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{device.vendor}</div>
                            <div className="text-xs text-muted-foreground">{device.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>{device.firmware}</TableCell>
                        <TableCell>{device.lastBackup}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(device.configStatus)}
                            {device.changes > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {device.changes} change{device.changes > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" title="Backup Config">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Restore Config">
                              <Upload className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="View Config">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Settings">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Change History</CardTitle>
              <CardDescription>Track all configuration changes and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">{entry.timestamp}</TableCell>
                        <TableCell className="font-medium">{entry.device}</TableCell>
                        <TableCell className="text-sm">{entry.user}</TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell className="text-sm">{entry.changes}</TableCell>
                        <TableCell>{getActionBadge(entry.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" title="View Details">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Compare">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Policies & Auditing</CardTitle>
                  <CardDescription>Monitor compliance with organizational and industry standards</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compliancePolicies.map((policy) => (
                  <Card key={policy.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{policy.name}</CardTitle>
                            {getSeverityBadge(policy.severity)}
                          </div>
                          <CardDescription>{policy.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              <span className="font-semibold">{policy.compliant}</span> Compliant
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">
                              <span className="font-semibold">{policy.violations}</span> Violations
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configlets/Automation Tab */}
        <TabsContent value="configlets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuration Templates (Configlets)</CardTitle>
                  <CardDescription>Automate repetitive configuration tasks across devices</CardDescription>
                </div>
                <Button>
                  <FileCode className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {configlets.map((configlet) => (
                  <Card key={configlet.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{configlet.name}</CardTitle>
                            <Badge variant="outline">{configlet.category}</Badge>
                          </div>
                          <CardDescription>{configlet.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Server className="h-3 w-3" />
                            <span>{configlet.devices} devices</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last used: {configlet.lastUsed}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm">
                            <Play className="h-3 w-3 mr-2" />
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationManagement;
