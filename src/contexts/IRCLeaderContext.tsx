import { createContext, useContext, useState, ReactNode } from 'react';

interface IRCLeaderContextType {
  isIRCLeaderMode: boolean;
  ircLeaderName: string;
  setIRCLeaderMode: (active: boolean, name?: string) => void;
}

const IRCLeaderContext = createContext<IRCLeaderContextType | undefined>(undefined);

export function IRCLeaderProvider({ children }: { children: ReactNode }) {
  const [isIRCLeaderMode, setIsIRCLeaderMode] = useState(false);
  const [ircLeaderName, setIrcLeaderName] = useState('');

  const setIRCLeaderMode = (active: boolean, name: string = 'Commander') => {
    setIsIRCLeaderMode(active);
    setIrcLeaderName(active ? name : '');
  };

  return (
    <IRCLeaderContext.Provider value={{ isIRCLeaderMode, ircLeaderName, setIRCLeaderMode }}>
      {children}
    </IRCLeaderContext.Provider>
  );
}

export function useIRCLeader() {
  const context = useContext(IRCLeaderContext);
  if (!context) {
    throw new Error('useIRCLeader must be used within IRCLeaderProvider');
  }
  return context;
}
