import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Line } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, Zap, Radio, Lock } from 'lucide-react';
import * as THREE from 'three';

interface Node {
  id: string;
  name: string;
  type: 'core' | 'edge' | 'endpoint' | 'quantum-gateway';
  position: [number, number, number];
  health: number;
  encryption: 'quantum' | 'standard';
  traffic: number;
}

interface Connection {
  from: string;
  to: string;
  bandwidth: number;
  encrypted: boolean;
}

const mockNodes: Node[] = [
  { id: '1', name: 'Quantum Gateway Alpha', type: 'quantum-gateway', position: [0, 2, 0], health: 98, encryption: 'quantum', traffic: 95 },
  { id: '2', name: 'Core Router A', type: 'core', position: [-3, 0, 2], health: 96, encryption: 'quantum', traffic: 87 },
  { id: '3', name: 'Core Router B', type: 'core', position: [3, 0, 2], health: 94, encryption: 'quantum', traffic: 82 },
  { id: '4', name: 'Edge Switch 1', type: 'edge', position: [-4, -2, 0], health: 92, encryption: 'quantum', traffic: 76 },
  { id: '5', name: 'Edge Switch 2', type: 'edge', position: [0, -2, 3], health: 89, encryption: 'standard', traffic: 68 },
  { id: '6', name: 'Edge Switch 3', type: 'edge', position: [4, -2, 0], health: 95, encryption: 'quantum', traffic: 84 },
  { id: '7', name: 'Endpoint Cluster A', type: 'endpoint', position: [-5, -4, -1], health: 88, encryption: 'standard', traffic: 45 },
  { id: '8', name: 'Endpoint Cluster B', type: 'endpoint', position: [0, -4, 4], health: 91, encryption: 'quantum', traffic: 62 },
  { id: '9', name: 'Endpoint Cluster C', type: 'endpoint', position: [5, -4, -1], health: 87, encryption: 'standard', traffic: 51 },
  { id: '10', name: 'Quantum Gateway Beta', type: 'quantum-gateway', position: [0, 2, 4], health: 97, encryption: 'quantum', traffic: 93 },
];

const mockConnections: Connection[] = [
  { from: '1', to: '2', bandwidth: 10000, encrypted: true },
  { from: '1', to: '3', bandwidth: 10000, encrypted: true },
  { from: '10', to: '2', bandwidth: 10000, encrypted: true },
  { from: '10', to: '3', bandwidth: 10000, encrypted: true },
  { from: '2', to: '4', bandwidth: 5000, encrypted: true },
  { from: '2', to: '5', bandwidth: 5000, encrypted: false },
  { from: '3', to: '5', bandwidth: 5000, encrypted: false },
  { from: '3', to: '6', bandwidth: 5000, encrypted: true },
  { from: '4', to: '7', bandwidth: 1000, encrypted: false },
  { from: '5', to: '8', bandwidth: 1000, encrypted: true },
  { from: '6', to: '9', bandwidth: 1000, encrypted: false },
];

function DataFlowParticle({ start, end, encrypted }: { start: [number, number, number], end: [number, number, number], encrypted: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random());

  useFrame((state, delta) => {
    if (ref.current) {
      progress.current += delta * 0.5;
      if (progress.current > 1) progress.current = 0;

      const x = start[0] + (end[0] - start[0]) * progress.current;
      const y = start[1] + (end[1] - start[1]) * progress.current;
      const z = start[2] + (end[2] - start[2]) * progress.current;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color={encrypted ? '#2BD0FF' : '#9BD9F2'}
        emissive={encrypted ? '#2BD0FF' : '#9BD9F2'}
        emissiveIntensity={encrypted ? 2 : 1}
      />
    </mesh>
  );
}

function NetworkNode({ node, onClick, selected }: { node: Node, onClick: () => void, selected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(1.2 * pulse);
    }
  });

  const getNodeColor = () => {
    if (node.encryption === 'quantum') return '#2BD0FF';
    return '#9BD9F2';
  };

  const getNodeSize = () => {
    switch (node.type) {
      case 'quantum-gateway': return 0.4;
      case 'core': return 0.3;
      case 'edge': return 0.25;
      case 'endpoint': return 0.2;
    }
  };

  return (
    <group position={node.position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[getNodeSize(), 16, 16]} />
        <meshBasicMaterial
          color={getNodeColor()}
          transparent
          opacity={selected ? 0.3 : 0.15}
        />
      </mesh>

      {/* Main node */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[getNodeSize(), 32, 32]} />
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={getNodeColor()}
          emissiveIntensity={selected ? 1.5 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Health indicator ring */}
      {node.health < 95 && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[getNodeSize() + 0.05, getNodeSize() + 0.1, 32]} />
          <meshBasicMaterial
            color={node.health > 90 ? '#22c55e' : node.health > 80 ? '#eab308' : '#ef4444'}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Label */}
      <Html distanceFactor={10} position={[0, getNodeSize() + 0.3, 0]}>
        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap border border-quantum-primary/30">
          {node.name}
        </div>
      </Html>
    </group>
  );
}

function ConnectionLine({ connection, nodes }: { connection: Connection, nodes: Node[] }) {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);

  if (!fromNode || !toNode) return null;

  const points = [
    new THREE.Vector3(...fromNode.position),
    new THREE.Vector3(...toNode.position),
  ];

  return (
    <>
      <Line
        points={points}
        color={connection.encrypted ? '#2BD0FF' : '#9BD9F2'}
        lineWidth={connection.encrypted ? 2 : 1}
        transparent
        opacity={connection.encrypted ? 0.6 : 0.3}
      />
      {/* Data flow particles */}
      {[...Array(3)].map((_, i) => (
        <DataFlowParticle
          key={i}
          start={fromNode.position}
          end={toNode.position}
          encrypted={connection.encrypted}
        />
      ))}
    </>
  );
}

function Scene({ nodes, connections, onNodeClick, selectedNodeId }: { 
  nodes: Node[], 
  connections: Connection[], 
  onNodeClick: (node: Node) => void,
  selectedNodeId: string | null 
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#2BD0FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9BD9F2" />

      {nodes.map(node => (
        <NetworkNode
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node)}
          selected={selectedNodeId === node.id}
        />
      ))}

      {connections.map((conn, i) => (
        <ConnectionLine key={i} connection={conn} nodes={nodes} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
}

export default function NetworkTopology() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const stats = useMemo(() => {
    const totalNodes = mockNodes.length;
    const quantumNodes = mockNodes.filter(n => n.encryption === 'quantum').length;
    const quantumConnections = mockConnections.filter(c => c.encrypted).length;
    const avgHealth = Math.round(mockNodes.reduce((sum, n) => sum + n.health, 0) / totalNodes);

    return { totalNodes, quantumNodes, quantumConnections, avgHealth };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Radio className="h-8 w-8 text-quantum-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-quantum-primary to-quantum-secondary bg-clip-text text-transparent">
              Network Topology
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">Real-time 3D visualization of quantum-encrypted network infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-quantum-primary/50 text-quantum-primary">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Badge variant="outline" className="border-quantum-accent/50 text-quantum-accent">
            <Shield className="h-3 w-3 mr-1" />
            Quantum Encrypted
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-background to-quantum-primary/5 border-quantum-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-3xl font-bold text-quantum-primary">{stats.totalNodes}</p>
            </div>
            <Radio className="h-8 w-8 text-quantum-primary/50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-background to-quantum-accent/5 border-quantum-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quantum Nodes</p>
              <p className="text-3xl font-bold text-quantum-accent">{stats.quantumNodes}</p>
            </div>
            <Lock className="h-8 w-8 text-quantum-accent/50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-background to-quantum-secondary/5 border-quantum-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Encrypted Links</p>
              <p className="text-3xl font-bold text-quantum-secondary">{stats.quantumConnections}</p>
            </div>
            <Zap className="h-8 w-8 text-quantum-secondary/50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-background to-green-500/5 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Health</p>
              <p className="text-3xl font-bold text-green-500">{stats.avgHealth}%</p>
            </div>
            <Activity className="h-8 w-8 text-green-500/50" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* 3D Visualization */}
        <Card className="col-span-2 p-0 overflow-hidden bg-gradient-to-br from-background via-quantum-primary/5 to-background border-quantum-primary/30">
          <div className="h-[600px] w-full">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
              <color attach="background" args={['#0B1E2E']} />
              <fog attach="fog" args={['#0B1E2E', 10, 25]} />
              <Scene
                nodes={mockNodes}
                connections={mockConnections}
                onNodeClick={setSelectedNode}
                selectedNodeId={selectedNode?.id || null}
              />
            </Canvas>
          </div>
        </Card>

        {/* Node Details Panel */}
        <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-quantum-primary/5 border-quantum-primary/30">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-quantum-primary" />
              Node Details
            </h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-sm text-muted-foreground">Node Name</p>
                <p className="text-lg font-semibold text-quantum-primary">{selectedNode.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="border-quantum-secondary/50">
                  {selectedNode.type}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Health Status</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                      style={{ width: `${selectedNode.health}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-green-500">{selectedNode.health}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Traffic Load</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-quantum-primary to-quantum-accent transition-all duration-500 animate-quantum-wave"
                      style={{ width: `${selectedNode.traffic}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-quantum-primary">{selectedNode.traffic}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Encryption</p>
                <div className="flex items-center gap-2 mt-2">
                  {selectedNode.encryption === 'quantum' ? (
                    <>
                      <Shield className="h-4 w-4 text-quantum-accent" />
                      <span className="text-quantum-accent font-semibold">Quantum Encrypted</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Standard Encryption</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Active Connections</p>
                <div className="space-y-2">
                  {mockConnections
                    .filter(c => c.from === selectedNode.id || c.to === selectedNode.id)
                    .map((conn, i) => {
                      const otherNodeId = conn.from === selectedNode.id ? conn.to : conn.from;
                      const otherNode = mockNodes.find(n => n.id === otherNodeId);
                      return (
                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                          <span className="text-foreground">{otherNode?.name}</span>
                          {conn.encrypted && (
                            <Badge variant="outline" className="border-quantum-primary/50 text-quantum-primary text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              QKD
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Radio className="h-16 w-16 mb-4 opacity-30" />
              <p>Select a node to view details</p>
              <p className="text-sm mt-2">Click on any node in the topology map</p>
            </div>
          )}
        </Card>
      </div>

      {/* Legend */}
      <Card className="p-4 bg-gradient-to-r from-background via-quantum-primary/5 to-background border-quantum-primary/30">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Legend</h4>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-quantum-primary animate-quantum-entangle" />
              <span>Quantum Gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-quantum-accent" />
              <span>Core Router</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-quantum-secondary" />
              <span>Edge Switch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span>Endpoint</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-quantum-primary" />
              <span>Quantum Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-quantum-primary/50" />
              <span>Data Flow</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
