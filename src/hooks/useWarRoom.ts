import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

export type ParticipantStatus = 'pending' | 'calling' | 'joining' | 'joined';
export type ParticipantType = 'approval' | 'coordination';

export interface WarRoomParticipant {
  id: string;
  name: string;
  role: string;
  type: ParticipantType;
  status: ParticipantStatus;
}

export interface WarRoomLogEntry {
  time: Date;
  message: string;
}

const allParticipants: WarRoomParticipant[] = [
  // Approval Chain
  { id: 'approver-1', name: 'Alex Chen', role: 'Senior DevOps Engineer', type: 'approval', status: 'pending' },
  { id: 'approver-2', name: 'Sarah Mitchell', role: 'Director of Operations', type: 'approval', status: 'pending' },
  { id: 'approver-3', name: 'Michael Torres', role: 'VP of Infrastructure', type: 'approval', status: 'pending' },
  // Team Coordination
  { id: 'coord-1', name: 'David Kim', role: 'Engineering Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-2', name: 'Emily Watson', role: 'Customer Success Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-3', name: 'Robert Chen', role: 'Finance Lead', type: 'coordination', status: 'pending' },
  { id: 'coord-4', name: 'Lisa Park', role: 'Security Lead', type: 'coordination', status: 'pending' },
];

const HELIOS_ACTIONS = [
  "Prioritize failover to US-West-2 based on current business impact.",
  "Draft initial customer communication regarding service degradation.",
  "Prepare rollback procedures for all automated actions.",
];

export const useWarRoom = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participants, setParticipants] = useState<WarRoomParticipant[]>(allParticipants);
  const [isActive, setIsActive] = useState(false);
  const [assemblyTime, setAssemblyTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isAssembling, setIsAssembling] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [heliosTypingIndex, setHeliosTypingIndex] = useState(0);
  const [log, setLog] = useState<WarRoomLogEntry[]>([]);

  const addLog = useCallback((message: string) => {
    setLog(prev => [...prev, { time: new Date(), message }]);
  }, []);

  const resetState = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setParticipants(allParticipants);
    setIsActive(false);
    setAssemblyTime(null);
    setStartTime(null);
    setIsAssembling(false);
    setNewMemberName('');
    setNewMemberRole('');
    setHeliosTypingIndex(0);
    setLog([]);
  }, []);

  const initiate = useCallback(() => {
    // Only reset if not already active
    if (!isActive) {
      resetState();
    }
    setIsOpen(true);
    setIsMinimized(false);
    setStartTime(Date.now());
    toast.info('HELIOS is assembling the War Room bridge...');
    addLog('War Room initiated. Awaiting bridge assembly command.');
  }, [resetState, addLog, isActive]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const startCallingSequence = useCallback(async () => {
    setIsAssembling(true);
    addLog('Bridge assembly command received. Initiating calls...');
  
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  
    const updateParticipantStatus = (id: string, status: ParticipantStatus) => {
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };
  
    for (const person of allParticipants) {
      await delay(500);
      updateParticipantStatus(person.id, 'calling');
      addLog(`Calling ${person.name} (${person.role})...`);
  
      await delay(1000);
      updateParticipantStatus(person.id, 'joining');
      addLog(`${person.name} is joining the bridge...`);
  
      await delay(1000);
      updateParticipantStatus(person.id, 'joined');
      addLog(`${person.name} has joined the bridge.`);
    }
  
    await delay(500);
    setIsActive(true);
    addLog('All participants have joined. War Room is now live.');
    const elapsed = ((Date.now() - (startTime ?? Date.now())) / 1000).toFixed(1);
    setAssemblyTime(parseFloat(elapsed));
    toast.success(`War Room bridge is active! Assembly time: ${elapsed}s`);
  }, [addLog, startTime]);

  const pageNewMember = useCallback(async () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) {
      toast.error("Please enter both name and role for the new member.");
      return;
    }

    const newId = `manual-${nanoid(5)}`;
    const newParticipant: WarRoomParticipant = {
      id: newId,
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      type: 'coordination',
      status: 'pending',
    };

    setParticipants(prev => [...prev, newParticipant]);
    setNewMemberName('');
    setNewMemberRole('');
    toast.info(`Paging ${newParticipant.name}...`);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const updateStatus = (status: ParticipantStatus) => {
      setParticipants(prev => prev.map(p => p.id === newId ? { ...p, status } : p));
    };

    await delay(200);
    updateStatus('calling');
    addLog(`Paging new member: ${newParticipant.name} (${newParticipant.role})...`);
    await delay(1500);
    updateStatus('joining');
    addLog(`${newParticipant.name} is joining the bridge...`);
    await delay(1000);
    updateStatus('joined');
    addLog(`${newParticipant.name} has joined the bridge.`);
  }, [newMemberName, newMemberRole, addLog]);

  useEffect(() => {
    if (isOpen && heliosTypingIndex < HELIOS_ACTIONS.length) {
      const timer = setTimeout(() => {
        setHeliosTypingIndex(heliosTypingIndex + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, heliosTypingIndex]);

  return {
    isOpen,
    isMinimized,
    setIsMinimized,
    participants,
    isActive,
    assemblyTime,
    isAssembling,
    newMemberName,
    newMemberRole,
    heliosTypingIndex,
    log,
    HELIOS_ACTIONS,
    initiate,
    startCallingSequence,
    closeDialog,
    pageNewMember,
    setNewMemberName,
    setNewMemberRole,
    resetState,
  };
};