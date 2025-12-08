import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertTriangle, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { playSoothingAlertTone } from '@/lib/alertSound';

interface CriticalAlertModalProps {
  open: boolean;
  onClose: () => void;
  alertTitle: string;
  alertDescription: string;
}

export function CriticalAlertModal({ open, onClose, alertTitle, alertDescription }: CriticalAlertModalProps) {
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  useEffect(() => {
    if (open && !isAnnouncing) {
      setIsAnnouncing(true);
      // Play soothing alert tone instead of voice
      playSoothingAlertTone('critical');
    }
    
    if (!open) {
      setIsAnnouncing(false);
    }
  }, [open, alertTitle, alertDescription, isAnnouncing]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg border-error/50 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        {/* Red alert header */}
        <div className="bg-error/20 border-b border-error/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-error/30 animate-pulse">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
              <div>
                <Badge className="bg-error text-error-foreground mb-1">CRITICAL ALERT</Badge>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-semibold">HELIOS DETECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">{alertTitle}</h2>
            <p className="text-muted-foreground">{alertDescription}</p>
          </div>

          <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-warning" />
              <span className="font-semibold text-warning">HELIOS Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This incident requires IRC Leader authorization.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={onClose} 
              className="flex-1 bg-error hover:bg-error/90 text-error-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Acknowledge Alert
            </Button>
          </div>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-error/50 animate-pulse rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
