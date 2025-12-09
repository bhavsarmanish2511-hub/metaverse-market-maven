import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'analyst' | 'irc_leader' | 'offensive_tester' | 'rcc_head';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roleName: string;
  isRCCHead: boolean;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  pendingRole: UserRole;
  setPendingRole: (role: UserRole) => void;
  justLoggedIn: boolean;
  setJustLoggedIn: (value: boolean) => void;
  showLoginAlerts: boolean;
  setShowLoginAlerts: (value: boolean) => void;
}

const roleNames: Record<UserRole, string> = {
  analyst: 'Integrated Operations Analyst',
  irc_leader: 'IRC Leader',
  offensive_tester: 'Offensive Tester',
  rcc_head: 'Resilient Command Centre Head',
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('rcc_head');
  const [pendingRole, setPendingRole] = useState<UserRole>('rcc_head');
  const [isVerified, setIsVerified] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [showLoginAlerts, setShowLoginAlerts] = useState(false);

  return (
    <RoleContext.Provider value={{
      currentRole,
      setCurrentRole,
      roleName: roleNames[currentRole],
      isRCCHead: currentRole === 'rcc_head',
      isVerified,
      setIsVerified,
      pendingRole,
      setPendingRole,
      justLoggedIn,
      setJustLoggedIn,
      showLoginAlerts,
      setShowLoginAlerts,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
