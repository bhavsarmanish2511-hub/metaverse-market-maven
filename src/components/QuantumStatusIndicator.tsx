import { useState, useEffect } from 'react';
import { Shield, Zap, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function QuantumStatusIndicator() {
  const [qkdActive, setQkdActive] = useState(true);
  const [encryptionLevel, setEncryptionLevel] = useState(256);
  const [latticeStrength, setLatticeStrength] = useState(100);

  useEffect(() => {
    // Simulate quantum fluctuations
    const interval = setInterval(() => {
      setEncryptionLevel(prev => Math.min(512, Math.max(256, prev + (Math.random() - 0.5) * 10)));
      setLatticeStrength(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          {/* <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="bg-quantum-primary/10 text-quantum-primary border-quantum-primary/30 hover:bg-quantum-primary/20 transition-all cursor-pointer"
            >
              <Shield className="h-3 w-3 mr-1 animate-quantum-shield" />
              Quantum Safe
            </Badge>
          </TooltipTrigger> */}
          <TooltipContent>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span>QKD Status:</span>
                <span className="text-quantum-primary font-semibold">
                  {qkdActive ? 'Active' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Encryption Level:</span>
                <span className="text-quantum-secondary font-semibold">
                  {Math.round(encryptionLevel)}-bit
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Lattice Strength:</span>
                <span className="text-quantum-accent font-semibold">
                  {latticeStrength.toFixed(1)}%
                </span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          {/* <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="bg-quantum-secondary/10 text-quantum-secondary border-quantum-secondary/30 hover:bg-quantum-secondary/20 transition-all cursor-pointer"
            >
              <Zap className="h-3 w-3 mr-1 animate-pulse-glow" />
              Post-Quantum
            </Badge>
          </TooltipTrigger> */}
          <TooltipContent>
            <p className="text-xs">Lattice-based cryptography active</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          {/* <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-quantum-accent animate-pulse-glow"></div>
              <span className="text-xs text-quantum-accent font-semibold">QKD</span>
            </div>
          </TooltipTrigger> */}
          <TooltipContent>
            <p className="text-xs">Quantum Key Distribution active</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
