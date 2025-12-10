import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Fingerprint, CheckCircle } from "lucide-react";
import { UserRole } from '@/contexts/RoleContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: UserRole | null;
}

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  irc_leader: 'IRC Leader',
  analyst: 'Integrated Operations Analyst',
  offensive_tester: 'Offensive Tester',
  rcc_head: 'RCC Head',
};

export function RoleAuthModal({ open, onClose, onSuccess, role }: AuthModalProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    if (open) {
      setStatus('idle');
    }
  }, [open]);

  const handleAuth = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 2000);
  };

  const roleName = role ? ROLE_DISPLAY_NAMES[role] : 'User';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Biometric Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            Elevated privileges for the <span className="font-semibold text-primary">{roleName}</span> role require identity verification.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          {status === 'idle' && (
            <button onClick={handleAuth} className="group">
              <Fingerprint className="h-24 w-24 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          )}
          {status === 'scanning' && (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-24 w-24 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Scanning...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="h-24 w-24 text-success" />
              <p className="text-sm text-success">Verification Successful</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}