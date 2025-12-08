import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Fingerprint, ScanFace, Mic, Atom, CheckCircle, Loader2, Zap } from 'lucide-react';
import irisScanImage from '@/assets/iris-scan.png';
import { playSoothingAlertTone } from '@/lib/alertSound';

interface IRCAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type BiometricOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export function IRCAuthModal({ open, onClose, onSuccess }: IRCAuthModalProps) {
  const [currentBiometric, setCurrentBiometric] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [authSuccess, setAuthSuccess] = useState(false);

  const biometricOptions: BiometricOption[] = [
    {
      id: "fingerprint",
      name: "Fingerprint",
      icon: <Fingerprint className="h-16 w-16" />,
      description: "Touch sensor authentication"
    },
    {
      id: "face",
      name: "Face Recognition",
      icon: <ScanFace className="h-16 w-16" />,
      description: "3D facial mapping scan"
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

  useEffect(() => {
    if (!open) {
      setIsScanning(false);
      setScanProgress(0);
      setAuthSuccess(false);
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
    for (let i = -2; i <= 2; i++) {
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
      await new Promise(resolve => setTimeout(resolve, 50));
      setScanProgress(i);
    }

    // Show success with soothing tone
    setAuthSuccess(true);
    playSoothingAlertTone('success');

    // Navigate after success
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl border-login-glow/30 bg-login-bg/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-login-text tracking-[0.2em]">
              IRC LEADER ACCESS
            </h2>
            <div className="relative h-[2px] w-24 mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-login-glow to-transparent animate-[laser-sweep_3s_ease-in-out_infinite]" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-login-highlight text-sm tracking-wide">POWERED BY HELIOS</p>
            </div>
          </div>

          {authSuccess ? (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="p-6 rounded-full bg-success/20 animate-pulse">
                <CheckCircle className="h-20 w-20 text-success" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-success">Authentication Successful</h3>
                <p className="text-login-highlight">Accessing IRC Leader Console...</p>
              </div>
            </div>
          ) : isScanning ? (
            /* Scanning State */
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="relative">
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
                    className="text-login-glow transition-all duration-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-login-glow animate-pulse">
                    {biometricOptions[currentBiometric].icon}
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-login-glow font-semibold">Authenticating with {biometricOptions[currentBiometric].name}...</p>
                <p className="text-login-highlight text-sm">{scanProgress}% complete</p>
              </div>
            </div>
          ) : (
            /* Biometric Selection State */
            <>
              {/* Biometric Carousel */}
              <div className="relative h-56 flex items-center justify-center select-none">
                {/* Navigation Buttons */}
                <button
                  onClick={() => rotateBiometric('left')}
                  className="absolute left-0 z-30 p-2 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300"
                >
                  <ChevronLeft className="h-5 w-5 text-login-glow" />
                </button>

                <button
                  onClick={() => rotateBiometric('right')}
                  className="absolute right-0 z-30 p-2 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300"
                >
                  <ChevronRight className="h-5 w-5 text-login-glow" />
                </button>

                {/* Carousel Items */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {getVisibleOptions().map((option) => {
                    const isCenter = option.offset === 0;
                    const isAdjacent = Math.abs(option.offset) === 1;
                    const scale = isCenter ? 1 : isAdjacent ? 0.6 : 0.35;
                    const opacity = isCenter ? 1 : isAdjacent ? 0.4 : 0.15;
                    const translateX = option.offset * 120;
                    const zIndex = isCenter ? 20 : isAdjacent ? 15 : 10;

                    return (
                      <div
                        key={`${option.id}-${option.offset}`}
                        className="absolute transition-all duration-500 ease-out cursor-pointer"
                        style={{
                          transform: `translateX(${translateX}px) scale(${scale})`,
                          opacity,
                          zIndex,
                        }}
                        onClick={() => !isCenter && selectBiometric(option.realIndex)}
                      >
                        <div 
                          className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-500 ${
                            isCenter 
                              ? 'border-login-glow bg-login-glow/10 shadow-[0_0_25px_rgba(43,208,255,0.4)]' 
                              : 'border-login-glow/20 bg-login-panel/30 hover:border-login-glow/50'
                          }`}
                        >
                          <div className={`text-login-glow transition-all duration-500 ${isCenter ? 'animate-pulse' : ''}`}>
                            {option.icon}
                          </div>
                          {isCenter && (
                            <>
                              <h3 className="text-base font-bold text-login-text tracking-wider">{option.name}</h3>
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
                className="w-full h-12 bg-login-glow hover:bg-login-glow/90 text-login-bg font-bold text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,208,255,0.5)]"
              >
                INITIATE SCAN
              </Button>

              {/* Cancel Button */}
              <div className="text-center">
                <button 
                  onClick={onClose}
                  className="text-sm text-login-highlight/60 hover:text-login-glow transition-colors tracking-wide"
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
