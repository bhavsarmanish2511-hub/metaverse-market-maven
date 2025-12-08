import { useEffect, useState } from "react";
import { Shield, Zap, Lock, Activity, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricsChart } from "@/components/widgets/MetricsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeyExchangeEvent {
  id: string;
  timestamp: Date;
  algorithm: string;
  status: 'success' | 'pending' | 'failed';
  latency: number;
  keySize: number;
}

interface AlgorithmMetrics {
  name: string;
  performance: number;
  reliability: number;
  quantumResistance: number;
}

export default function QuantumSecurity() {
  const [qkdStatus, setQkdStatus] = useState(true);
  const [encryptionLevel, setEncryptionLevel] = useState(384);
  const [latticeStrength, setLatticeStrength] = useState(98.5);
  const [activeConnections, setActiveConnections] = useState(847);
  const [keyExchangeRate, setKeyExchangeRate] = useState(245);
  const [keyExchangeHistory, setKeyExchangeHistory] = useState<KeyExchangeEvent[]>([]);

  const algorithms: AlgorithmMetrics[] = [
    { name: "Kyber-1024", performance: 95, reliability: 99.2, quantumResistance: 100 },
    { name: "Dilithium-5", performance: 92, reliability: 98.8, quantumResistance: 100 },
    { name: "SPHINCS+", performance: 78, reliability: 99.5, quantumResistance: 100 },
    { name: "NTRU Prime", performance: 88, reliability: 97.9, quantumResistance: 99 },
  ];

  useEffect(() => {
    // Simulate real-time quantum fluctuations
    const interval = setInterval(() => {
      setEncryptionLevel(prev => Math.min(512, Math.max(256, prev + (Math.random() - 0.5) * 20)));
      setLatticeStrength(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5) * 1)));
      setActiveConnections(prev => Math.max(800, prev + Math.floor((Math.random() - 0.5) * 50)));
      setKeyExchangeRate(prev => Math.max(200, prev + Math.floor((Math.random() - 0.5) * 30)));
    }, 3000);

    // Generate key exchange history
    const history: KeyExchangeEvent[] = [];
    const algorithms = ['Kyber-1024', 'Dilithium-5', 'SPHINCS+', 'NTRU Prime'];
    for (let i = 0; i < 10; i++) {
      const now = new Date();
      history.push({
        id: `kex-${i}`,
        timestamp: new Date(now.getTime() - i * 120000),
        algorithm: algorithms[Math.floor(Math.random() * algorithms.length)],
        status: Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'pending' : 'failed',
        latency: Math.floor(Math.random() * 50) + 10,
        keySize: [256, 384, 512][Math.floor(Math.random() * 3)],
      });
    }
    setKeyExchangeHistory(history);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quantum Security Dashboard</h1>
            <p className="text-muted-foreground">
              Post-Quantum Cryptography & Key Distribution Monitoring
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-quantum-primary/10 text-quantum-primary border-quantum-primary/30 animate-lattice-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Quantum Safe
            </Badge>
            <Badge variant="outline" className="bg-quantum-secondary/10 text-quantum-secondary border-quantum-secondary/30">
              <Lock className="h-3 w-3 mr-1" />
              {encryptionLevel.toFixed(0)}-bit
            </Badge>
            <Badge variant="outline" className="bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30">
              <Activity className="h-3 w-3 mr-1" />
              QKD Active
            </Badge>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-quantum-primary/30 hover:shadow-lg transition-smooth">
            <CardHeader className="pb-3">
              <CardDescription>Lattice Strength</CardDescription>
              <CardTitle className="text-3xl text-quantum-primary">{latticeStrength.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={latticeStrength} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Optimal quantum resistance</p>
            </CardContent>
          </Card>

          <Card className="border-quantum-secondary/30 hover:shadow-lg transition-smooth">
            <CardHeader className="pb-3">
              <CardDescription>Encryption Level</CardDescription>
              <CardTitle className="text-3xl text-quantum-secondary">{Math.round(encryptionLevel)}-bit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-quantum-secondary" />
                <span>Post-quantum secure</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-quantum-accent/30 hover:shadow-lg transition-smooth">
            <CardHeader className="pb-3">
              <CardDescription>Active Connections</CardDescription>
              <CardTitle className="text-3xl text-quantum-accent">{activeConnections.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All quantum-encrypted</p>
            </CardContent>
          </Card>

          <Card className="border-quantum-glow/30 hover:shadow-lg transition-smooth">
            <CardHeader className="pb-3">
              <CardDescription>Key Exchange Rate</CardDescription>
              <CardTitle className="text-3xl text-quantum-glow">{keyExchangeRate}/min</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Average latency: 28ms</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsChart 
            title="Lattice Strength Over Time" 
            type="area"
            color="hsl(var(--quantum-primary))"
          />
          <MetricsChart 
            title="Key Exchange Performance" 
            type="line"
            color="hsl(var(--quantum-secondary))"
          />
        </div>

        {/* Detailed Metrics Tabs */}
        <Tabs defaultValue="algorithms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="algorithms">Algorithm Performance</TabsTrigger>
            <TabsTrigger value="history">Key Exchange History</TabsTrigger>
            <TabsTrigger value="analysis">Security Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post-Quantum Algorithm Metrics</CardTitle>
                <CardDescription>Performance and reliability of active quantum-resistant algorithms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {algorithms.map((algo) => (
                  <div key={algo.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-quantum-primary/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-quantum-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{algo.name}</p>
                          <p className="text-xs text-muted-foreground">NIST Selected Algorithm</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-semibold">{algo.performance}%</span>
                        </div>
                        <Progress value={algo.performance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Reliability</span>
                          <span className="font-semibold">{algo.reliability}%</span>
                        </div>
                        <Progress value={algo.reliability} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Quantum Resistance</span>
                          <span className="font-semibold">{algo.quantumResistance}%</span>
                        </div>
                        <Progress value={algo.quantumResistance} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Key Exchange Events</CardTitle>
                <CardDescription>Timeline of quantum key distribution operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyExchangeHistory.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.status === 'success' ? 'bg-quantum-accent/10' : 
                        event.status === 'pending' ? 'bg-warning/10' : 'bg-error/10'
                      }`}>
                        {event.status === 'success' ? (
                          <CheckCircle2 className={`h-5 w-5 text-quantum-accent`} />
                        ) : event.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-warning" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-error" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{event.algorithm}</p>
                          <span className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Key Size: {event.keySize}-bit</span>
                          <span>•</span>
                          <span>Latency: {event.latency}ms</span>
                          <span>•</span>
                          <Badge variant="outline" className={
                            event.status === 'success' ? 'bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30' :
                            event.status === 'pending' ? 'bg-warning/10 text-warning border-warning/30' :
                            'bg-error/10 text-error border-error/30'
                          }>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Threat Assessment</CardTitle>
                  <CardDescription>Current security posture against quantum attacks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Shor's Algorithm Resistance</span>
                      <Badge variant="outline" className="bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30">
                        100%
                      </Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Grover's Algorithm Resistance</span>
                      <Badge variant="outline" className="bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30">
                        100%
                      </Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quantum Supremacy Protection</span>
                      <Badge variant="outline" className="bg-quantum-accent/10 text-quantum-accent border-quantum-accent/30">
                        99.8%
                      </Badge>
                    </div>
                    <Progress value={99.8} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>NIST post-quantum cryptography standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-quantum-primary/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-quantum-primary" />
                      <span className="text-sm font-medium">NIST FIPS 203 (Kyber)</span>
                    </div>
                    <span className="text-xs text-quantum-primary">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-quantum-primary/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-quantum-primary" />
                      <span className="text-sm font-medium">NIST FIPS 204 (Dilithium)</span>
                    </div>
                    <span className="text-xs text-quantum-primary">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-quantum-primary/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-quantum-primary" />
                      <span className="text-sm font-medium">NIST FIPS 205 (SPHINCS+)</span>
                    </div>
                    <span className="text-xs text-quantum-primary">Compliant</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
