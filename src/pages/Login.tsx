import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Fingerprint, ScanFace, Zap, Mic, ChevronLeft, ChevronRight, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import irisScanImage from "@/assets/iris-scan.png";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type BiometricOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showTraditionalLogin, setShowTraditionalLogin] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; size: number; left: number; delay: number; duration: number }>>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [currentBiometric, setCurrentBiometric] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setJustLoggedIn } = useRole();
  const carouselRef = useRef<HTMLDivElement>(null);

  const biometricOptions: BiometricOption[] = [
    {
      id: "fingerprint",
      name: "Fingerprint",
      icon: <Fingerprint className="h-20 w-20" />,
      description: "Touch sensor authentication"
    },
    {
      id: "face",
      name: "Face Recognition",
      icon: <ScanFace className="h-20 w-20" />,
      description: "3D facial mapping scan"
    },
    {
      id: "iris",
      name: "Iris Scan",
      icon: <img src={irisScanImage} alt="Iris Scan" className="h-20 w-20 rounded-full object-cover" />,
      description: "Retinal pattern analysis"
    },
    {
      id: "voice",
      name: "Voice Recognition",
      icon: <Mic className="h-20 w-20" />,
      description: "Vocal signature verification"
    },
    {
      id: "quantum",
      name: "Quantum Auth",
      icon: <Atom className="h-20 w-20" />,
      description: "Quantum entanglement key"
    }
  ];

  // Minimum swipe distance
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
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20,
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      const errors = result.error.errors;
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (!error) {
      setJustLoggedIn(true);
      navigate("/");
    }
  };

  const handleBiometricAuth = async () => {
    setIsBiometricScanning(true);
    
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    setIsBiometricScanning(false);
    
    const { error } = await signIn("demo@securenet.com", "demo123456");
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Biometric Authentication",
        description: "Please create a demo account (demo@securenet.com) or use the email/password form.",
      });
    } else {
      setJustLoggedIn(true);
      navigate("/");
    }
  };

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

  // Biometric-specific scanner overlays
  const renderBiometricScanner = () => {
    const current = biometricOptions[currentBiometric];
    
    switch (current.id) {
      case "fingerprint":
        return <FingerprintScanner />;
      case "face":
        return <FaceRecognitionScanner />;
      case "iris":
        return <IrisScanner />;
      case "voice":
        return <VoiceWaveformScanner />;
      case "quantum":
        return <QuantumScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--login-bg))' }}>
      {/* Biometric Scanner Overlay */}
      {isBiometricScanning && (
        <div className="biometric-scanner">
          {renderBiometricScanner()}
        </div>
      )}

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute rounded-full bg-login-glow/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              bottom: '-20px',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* App title */}
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-login-text tracking-wider">SecureNet</h1>
          
        </div>

        {/* Quantum Status */}
        <div className="absolute top-8 right-8 space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-quantum-primary/30 bg-quantum-primary/10 animate-lattice-pulse">
            <Zap className="h-3 w-3 text-quantum-primary" />
            <span className="text-xs text-quantum-primary font-semibold tracking-wide">QUANTUM SAFE</span>
          </div>
        </div>

        {/* Login panel */}
        <div className="w-full max-w-2xl">
          {!showTraditionalLogin ? (
            <div className="glass-panel light-sweep animate-pulse-glow rounded-2xl p-8 space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-login-text tracking-[0.3em] mb-2">
                  SECURENET
                </h2>
                <div className="relative h-[2px] w-24 mx-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-login-glow to-transparent animate-[laser-sweep_3s_ease-in-out_infinite]" />
                </div>
                <p className="text-login-highlight text-sm mt-4 tracking-wide">POWERED BY HELIOS</p>
              </div>

              {/* Biometric Carousel */}
              <div 
                ref={carouselRef}
                className="relative h-72 flex items-center justify-center select-none"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Navigation Buttons */}
                <button
                  onClick={() => rotateBiometric('left')}
                  className="absolute left-0 z-30 p-3 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300 touch-manipulation"
                  disabled={isBiometricScanning}
                >
                  <ChevronLeft className="h-6 w-6 text-login-glow" />
                </button>

                <button
                  onClick={() => rotateBiometric('right')}
                  className="absolute right-0 z-30 p-3 rounded-full bg-login-panel/50 border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/10 transition-all duration-300 touch-manipulation"
                  disabled={isBiometricScanning}
                >
                  <ChevronRight className="h-6 w-6 text-login-glow" />
                </button>

                {/* Carousel Items */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {getVisibleOptions().map((option) => {
                    const isCenter = option.offset === 0;
                    const isAdjacent = Math.abs(option.offset) === 1;
                    const scale = isCenter ? 1 : isAdjacent ? 0.65 : 0.4;
                    const opacity = isCenter ? 1 : isAdjacent ? 0.5 : 0.2;
                    const translateX = option.offset * 140;
                    const zIndex = isCenter ? 20 : isAdjacent ? 15 : 10;

                    return (
                      <div
                        key={`${option.id}-${option.offset}`}
                        className="absolute transition-all duration-500 ease-out cursor-pointer touch-manipulation"
                        style={{
                          transform: `translateX(${translateX}px) scale(${scale})`,
                          opacity,
                          zIndex,
                        }}
                        onClick={() => !isCenter && selectBiometric(option.realIndex)}
                        onTouchEnd={(e) => {
                          if (!isCenter) {
                            e.stopPropagation();
                            selectBiometric(option.realIndex);
                          }
                        }}
                      >
                        <div 
                          className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-500 ${
                            isCenter 
                              ? 'border-login-glow bg-login-glow/10 shadow-[0_0_30px_rgba(43,208,255,0.5)]' 
                              : 'border-login-glow/20 bg-login-panel/30 hover:border-login-glow/50'
                          }`}
                        >
                          <div className={`text-login-glow transition-all duration-500 ${isCenter ? 'animate-pulse-glow' : ''}`}>
                            {option.icon}
                          </div>
                          {isCenter && (
                            <>
                              <h3 className="text-lg font-bold text-login-text tracking-wider">{option.name}</h3>
                              <p className="text-xs text-login-highlight tracking-wide text-center">{option.description}</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <p className="text-login-highlight text-sm mt-2 tracking-wide">AUTHENTICATION REQUIRED</p>
              </div>
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2">
                {biometricOptions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectBiometric(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentBiometric 
                        ? 'bg-login-glow w-6' 
                        : 'bg-login-glow/30 hover:bg-login-glow/50'
                    }`}
                  />
                ))}
              </div>
              {/* Authenticate Button */}
              <Button
                onClick={handleBiometricAuth}
                disabled={isBiometricScanning}
                className="w-full h-12 bg-login-glow hover:bg-login-glow/90 text-login-bg font-bold text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,208,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isBiometricScanning ? "AUTHENTICATING..." : "INITIATE SCAN"}
              </Button>
              
              
              {/* Traditional Login Alternative */}
              <div className="text-center">
                <button 
                  onClick={() => setShowTraditionalLogin(true)}
                  className="text-sm text-login-highlight/60 hover:text-login-glow transition-colors tracking-wide touch-manipulation"
                >
                  Use Email & Password Instead
                </button>
              </div>
            </div>
          ) : (
            /* Traditional Email/Password Form */
            <form onSubmit={handleSubmit} className="glass-panel light-sweep animate-pulse-glow rounded-2xl p-8 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-login-text tracking-[0.3em] mb-2">
                  SECURENET
                </h2>
                <div className="relative h-[2px] w-24 mx-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-login-glow to-transparent animate-[laser-sweep_3s_ease-in-out_infinite]" />
                </div>
                <p className="text-login-highlight text-sm mt-4 tracking-wide">TRADITIONAL LOGIN</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-login-highlight text-sm font-medium tracking-wide">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-login-bg/50 border-login-glow/30 text-login-text placeholder:text-login-highlight/40 focus:border-login-glow focus:ring-login-glow/50 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-login-highlight text-sm font-medium tracking-wide">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-login-bg/50 border-login-glow/30 text-login-text placeholder:text-login-highlight/40 focus:border-login-glow focus:ring-login-glow/50 h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-login-highlight hover:text-login-glow transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-login-glow/50 data-[state=checked]:bg-login-glow data-[state=checked]:border-login-glow" />
                <Label htmlFor="remember" className="text-sm text-login-highlight cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-login-glow hover:bg-login-glow/90 text-login-bg font-bold text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,208,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setShowTraditionalLogin(false)}
                  className="text-sm text-login-highlight/60 hover:text-login-glow transition-colors tracking-wide"
                >
                  Back to Biometric Authentication
                </button>
              </div>

              <div className="flex justify-between text-xs text-login-highlight/60 pt-2">
                <button type="button" className="hover:text-login-glow transition-colors">Forgot password?</button>
                <Link to="/register" className="hover:text-login-glow transition-colors">Create account</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Fingerprint Scanner with ridge detection
function FingerprintScanner() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Fingerprint with animated ridges */}
      <div className="relative w-48 h-48">
        <Fingerprint className="w-48 h-48 text-login-glow/30" />
        
        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-login-glow to-transparent"
            style={{ animation: 'fingerprint-scan 2s ease-in-out infinite' }}
          />
        </div>
        
        {/* Ridge detection dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 60 + Math.random() * 20;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-quantum-accent"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 4px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 4px)`,
                animation: `ridge-detect 0.5s ease-out ${i * 0.15}s forwards`,
                opacity: 0,
              }}
            />
          );
        })}
      </div>
      
      <p className="text-login-glow text-lg font-medium tracking-wider mt-6">SCANNING FINGERPRINT</p>
      <p className="text-login-highlight text-sm tracking-wide mt-2">Ridge pattern analysis in progress</p>
      
      {/* Progress bar */}
      <div className="w-48 h-1 bg-login-panel mt-4 rounded-full overflow-hidden">
        <div className="h-full bg-login-glow" style={{ animation: 'progress-fill 3s linear forwards' }} />
      </div>
    </div>
  );
}

// Face Recognition with grid overlay
function FaceRecognitionScanner() {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-56 h-56">
        {/* Face outline */}
        <ScanFace className="w-56 h-56 text-login-glow/30" />
        
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Vertical lines */}
          {[...Array(8)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={25 + i * 20}
              y1="20"
              x2={25 + i * 20}
              y2="180"
              stroke="hsl(var(--login-glow))"
              strokeWidth="0.5"
              opacity="0.3"
              style={{ animation: `grid-line-v 2s ease-out ${i * 0.1}s forwards` }}
            />
          ))}
          {/* Horizontal lines */}
          {[...Array(8)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="20"
              y1={25 + i * 20}
              x2="180"
              y2={25 + i * 20}
              stroke="hsl(var(--login-glow))"
              strokeWidth="0.5"
              opacity="0.3"
              style={{ animation: `grid-line-h 2s ease-out ${i * 0.1}s forwards` }}
            />
          ))}
        </svg>
        
        {/* Facial landmark points */}
        {[
          { x: 70, y: 70 }, { x: 130, y: 70 }, // Eyes
          { x: 100, y: 100 }, // Nose
          { x: 75, y: 130 }, { x: 125, y: 130 }, // Mouth corners
          { x: 100, y: 140 }, // Chin
          { x: 50, y: 90 }, { x: 150, y: 90 }, // Cheeks
        ].map((point, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full border-2 border-quantum-accent"
            style={{
              left: `calc(${point.x / 2}% - 6px)`,
              top: `calc(${point.y / 2}% - 6px)`,
              animation: `landmark-detect 0.3s ease-out ${i * 0.2}s forwards`,
              opacity: 0,
              transform: 'scale(0)',
            }}
          />
        ))}
      </div>
      
      <p className="text-login-glow text-lg font-medium tracking-wider mt-6">FACIAL RECOGNITION</p>
      <p className="text-login-highlight text-sm tracking-wide mt-2">Mapping 68 facial landmarks</p>
      
      <div className="flex items-center gap-2 mt-4">
        <div className="h-2 w-2 rounded-full bg-quantum-accent animate-pulse"></div>
        <span className="text-xs text-quantum-accent">3D Depth Analysis Active</span>
      </div>
    </div>
  );
}

// Iris Scanner
function IrisScanner() {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Iris image */}
        <img src={irisScanImage} alt="Iris" className="w-48 h-48 rounded-full object-cover" />
        
        {/* Scanning circles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-login-glow"
            style={{
              animation: `iris-scan-ring 2s ease-out ${i * 0.5}s infinite`,
              opacity: 0,
            }}
          />
        ))}
        
        {/* Center targeting */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-quantum-accent rounded-full animate-pulse" />
          <div className="absolute w-1 h-12 bg-quantum-accent/50" />
          <div className="absolute w-12 h-1 bg-quantum-accent/50" />
        </div>
      </div>
      
      <p className="text-login-glow text-lg font-medium tracking-wider mt-6">IRIS SCAN</p>
      <p className="text-login-highlight text-sm tracking-wide mt-2">Analyzing retinal pattern</p>
      
      <div className="flex items-center gap-2 mt-4">
        <div className="h-2 w-2 rounded-full bg-quantum-primary animate-pulse"></div>
        <span className="text-xs text-quantum-primary">Pattern Matching: 256 points</span>
      </div>
    </div>
  );
}

// Voice Waveform Scanner
function VoiceWaveformScanner() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Waveform visualization */}
      <div className="relative w-72 h-32 flex items-center justify-center gap-1">
        {[...Array(32)].map((_, i) => {
          const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
          return (
            <div
              key={i}
              className="w-1.5 bg-login-glow rounded-full"
              style={{
                height: `${height}px`,
                animation: `waveform-bar 0.5s ease-in-out ${i * 0.03}s infinite alternate`,
              }}
            />
          );
        })}
      </div>
      
      {/* Frequency spectrum */}
      <div className="w-72 h-16 flex items-end justify-center gap-0.5 mt-4">
        {[...Array(48)].map((_, i) => {
          const height = 10 + Math.random() * 40;
          return (
            <div
              key={i}
              className="w-1 bg-quantum-accent/60 rounded-t"
              style={{
                height: `${height}px`,
                animation: `spectrum-bar 0.3s ease-in-out ${i * 0.02}s infinite alternate`,
              }}
            />
          );
        })}
      </div>
      
      <div className="flex items-center gap-3 mt-6">
        <Mic className="h-8 w-8 text-login-glow animate-pulse" />
        <div>
          <p className="text-login-glow text-lg font-medium tracking-wider">VOICE RECOGNITION</p>
          <p className="text-login-highlight text-sm tracking-wide">Speak your passphrase</p>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-xs text-success">Recording</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-quantum-accent animate-pulse"></div>
          <span className="text-xs text-quantum-accent">Analyzing</span>
        </div>
      </div>
    </div>
  );
}

// Quantum Authentication Scanner
function QuantumScanner() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Quantum entanglement visualization */}
      <div className="relative w-56 h-56">
        {/* Central atom */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Atom className="w-20 h-20 text-quantum-primary animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        
        {/* Orbital rings */}
        {[0, 60, 120].map((rotation, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 border-quantum-primary/30 rounded-full"
            style={{
              transform: `rotateX(70deg) rotateZ(${rotation}deg)`,
              animation: `quantum-orbit 3s linear infinite`,
              animationDelay: `${i * -1}s`,
            }}
          >
            <div
              className="absolute w-3 h-3 bg-quantum-accent rounded-full"
              style={{
                top: '-6px',
                left: 'calc(50% - 6px)',
                boxShadow: '0 0 10px hsl(var(--quantum-accent))',
              }}
            />
          </div>
        ))}
        
        {/* Quantum particles */}
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const radius = 100;
          return (
            <div
              key={i}
              className="quantum-particle"
              style={{
                // @ts-ignore
                '--tx': `${Math.cos(angle) * radius}px`,
                '--ty': `${Math.sin(angle) * radius}px`,
                left: '50%',
                top: '50%',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          );
        })}
      </div>
      
      <p className="text-quantum-primary text-lg font-medium tracking-wider mt-6">QUANTUM KEY EXCHANGE</p>
      <p className="text-quantum-glow text-sm tracking-wide mt-2">Establishing entangled connection</p>
      
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-quantum-primary animate-pulse-glow"></div>
          <span className="text-xs text-quantum-primary">QKD Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-quantum-secondary animate-pulse-glow"></div>
          <span className="text-xs text-quantum-secondary">Lattice Crypto</span>
        </div>
      </div>
    </div>
  );
}
