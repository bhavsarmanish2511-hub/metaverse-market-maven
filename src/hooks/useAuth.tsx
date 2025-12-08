import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock user type for demo purposes
interface MockUser {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<{ user: MockUser } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing mock session in localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock sign in - accept any credentials for demo
      const mockUser: MockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        username: email.split('@')[0],
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to SecureNet.",
      });
      
      return { error: null };
    } catch (error) {
      const authError = error as Error;
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: authError.message,
      });
      return { error: authError };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Mock sign up - accept any credentials for demo
      const mockUser: MockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        username,
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      toast({
        title: "Success!",
        description: "Account created successfully. Welcome to SecureNet!",
      });
      
      return { error: null };
    } catch (error) {
      const authError = error as Error;
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: authError.message,
      });
      return { error: authError };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('mockUser');
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
