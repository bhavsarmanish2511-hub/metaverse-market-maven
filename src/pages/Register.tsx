import { useState, useEffect } from "react";
import { Eye, EyeOff, Scan, Fingerprint, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters" }).max(20, { message: "Username must be less than 20 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; size: number; left: number; delay: number; duration: number }>>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Generate random particles
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
    
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "You must accept the Terms of Service and Privacy Policy",
      });
      return;
    }
    
    // Validate inputs
    const result = registerSchema.safeParse({ username, email, password, confirmPassword });
    
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
    const { error } = await signUp(email, password, username);
    setIsSubmitting(false);

    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--login-bg))' }}>
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
        {/* App title at top */}
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold text-login-text tracking-wider">SecureNet</h1>
        </div>

        {/* Register panel */}
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="glass-panel light-sweep animate-pulse-glow rounded-2xl p-8 space-y-5">
            {/* Large header */}
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-login-text tracking-[0.3em] mb-2">
                CREATE ACCOUNT
              </h2>
              <div className="h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-login-glow to-transparent" />
            </div>

            {/* Username input */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-login-highlight text-sm font-medium tracking-wide">
                USERNAME
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-login-bg/50 border-login-glow/30 text-login-text placeholder:text-login-highlight/40 focus:border-login-glow focus:ring-login-glow/50 h-12"
              />
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-login-highlight text-sm font-medium tracking-wide">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-login-bg/50 border-login-glow/30 text-login-text placeholder:text-login-highlight/40 focus:border-login-glow focus:ring-login-glow/50 h-12"
              />
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-login-highlight text-sm font-medium tracking-wide">
                PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
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

            {/* Confirm Password input */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-login-highlight text-sm font-medium tracking-wide">
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-login-bg/50 border-login-glow/30 text-login-text placeholder:text-login-highlight/40 focus:border-login-glow focus:ring-login-glow/50 h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-login-highlight hover:text-login-glow transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms acceptance */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                disabled={isSubmitting}
                className="border-login-glow/50 data-[state=checked]:bg-login-glow data-[state=checked]:border-login-glow mt-1" 
              />
              <Label
                htmlFor="terms"
                className="text-sm text-login-highlight cursor-pointer leading-relaxed"
              >
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            {/* Biometric enrollment */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-login-glow/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-login-panel px-2 text-login-highlight/60 uppercase tracking-wider">
                    Enroll Biometric Authentication
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 pt-2">
                <button
                  type="button"
                  className="group p-3 rounded-lg border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/5 transition-all duration-300"
                  style={{ animation: 'icon-glow 2s ease-in-out infinite' }}
                >
                  <Scan className="h-6 w-6 text-login-glow" />
                </button>
                <button
                  type="button"
                  className="group p-3 rounded-lg border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/5 transition-all duration-300"
                  style={{ animation: 'icon-glow 2s ease-in-out infinite 0.3s' }}
                >
                  <Fingerprint className="h-6 w-6 text-login-glow" />
                </button>
                <button
                  type="button"
                  className="group p-3 rounded-lg border border-login-glow/30 hover:border-login-glow hover:bg-login-glow/5 transition-all duration-300"
                  style={{ animation: 'icon-glow 2s ease-in-out infinite 0.6s' }}
                >
                  <ScanFace className="h-6 w-6 text-login-glow" />
                </button>
              </div>
            </div>

            {/* Create account button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-login-glow hover:bg-login-glow/90 text-login-bg font-bold text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,208,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>

            {/* Footer links */}
            <div className="flex justify-center text-xs text-login-highlight/60 pt-2">
              <Link to="/login" className="hover:text-login-glow transition-colors">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
