import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, Users, Shield, Settings, Search, Plus, Trash2, Edit, 
  UserPlus, Key, Lock, Unlock, Activity, AlertTriangle, Check,
  X, RefreshCw, Download, Upload, Eye, EyeOff
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@org.com', role: 'analyst', status: 'active', lastLogin: '2024-01-15 09:30', createdAt: '2023-06-01' },
  { id: '2', name: 'Sarah Connor', email: 'sarah.connor@org.com', role: 'irc_leader', status: 'active', lastLogin: '2024-01-15 08:45', createdAt: '2023-05-15' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@org.com', role: 'offensive_tester', status: 'active', lastLogin: '2024-01-14 16:20', createdAt: '2023-07-20' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@org.com', role: 'analyst', status: 'inactive', lastLogin: '2024-01-10 11:00', createdAt: '2023-08-10' },
  { id: '5', name: 'Robert Wilson', email: 'robert.wilson@org.com', role: 'analyst', status: 'suspended', lastLogin: '2024-01-05 14:30', createdAt: '2023-04-25' },
];

const mockRoles: Role[] = [
  { 
    id: '1', 
    name: 'Resilient Command Centre Head', 
    description: 'Super admin with complete access to all features and admin console',
    permissions: ['all'],
    userCount: 1,
    isSystem: true
  },
  { 
    id: '2', 
    name: 'Integrated Operations Analyst', 
    description: 'SOC/NOC unified view with monitoring capabilities',
    permissions: ['view_dashboard', 'view_alerts', 'view_reports', 'manage_incidents'],
    userCount: 15,
    isSystem: true
  },
  { 
    id: '3', 
    name: 'IRC Leader', 
    description: 'Incident command authority with escalation privileges',
    permissions: ['view_dashboard', 'manage_incidents', 'escalate_alerts', 'initiate_war_room', 'approve_actions'],
    userCount: 5,
    isSystem: true
  },
  { 
    id: '4', 
    name: 'Offensive Tester', 
    description: 'Red team operations with penetration testing access',
    permissions: ['view_dashboard', 'run_scans', 'execute_exploits', 'manage_vulnerabilities'],
    userCount: 8,
    isSystem: true
  },
];

const allPermissions = [
  { id: 'view_dashboard', name: 'View Dashboard', category: 'General' },
  { id: 'view_alerts', name: 'View Alerts', category: 'General' },
  { id: 'view_reports', name: 'View Reports', category: 'General' },
  { id: 'manage_incidents', name: 'Manage Incidents', category: 'Operations' },
  { id: 'escalate_alerts', name: 'Escalate Alerts', category: 'Operations' },
  { id: 'initiate_war_room', name: 'Initiate War Room', category: 'IRC' },
  { id: 'approve_actions', name: 'Approve Actions', category: 'IRC' },
  { id: 'run_scans', name: 'Run Scans', category: 'Offensive' },
  { id: 'execute_exploits', name: 'Execute Exploits', category: 'Offensive' },
  { id: 'manage_vulnerabilities', name: 'Manage Vulnerabilities', category: 'Offensive' },
  { id: 'manage_users', name: 'Manage Users', category: 'Admin' },
  { id: 'manage_roles', name: 'Manage Roles', category: 'Admin' },
  { id: 'system_settings', name: 'System Settings', category: 'Admin' },
];

export default function AdminConsole() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'role'; id: string; name: string } | null>(null);
  
  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', password: '' });
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });
  const [showPassword, setShowPassword] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: '', password: '' });
    setShowAddUserDialog(false);
    toast({ title: "User Added", description: `${user.name} has been added successfully` });
  };

  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      isSystem: false,
    };
    
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setShowAddRoleDialog(false);
    toast({ title: "Role Created", description: `${role.name} has been created successfully` });
  };

  const handleUpdateRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
    setShowEditRoleDialog(false);
    setSelectedRole(null);
    toast({ title: "Role Updated", description: "Role has been updated successfully" });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'user') {
      setUsers(users.filter(u => u.id !== deleteTarget.id));
      toast({ title: "User Deleted", description: `${deleteTarget.name} has been removed` });
    } else {
      setRoles(roles.filter(r => r.id !== deleteTarget.id));
      toast({ title: "Role Deleted", description: `${deleteTarget.name} has been removed` });
    }
    
    setShowDeleteConfirmDialog(false);
    setDeleteTarget(null);
  };

  const confirmDelete = (type: 'user' | 'role', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteConfirmDialog(true);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        toast({ 
          title: newStatus === 'active' ? "User Activated" : "User Suspended",
          description: `${u.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}`
        });
        return { ...u, status: newStatus as 'active' | 'suspended' };
      }
      return u;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'rcc_head': return <Badge className="bg-warning/20 text-warning border-warning/30"><Crown className="h-3 w-3 mr-1" />RCC Head</Badge>;
      case 'irc_leader': return <Badge className="bg-primary/20 text-primary border-primary/30">IRC Leader</Badge>;
      case 'offensive_tester': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Offensive</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <Crown className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Console</h1>
            <p className="text-muted-foreground text-sm">Resilient Command Centre Head - Global Administration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Activity className="h-8 w-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Defined Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Shield className="h-8 w-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Suspended</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'suspended').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit, and manage user accounts and their roles</CardDescription>
              </div>
              <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="irc_leader">IRC Leader</SelectItem>
                    <SelectItem value="offensive_tester">Offensive Tester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? (
                                <Lock className="h-4 w-4 text-destructive" />
                              ) : (
                                <Unlock className="h-4 w-4 text-success" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => confirmDelete('user', user.id, user.name)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Define and manage roles with specific permissions</CardDescription>
              </div>
              <Button onClick={() => setShowAddRoleDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Role
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id} className="border-border/30 bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {role.name === 'Resilient Command Centre Head' && (
                              <Crown className="h-4 w-4 text-warning" />
                            )}
                            <h3 className="font-semibold">{role.name}</h3>
                            {role.isSystem && (
                              <Badge variant="outline" className="text-xs">System</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.includes('all') ? (
                              <Badge className="bg-warning/20 text-warning border-warning/30">Full Access</Badge>
                            ) : (
                              role.permissions.slice(0, 5).map((perm) => (
                                <Badge key={perm} variant="secondary" className="text-xs">{perm.replace('_', ' ')}</Badge>
                              ))
                            )}
                            {role.permissions.length > 5 && (
                              <Badge variant="outline" className="text-xs">+{role.permissions.length - 5} more</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold">{role.userCount}</p>
                            <p className="text-xs text-muted-foreground">users</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedRole(role);
                                setShowEditRoleDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!role.isSystem && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => confirmDelete('role', role.id, role.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure global security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enforce Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Failed Login Lockout</Label>
                    <p className="text-sm text-muted-foreground">Lock account after failed attempts</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Audit & Compliance</CardTitle>
                <CardDescription>Configure audit logging and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Log Retention</Label>
                    <p className="text-sm text-muted-foreground">How long to keep logs</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>Create a new user account with role assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Enter full name" 
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="Enter email address" 
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(r => r.name !== 'Resilient Command Centre Head').map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter temporary password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>
              <Check className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Create New Role
            </DialogTitle>
            <DialogDescription>Define a new role with specific permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input 
                placeholder="Enter role name" 
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                placeholder="Enter role description" 
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-48 border rounded-md p-3">
                <div className="space-y-3">
                  {Object.entries(
                    allPermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof allPermissions>)
                  ).map(([category, perms]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-center gap-2">
                            <Switch 
                              id={perm.id}
                              checked={newRole.permissions.includes(perm.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRole({ ...newRole, permissions: [...newRole.permissions, perm.id] });
                                } else {
                                  setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== perm.id) });
                                }
                              }}
                            />
                            <Label htmlFor={perm.id} className="text-sm cursor-pointer">{perm.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRole}>
              <Check className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRoleDialog} onOpenChange={setShowEditRoleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Role
            </DialogTitle>
            <DialogDescription>Modify role settings and permissions</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input 
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                  disabled={selectedRole.isSystem}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                />
              </div>
              {!selectedRole.permissions.includes('all') && (
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <ScrollArea className="h-48 border rounded-md p-3">
                    <div className="space-y-3">
                      {Object.entries(
                        allPermissions.reduce((acc, perm) => {
                          if (!acc[perm.category]) acc[perm.category] = [];
                          acc[perm.category].push(perm);
                          return acc;
                        }, {} as Record<string, typeof allPermissions>)
                      ).map(([category, perms]) => (
                        <div key={category}>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">{category}</p>
                          <div className="space-y-2">
                            {perms.map((perm) => (
                              <div key={perm.id} className="flex items-center gap-2">
                                <Switch 
                                  id={`edit-${perm.id}`}
                                  checked={selectedRole.permissions.includes(perm.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedRole({ ...selectedRole, permissions: [...selectedRole.permissions, perm.id] });
                                    } else {
                                      setSelectedRole({ ...selectedRole, permissions: selectedRole.permissions.filter(p => p !== perm.id) });
                                    }
                                  }}
                                />
                                <Label htmlFor={`edit-${perm.id}`} className="text-sm cursor-pointer">{perm.name}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteTarget?.type === 'user' ? 'user' : 'role'} "{deleteTarget?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
