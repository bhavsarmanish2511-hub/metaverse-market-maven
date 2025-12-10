import { createContext, useContext, useState, ReactNode } from 'react';

interface IRCLeaderContextType {
  // This context is being deprecated and is no longer in use.
  // The properties are kept for type safety in case of residual imports,
  // but the functionality has been removed.
  isIRCLeaderMode: boolean; // Always false
  ircLeaderName: string; // Always empty
  setIRCLeaderMode: (active: boolean, name?: string) => void; // No-op
}

const IRCLeaderContext = createContext<IRCLeaderContextType | undefined>(undefined);

export function IRCLeaderProvider({ children }: { children: ReactNode }) {
  return (
    <IRCLeaderContext.Provider value={{ isIRCLeaderMode: false, ircLeaderName: '', setIRCLeaderMode: () => {} }}>
      {children}
    </IRCLeaderContext.Provider>
  );
}

export function useIRCLeader() {
  return useContext(IRCLeaderContext)!;
}
