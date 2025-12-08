import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FingerprintAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleName?: string;
}

export function FingerprintAuthModal({ open, onClose, onSuccess, roleName = 'IRC Leader' }: FingerprintAuthModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (open) {
      // Auto-start scanning when modal opens
      setTimeout(() => handleScan(), 500);
    } else {
      // Reset state when modal closes
      setIsScanning(false);
      setScanProgress(0);
      setScanStatus('idle');
    }
  }, [open]);

  const handleScan = async () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setScanProgress(0);

    // Simulate fingerprint scanning progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setScanProgress(i);
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setScanStatus('success');
    setIsScanning(false);

    // Navigate after success animation
    await new Promise(resolve => setTimeout(resolve, 800));
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md border-login-glow/30 bg-login-bg/95 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-login-text tracking-wider">
              {roleName.toUpperCase()} ACCESS
            </h2>
            <div className="relative h-[2px] w-20 mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-login-glow to-transparent animate-[laser-sweep_3s_ease-in-out_infinite]" />
            </div>
            <p className="text-login-highlight text-sm tracking-wide">
              BIOMETRIC VERIFICATION REQUIRED
            </p>
          </div>

          {/* Fingerprint Scanner */}
          <div className="relative">
            {/* Outer ring */}
            <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
              scanStatus === 'success' 
                ? 'border-success animate-pulse' 
                : scanStatus === 'scanning' 
                  ? 'border-login-glow animate-pulse' 
                  : 'border-login-glow/30'
            }`} />
            
            {/* Progress ring */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-login-glow/20"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - scanProgress / 100)}
                className={`transition-all duration-200 ${
                  scanStatus === 'success' ? 'text-success' : 'text-login-glow'
                }`}
              />
            </svg>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`p-6 rounded-full transition-all duration-500 ${
                scanStatus === 'success' 
                  ? 'bg-success/20' 
                  : scanStatus === 'scanning' 
                    ? 'bg-login-glow/20 animate-pulse' 
                    : 'bg-login-glow/10'
              }`}>
                <Fingerprint className={`h-16 w-16 transition-colors duration-500 ${
                  scanStatus === 'success' 
                    ? 'text-success' 
                    : 'text-login-glow'
                }`} />
              </div>
            </div>

            {/* Scanning line effect */}
            {isScanning && (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-login-glow to-transparent animate-[scan-line_1.5s_ease-in-out_infinite]"
                  style={{ top: `${scanProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center space-y-2">
            {scanStatus === 'idle' && (
              <p className="text-login-highlight animate-pulse">Initializing scanner...</p>
            )}
            {scanStatus === 'scanning' && (
              <>
                <p className="text-login-glow font-semibold">Scanning fingerprint...</p>
                <p className="text-login-highlight text-sm">{scanProgress}% verified</p>
              </>
            )}
            {scanStatus === 'success' && (
              <>
                <p className="text-success font-semibold">Identity Verified</p>
                <p className="text-login-highlight text-sm">Accessing {roleName} Console...</p>
              </>
            )}
          </div>

          {/* Cancel button */}
          {!isScanning && scanStatus !== 'success' && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-login-glow/30 text-login-highlight hover:bg-login-glow/10 hover:text-login-glow"
            >
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
