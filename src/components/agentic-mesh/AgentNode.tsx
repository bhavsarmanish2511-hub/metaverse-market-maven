import { useState } from "react";
import { 
  Brain, Shield, Network, Eye, AlertTriangle, Lock, Database, 
  FileText, Activity, Zap, Radar, Target, Bot, Cpu, Server,
  Globe, Settings, Workflow, CheckCircle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AgentCategory = 'orchestration' | 'security' | 'network' | 'shared';

export interface Agent {
  id: string;
  name: string;
  fullName: string;
  purpose: string;
  scope: string;
  inputs: string;
  outputs: string;
  models: string;
  autonomy: string;
  integrations: string;
  kpis: string;
  category: AgentCategory;
  status: 'active' | 'idle' | 'processing' | 'alert';
  connections: string[];
}

interface AgentNodeProps {
  agent: Agent;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  position: { x: number; y: number };
  scale?: number;
}

const categoryColors: Record<AgentCategory, { bg: string; border: string; glow: string; icon: string }> = {
  orchestration: { 
    bg: 'bg-purple-500/20', 
    border: 'border-purple-500/50', 
    glow: 'shadow-purple-500/30',
    icon: 'text-purple-400'
  },
  security: { 
    bg: 'bg-soc/20', 
    border: 'border-soc/50', 
    glow: 'shadow-soc/30',
    icon: 'text-soc'
  },
  network: { 
    bg: 'bg-noc/20', 
    border: 'border-noc/50', 
    glow: 'shadow-noc/30',
    icon: 'text-noc'
  },
  shared: { 
    bg: 'bg-primary/20', 
    border: 'border-primary/50', 
    glow: 'shadow-primary/30',
    icon: 'text-primary'
  },
};

const agentIcons: Record<string, typeof Brain> = {
  HELIOS: Brain,
  GATE: Lock,
  AMG: Globe,
  LGR: Database,
  'KBR': FileText,
  SEA: Radar,
  TIA: Eye,
  INC: Workflow,
  XDR: Zap,
  QIG: Shield,
  DFA: Bot,
  MIM: Cpu,
  RED: Target,
  NPM: Activity,
  FDR: Settings,
  CTM: Server,
  TAO: Network,
  PMX: AlertTriangle,
  BUS: Database,
  DTS: Globe,
  AIM: CheckCircle,
};

const statusColors = {
  active: 'bg-success',
  idle: 'bg-muted-foreground',
  processing: 'bg-warning animate-pulse',
  alert: 'bg-error animate-pulse',
};

export function AgentNode({ agent, isSelected, isHighlighted, onClick, position, scale = 1 }: AgentNodeProps) {
  const colors = categoryColors[agent.category];
  const Icon = agentIcons[agent.id] || Brain;
  
  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onClick={onClick}
      className="cursor-pointer"
      style={{ opacity: isHighlighted || isSelected ? 1 : 0.6 }}
    >
      {/* Glow effect for selected */}
      {isSelected && (
        <circle
          r={35 * scale}
          className="fill-none stroke-primary animate-pulse"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}
      
      {/* Outer ring - category indicator */}
      <circle
        r={30 * scale}
        className={cn(
          "transition-all duration-300",
          isSelected ? "fill-primary/30 stroke-primary" : `fill-card stroke-border`,
          isHighlighted && "stroke-primary/70"
        )}
        strokeWidth={2}
      />
      
      {/* Inner circle */}
      <circle
        r={22 * scale}
        className={cn(
          colors.bg,
          "transition-all duration-300"
        )}
      />
      
      {/* Status indicator */}
      <circle
        cx={18 * scale}
        cy={-18 * scale}
        r={5 * scale}
        className={statusColors[agent.status]}
      />
      
      {/* Agent ID text */}
      <text
        y={4 * scale}
        textAnchor="middle"
        className={cn(
          "text-xs font-bold fill-foreground select-none",
          isSelected && "fill-primary"
        )}
        style={{ fontSize: `${10 * scale}px` }}
      >
        {agent.id}
      </text>
    </g>
  );
}
