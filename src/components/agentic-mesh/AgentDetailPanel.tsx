import { useState } from "react";
import { Agent, AgentCategory } from "./AgentNode";
import { 
  Brain, Shield, Network, Eye, AlertTriangle, Lock, Database, 
  FileText, Activity, Zap, Radar, Target, Bot, Cpu, Server,
  Globe, Settings, Workflow, CheckCircle, X, ChevronDown, ChevronUp,
  Layers, GitBranch, Gauge, Link2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AgentDetailPanelProps {
  agent: Agent | null;
  onClose: () => void;
  allAgents: Agent[];
  onSelectAgent: (agentId: string) => void;
}

const categoryLabels: Record<AgentCategory, { label: string; color: string }> = {
  orchestration: { label: 'Orchestration & Governance', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  security: { label: 'Security (SOC)', color: 'bg-soc/20 text-soc border-soc/30' },
  network: { label: 'Network (NOC)', color: 'bg-noc/20 text-noc border-noc/30' },
  shared: { label: 'Shared Services', color: 'bg-primary/20 text-primary border-primary/30' },
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

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/20 text-success border-success/30' },
  idle: { label: 'Idle', color: 'bg-muted text-muted-foreground border-border' },
  processing: { label: 'Processing', color: 'bg-warning/20 text-warning border-warning/30' },
  alert: { label: 'Alert', color: 'bg-error/20 text-error border-error/30' },
};

export function AgentDetailPanel({ agent, onClose, allAgents, onSelectAgent }: AgentDetailPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!agent) return null;

  const Icon = agentIcons[agent.id] || Brain;
  const categoryConfig = categoryLabels[agent.category];
  const statusCfg = statusConfig[agent.status];
  const connectedAgents = allAgents.filter(a => agent.connections.includes(a.id));

  // Compact view - just shows name and expand button
  if (!isExpanded) {
    return (
      <div className="absolute right-4 top-20 w-72 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-xl z-50 animate-fade-in">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", categoryConfig.color.split(' ')[0])}>
              <Icon className={cn("h-5 w-5", categoryConfig.color.split(' ')[1])} />
            </div>
            <div>
              <h3 className="font-bold text-base">{agent.id}</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{agent.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(true)}>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", statusCfg.color)}>
              {statusCfg.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", categoryConfig.color)}>
              {agent.category}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Expanded view - full details
  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-card/95 backdrop-blur-lg border-l border-border shadow-2xl z-50 animate-slide-in-right">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", categoryConfig.color.split(' ')[0])}>
            <Icon className={cn("h-5 w-5", categoryConfig.color.split(' ')[1])} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{agent.id}</h3>
            <p className="text-xs text-muted-foreground">{agent.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-4">
          {/* Status & Category */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={statusCfg.color}>
              {statusCfg.label}
            </Badge>
            <Badge variant="outline" className={categoryConfig.color}>
              {categoryConfig.label}
            </Badge>
          </div>

          {/* Purpose */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Purpose
            </h4>
            <p className="text-sm text-muted-foreground">{agent.purpose}</p>
          </div>

          <Separator />

          {/* Scope */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Scope
            </h4>
            <p className="text-sm text-muted-foreground">{agent.scope}</p>
          </div>

          {/* Inputs/Outputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs font-semibold text-success mb-1">Inputs</h4>
              <p className="text-xs text-muted-foreground">{agent.inputs}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-warning mb-1">Outputs</h4>
              <p className="text-xs text-muted-foreground">{agent.outputs}</p>
            </div>
          </div>

          <Separator />

          {/* Models */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Core Models
            </h4>
            <p className="text-sm text-muted-foreground">{agent.models}</p>
          </div>

          {/* Autonomy */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Autonomy & Approvals
            </h4>
            <p className="text-sm text-muted-foreground">{agent.autonomy}</p>
          </div>

          <Separator />

          {/* KPIs */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              KPIs
            </h4>
            <p className="text-sm text-muted-foreground">{agent.kpis}</p>
          </div>

          <Separator />

          {/* Connections */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Integrations ({connectedAgents.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {connectedAgents.map(connAgent => {
                const ConnIcon = agentIcons[connAgent.id] || Brain;
                const connCategory = categoryLabels[connAgent.category];
                return (
                  <button
                    key={connAgent.id}
                    onClick={() => onSelectAgent(connAgent.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
                      "border hover:scale-105",
                      connCategory.color
                    )}
                  >
                    <ConnIcon className="h-3 w-3" />
                    {connAgent.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
