import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Agent, AgentNode, AgentCategory } from "./AgentNode";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { agentCatalog, designPrinciples, workflowSteps } from "./agentData";
import { 
  Brain, Shield, Network, Lock, Globe, Play, Pause, 
  ZoomIn, ZoomOut, Maximize2, Minimize2, Filter, Info, X, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

interface Particle {
  id: string;
  connectionIndex: number;
  progress: number;
  speed: number;
  delay: number;
}

export function AgenticMesh() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [highlightedAgents, setHighlightedAgents] = useState<string[]>([]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [filter, setFilter] = useState<AgentCategory | 'all'>('all');
  const [zoom, setZoom] = useState(1);
  const [dataFlows, setDataFlows] = useState<Connection[]>([]);
  const [showPrinciples, setShowPrinciples] = useState(true);
  const [showWorkflow, setShowWorkflow] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Calculate agent positions in a radial layout
  const agentPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const centerY = 300;
    
    // HELIOS at center
    positions['HELIOS'] = { x: centerX, y: centerY };
    
    // Orchestration ring (inner)
    const orchestrationAgents = ['GATE', 'AMG', 'LGR', 'KBR'];
    orchestrationAgents.forEach((id, i) => {
      const angle = (i / orchestrationAgents.length) * 2 * Math.PI - Math.PI / 2;
      positions[id] = {
        x: centerX + Math.cos(angle) * 100,
        y: centerY + Math.sin(angle) * 100
      };
    });
    
    // Security ring (middle-left)
    const securityAgents = ['SEA', 'TIA', 'INC', 'XDR', 'QIG', 'DFA', 'MIM', 'RED'];
    securityAgents.forEach((id, i) => {
      const baseAngle = Math.PI; // Left side
      const spreadAngle = Math.PI * 0.8;
      const angle = baseAngle - spreadAngle/2 + (i / (securityAgents.length - 1)) * spreadAngle;
      positions[id] = {
        x: centerX + Math.cos(angle) * 220,
        y: centerY + Math.sin(angle) * 180
      };
    });
    
    // Network ring (middle-right)
    const networkAgents = ['NPM', 'FDR', 'CTM', 'TAO', 'PMX'];
    networkAgents.forEach((id, i) => {
      const baseAngle = 0; // Right side
      const spreadAngle = Math.PI * 0.6;
      const angle = baseAngle - spreadAngle/2 + (i / (networkAgents.length - 1)) * spreadAngle;
      positions[id] = {
        x: centerX + Math.cos(angle) * 220,
        y: centerY + Math.sin(angle) * 180
      };
    });
    
    // Shared services (bottom)
    const sharedAgents = ['BUS', 'DTS', 'AIM'];
    sharedAgents.forEach((id, i) => {
      const baseAngle = Math.PI / 2; // Bottom
      const spreadAngle = Math.PI * 0.4;
      const angle = baseAngle - spreadAngle/2 + (i / (sharedAgents.length - 1)) * spreadAngle;
      positions[id] = {
        x: centerX + Math.cos(angle) * 180,
        y: centerY + Math.sin(angle) * 150
      };
    });
    
    return positions;
  }, []);

  // Generate connections based on agent data
  const connections = useMemo(() => {
    const conns: Connection[] = [];
    const addedPairs = new Set<string>();
    
    agentCatalog.forEach(agent => {
      agent.connections.forEach(targetId => {
        const pairKey = [agent.id, targetId].sort().join('-');
        if (!addedPairs.has(pairKey)) {
          addedPairs.add(pairKey);
          conns.push({
            from: agent.id,
            to: targetId,
            active: false
          });
        }
      });
    });
    
    return conns;
  }, []);

  // Initialize particles with random delays
  useEffect(() => {
    const initialParticles: Particle[] = connections.map((_, index) => ({
      id: `particle-${index}`,
      connectionIndex: index,
      progress: Math.random(), // Random starting position
      speed: 0.005 + Math.random() * 0.01, // Random speed variation
      delay: Math.random() * 2000, // Random delay 0-2s
    }));
    setParticles(initialParticles);
  }, [connections]);

  // Animate particles
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setParticles(prev => prev.map(particle => {
        let newProgress = particle.progress + particle.speed * (deltaTime / 16);
        if (newProgress > 1) {
          newProgress = 0;
          // Randomize speed on reset for variety
          return {
            ...particle,
            progress: newProgress,
            speed: 0.005 + Math.random() * 0.01,
          };
        }
        return { ...particle, progress: newProgress };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Simulate data flows
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      const activeConns = connections.map(conn => ({
        ...conn,
        active: Math.random() > 0.7
      }));
      setDataFlows(activeConns);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isAnimating, connections]);

  // Handle workflow step animation
  useEffect(() => {
    if (activeWorkflowStep !== null) {
      const step = workflowSteps[activeWorkflowStep];
      setHighlightedAgents(step.agents);
    }
  }, [activeWorkflowStep]);

  const handleAgentClick = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setHighlightedAgents([agent.id, ...agent.connections]);
  }, []);

  // Close panel but keep highlighting
  const handleClosePanel = useCallback(() => {
    setSelectedAgent(null);
    // Don't clear highlighted agents - keep the glow
  }, []);

  const handleSelectAgentById = useCallback((agentId: string) => {
    const agent = agentCatalog.find(a => a.id === agentId);
    if (agent) {
      handleAgentClick(agent);
    }
  }, [handleAgentClick]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const filteredAgents = filter === 'all' 
    ? agentCatalog 
    : agentCatalog.filter(a => a.category === filter);

  const categoryStats = useMemo(() => ({
    orchestration: agentCatalog.filter(a => a.category === 'orchestration').length,
    security: agentCatalog.filter(a => a.category === 'security').length,
    network: agentCatalog.filter(a => a.category === 'network').length,
    shared: agentCatalog.filter(a => a.category === 'shared').length,
  }), []);

  // Calculate particle position on a connection
  const getParticlePosition = (particle: Particle) => {
    const conn = connections[particle.connectionIndex];
    if (!conn) return null;
    
    const fromPos = agentPositions[conn.from];
    const toPos = agentPositions[conn.to];
    if (!fromPos || !toPos) return null;

    return {
      x: fromPos.x + (toPos.x - fromPos.x) * particle.progress,
      y: fromPos.y + (toPos.y - fromPos.y) * particle.progress,
    };
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[700px] bg-gradient-to-br from-background via-background to-muted/20 rounded-xl border border-border overflow-hidden",
        isFullscreen && "rounded-none"
      )}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
            <Brain className="h-3 w-3 mr-1" />
            Orchestration ({categoryStats.orchestration})
          </Badge>
          <Badge variant="outline" className="bg-soc/10 text-soc border-soc/30">
            <Shield className="h-3 w-3 mr-1" />
            Security ({categoryStats.security})
          </Badge>
          <Badge variant="outline" className="bg-noc/10 text-noc border-noc/30">
            <Network className="h-3 w-3 mr-1" />
            Network ({categoryStats.network})
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Globe className="h-3 w-3 mr-1" />
            Shared ({categoryStats.shared})
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="h-8"
          >
            {isAnimating ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
            {isAnimating ? 'Pause' : 'Animate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 0.1, 1.5))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Design Principles - Left Side */}
      {showPrinciples ? (
        <div className="absolute top-20 left-4 z-10 w-64 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Info className="h-4 w-4" />
              Design Principles
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrinciples(false)}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {designPrinciples.map((principle, i) => (
            <div 
              key={i}
              className="p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-default"
            >
              <h4 className="text-xs font-semibold text-foreground">{principle.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{principle.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPrinciples(true)}
          className="absolute top-20 left-4 z-10 h-8"
        >
          <ChevronRight className="h-3 w-3 mr-1" />
          Principles
        </Button>
      )}

      {/* Workflow Steps - Right Side (only show if no agent selected) */}
      {!selectedAgent && (showWorkflow ? (
        <div className="absolute top-20 right-4 z-10 w-64 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-primary">End-to-End Flow</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowWorkflow(false);
                setActiveWorkflowStep(null);
                setHighlightedAgents([]);
              }}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {workflowSteps.map((step) => (
            <button
              key={step.step}
              onClick={() => setActiveWorkflowStep(activeWorkflowStep === step.step - 1 ? null : step.step - 1)}
              className={cn(
                "w-full p-2 rounded-lg border text-left transition-all",
                activeWorkflowStep === step.step - 1
                  ? "bg-primary/20 border-primary"
                  : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold",
                  activeWorkflowStep === step.step - 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {step.step}
                </span>
                <h4 className="text-xs font-semibold">{step.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 ml-7">{step.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWorkflow(true)}
          className="absolute top-20 right-4 z-10 h-8"
        >
          Workflow
          <ChevronRight className="h-3 w-3 ml-1 rotate-180" />
        </Button>
      ))}

      {/* SVG Mesh Visualization */}
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
      >
        <defs>
          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Particle glow filter */}
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <g className="connections">
          {dataFlows.map((conn, i) => {
            const fromPos = agentPositions[conn.from];
            const toPos = agentPositions[conn.to];
            if (!fromPos || !toPos) return null;
            
            const isHighlighted = highlightedAgents.includes(conn.from) && highlightedAgents.includes(conn.to);
            
            return (
              <line
                key={i}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={conn.active ? "url(#connectionGradient)" : "hsl(var(--border))"}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 0.8 : 0.3}
                className={cn(
                  "transition-all duration-300",
                  conn.active && isAnimating && "animate-pulse"
                )}
              />
            );
          })}
        </g>

        {/* Animated particles */}
        {isAnimating && (
          <g className="particles">
            {particles.map((particle) => {
              const pos = getParticlePosition(particle);
              if (!pos) return null;
              
              const conn = connections[particle.connectionIndex];
              const isHighlighted = highlightedAgents.includes(conn?.from) && highlightedAgents.includes(conn?.to);
              
              return (
                <circle
                  key={particle.id}
                  cx={pos.x}
                  cy={pos.y}
                  r={isHighlighted ? 4 : 2.5}
                  fill="hsl(var(--primary))"
                  opacity={isHighlighted ? 0.9 : 0.6}
                  filter="url(#particleGlow)"
                />
              );
            })}
          </g>
        )}

        {/* Agent nodes */}
        <g className="agents">
          {filteredAgents.map(agent => {
            const pos = agentPositions[agent.id];
            if (!pos) return null;
            
            return (
              <AgentNode
                key={agent.id}
                agent={agent}
                position={pos}
                isSelected={selectedAgent?.id === agent.id}
                isHighlighted={highlightedAgents.includes(agent.id)}
                onClick={() => handleAgentClick(agent)}
                scale={agent.id === 'HELIOS' ? 1.3 : 1}
              />
            );
          })}
        </g>

        {/* Category labels */}
        <text x="50" y="300" className="fill-soc/60 text-xs font-semibold">SECURITY (SOC)</text>
        <text x="660" y="300" className="fill-noc/60 text-xs font-semibold">NETWORK (NOC)</text>
        <text x="350" y="520" className="fill-primary/60 text-xs font-semibold">SHARED SERVICES</text>
      </svg>

      {/* Agent Detail Panel */}
      <AgentDetailPanel
        agent={selectedAgent}
        onClose={handleClosePanel}
        allAgents={agentCatalog}
        onSelectAgent={handleSelectAgentById}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50">
        <h4 className="text-xs font-semibold mb-2">Status Legend</h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            Active
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            Processing
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            Alert
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Idle
          </div>
        </div>
      </div>
    </div>
  );
}
