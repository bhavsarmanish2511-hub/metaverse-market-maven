import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Fingerprint, ScanFace, Mic, Atom, CheckCircle, Zap } from 'lucide-react';
import irisScanImage from '@/assets/iris-scan.png';
import { playSoothingAlertTone } from '@/lib/alertSound';

interface BiometricAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleName?: string;
  triggerId?: string;
}

type BiometricOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export function BiometricAuthModal({ open, onClose, onSuccess, roleName = 'User', triggerId }: BiometricAuthModalProps) {
  const [currentBiometric, setCurrentBiometric] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const biometricOptions: BiometricOption[] = [
    {
      id: "fingerprint",
      name: "Fingerprint",
      icon: <Fingerprint className="h-16 w-16" />,
      description: "Touch sensor authentication"
    },
    {
      id: "iris",
      name: "Iris Scan",
      icon: <img src={irisScanImage} alt="Iris Scan" className="h-16 w-16 rounded-full object-cover" />,
      description: "Retinal pattern analysis"
    },
    {
      id: "voice",
      name: "Voice Recognition",
      icon: <Mic className="h-16 w-16" />,
      description: "Vocal signature verification"
    },
    {
      id: "quantum",
      name: "Quantum Auth",
      icon: <Atom className="h-16 w-16" />,
      description: "Quantum entanglement key"
    }
  ];

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      rotateBiometric('right');
    } else if (isRightSwipe) {
      rotateBiometric('left');
    }
  };

  useEffect(() => {
    if (!open) {
      setIsScanning(false);
      setScanProgress(0);
      setAuthSuccess(false);
      setCurrentBiometric(0);
    }
  }, [open]);

  const rotateBiometric = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentBiometric((prev) => (prev - 1 + biometricOptions.length) % biometricOptions.length);
    } else {
      setCurrentBiometric((prev) => (prev + 1) % biometricOptions.length);
    }
  };

  const selectBiometric = (index: number) => {
    setCurrentBiometric(index);
  };

  const getVisibleOptions = () => {
    const options = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentBiometric + i + biometricOptions.length) % biometricOptions.length;
      options.push({ ...biometricOptions[index], offset: i, realIndex: index });
    }
    return options;
  };

  const handleAuthenticate = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 40));
      setScanProgress(i);
    }

    // Show success with soothing tone
    setAuthSuccess(true);
    playSoothingAlertTone('success');

    // Navigate after success
    await new Promise(resolve => setTimeout(resolve, 1200));
    onSuccess();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerId && (
        <button id={triggerId} className="hidden" onClick={() => {}} />
      )}
      <DialogContent className="sm:max-w-xl border-login-glow/30 bg-login-bg/95 backdrop-blur-xl p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Biometric authentication modal for {roleName} role access
        </DialogDescription>
        <div className="p-6 md:p-8 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-login-text tracking-[0.15em] uppercase">
              {roleName} Access
            </h2>
            <div className="relative h-[2px] w-20 mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-login-glow to-transparent animate-[laser-sweep_3s_ease-in-out_infinite]" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-3 w-3 text-primary" />
              <p className="text-login-highlight text-xs tracking-wide">BIOMETRIC VERIFICATION REQUIRED</p>
            </div>
          </div>

          {authSuccess ? (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-5 rounded-full bg-success/20 animate-pulse">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-success">Identity Verified</h3>
                <p className="text-login-highlight text-sm">Accessing {roleName} Dashboard...</p>
              </div>
            </div>
          ) : isScanning ? (
            /* Scanning State */
            <div className="flex flex-col items-center justify-center py-6 space-y-5">
              <div className="relative">
                <svg className="w-32 h-32 md:w-36 md:h-36 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-login-glow/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - scanProgress / 100)}
                    className="text-login-glow transition-all duration-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-login-glow animate-pulse">
                    {biometricOptions[currentBiometric].icon}
                  </div>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-login-glow font-semibold text-sm">Authenticating with {biometricOptions[currentBiometric].name}...</p>
                <p className="text-login-highlight text-xs">{scanProgress}% complete</p>
              </div>
            </div>
          ) : (
            /* Biometric Selection State */
            <>
              {/* Biometric Carousel */}
              <div 
                className="relative h-44 md:h-52 flex items-center justify-center select-none"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Navigation Buttons */}
                <button
                  onClick={() => rotateBiometric('left')}
                  className="absolute left-0 z-30 p-2 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300 touch-manipulation"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-login-glow" />
                </button>

                <button
                  onClick={() => rotateBiometric('right')}
                  className="absolute right-0 z-30 p-2 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300 touch-manipulation"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-login-glow" />
                </button>

                {/* Carousel Items */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {getVisibleOptions().map((option) => {
                    const isCenter = option.offset === 0;
                    const scale = isCenter ? 1 : 0.6;
                    const opacity = isCenter ? 1 : 0.35;
                    const translateX = option.offset * 100;
                    const zIndex = isCenter ? 20 : 10;

                    return (
                      <div
                        key={`${option.id}-${option.offset}`}
                        className="absolute transition-all duration-500 ease-out cursor-pointer touch-manipulation"
                        style={{
                          transform: `translateX(${translateX}px) scale(${scale})`,
                          opacity,
                          zIndex,
                        }}
                        onClick={() => (isCenter ? handleAuthenticate() : selectBiometric(option.realIndex))}
                      >
                        <div 
                          className={`flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl border transition-all duration-500 ${
                            isCenter 
                              ? 'border-login-glow bg-login-glow/10 shadow-[0_0_25px_rgba(43,208,255,0.4)] cursor-pointer' 
                              : 'border-login-glow/20 bg-login-panel/30 hover:border-login-glow/50'
                          }`}
                        >
                          <div className={`text-login-glow transition-all duration-500 ${isCenter ? 'animate-pulse' : ''}`}>
                            {option.icon}
                          </div>
                          {isCenter && (
                            <>
                              <h3 className="text-sm md:text-base font-bold text-login-text tracking-wider">{option.name}</h3>
                              <p className="text-xs text-login-highlight tracking-wide text-center">{option.description}</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2">
                {biometricOptions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectBiometric(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentBiometric 
                        ? 'bg-login-glow w-5' 
                        : 'bg-login-glow/30 hover:bg-login-glow/50'
                    }`}
                  />
                ))}
              </div>

              {/* Authenticate Button */}
              <Button
                onClick={handleAuthenticate}
                className="w-full h-11 bg-login-glow hover:bg-login-glow/90 text-login-bg font-bold text-sm tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,208,255,0.5)] touch-manipulation"
              >
                INITIATE SCAN
              </Button>

              {/* Cancel Button */}
              <div className="text-center">
                <button 
                  onClick={onClose}
                  className="text-sm text-login-highlight/60 hover:text-login-glow transition-colors tracking-wide touch-manipulation"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
