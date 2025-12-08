import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyRound, Play, Pause, Upload, Download, AlertTriangle, CheckCircle2, XCircle, Clock, Database, Shield, Hash } from 'lucide-react';

const attackModes = [
  { id: 'dictionary', name: 'Dictionary Attack', description: 'Use wordlist to test common passwords', icon: Database },
  { id: 'bruteforce', name: 'Brute Force', description: 'Try all possible combinations', icon: Hash },
  { id: 'hybrid', name: 'Hybrid Attack', description: 'Dictionary + rule-based mutations', icon: Shield },
];

const activeJobs = [
  { id: 1, target: 'NTLM Hashes (DC-01)', mode: 'Dictionary', progress: 78, speed: '12.5 MH/s', found: 234, remaining: '~2h 15m', status: 'running' },
  { id: 2, target: 'SSH Keys (Prod Servers)', mode: 'Hybrid', progress: 45, speed: '8.2 MH/s', found: 12, remaining: '~5h 30m', status: 'running' },
  { id: 3, target: 'Web App MD5 Hashes', mode: 'Brute Force', progress: 100, speed: '-', found: 89, remaining: '-', status: 'completed' },
];

const crackedCredentials = [
  { hash: 'aad3b435b51404...', username: 'admin', password: 'P@ssw0rd123!', source: 'DC-01', crackTime: '0.3s' },
  { hash: '5f4dcc3b5aa765...', username: 'jsmith', password: 'Summer2024', source: 'Web App', crackTime: '1.2s' },
  { hash: 'e10adc3949ba59...', username: 'service_acct', password: '123456', source: 'DC-01', crackTime: '0.1s' },
  { hash: 'd8578edf8458ce...', username: 'backup_admin', password: 'qwerty', source: 'Backup Server', crackTime: '0.1s' },
  { hash: '25d55ad283aa40...', username: 'db_user', password: '12345678', source: 'Database', crackTime: '0.2s' },
];

const wordlists = [
  { name: 'rockyou.txt', size: '14.3 GB', entries: '14,344,391', type: 'Common' },
  { name: 'darkweb_2023.txt', size: '8.7 GB', entries: '987,654,321', type: 'Breach' },
  { name: 'corporate_patterns.txt', size: '245 MB', entries: '2,456,789', type: 'Custom' },
  { name: 'seasonal_mutations.txt', size: '512 MB', entries: '5,234,567', type: 'Rules' },
];

export default function CredentialTesting() {
  const [activeTab, setActiveTab] = useState('attacks');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/20 rounded-lg">
            <KeyRound className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Credential Testing</h1>
            <p className="text-muted-foreground">Password cracking and credential validation tools</p>
          </div>
        </div>
        <Button className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground">
          <Play className="h-4 w-4" />
          New Attack
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">335</div>
                <p className="text-xs text-muted-foreground">Credentials Cracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Hash className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">12,456</div>
                <p className="text-xs text-muted-foreground">Hashes Loaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">20.7 MH/s</div>
                <p className="text-xs text-muted-foreground">Current Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">67%</div>
                <p className="text-xs text-muted-foreground">Weak Password Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attack Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {attackModes.map((mode) => (
          <Card key={mode.id} className="border-border/50 hover:border-warning/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <mode.icon className="h-5 w-5 text-warning" />
                </div>
                <span className="font-medium">{mode.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="attacks">Active Attacks</TabsTrigger>
          <TabsTrigger value="cracked">Cracked Credentials</TabsTrigger>
          <TabsTrigger value="wordlists">Wordlists</TabsTrigger>
        </TabsList>

        <TabsContent value="attacks" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Running Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{job.target}</span>
                        <Badge variant="outline">{job.mode}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Speed: {job.speed}</span>
                        <span>•</span>
                        <span>Found: {job.found}</span>
                        <span>•</span>
                        <span>ETA: {job.remaining}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'running' ? (
                        <>
                          <Badge className="bg-success/20 text-success">Running</Badge>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Pause className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">Completed</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cracked" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recovered Credentials</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {crackedCredentials.map((cred, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <KeyRound className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <div className="font-medium">{cred.username}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <code className="px-2 py-0.5 bg-muted rounded text-xs">{cred.password}</code>
                          <span className="text-muted-foreground">from {cred.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cracked in {cred.crackTime}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wordlists" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Available Wordlists</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {wordlists.map((wordlist, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-mono font-medium">{wordlist.name}</div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{wordlist.entries} entries</span>
                          <span>•</span>
                          <span>{wordlist.size}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{wordlist.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
