import React, { useEffect } from 'react';
import usePresenceStore from '../store/presenceStore';
import PromptModal from './PromptModal';
import SessionStats from './SessionStats';

const PresenceCheckSession: React.FC = () => {
  const {
    sessionId,
    sessionTimeLeft,
    isSessionActive,
    currentPrompt,
    initializeSession,
    updateSessionTimer,
    getSessionStats
  } = usePresenceStore();

  if(!isSessionActive){
    initializeSession();
  }

  useEffect(() => {
    if (!isSessionActive && sessionTimeLeft > 0) return;
    const timer = setInterval(() => {
      updateSessionTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionActive, updateSessionTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = getSessionStats();

  if (!isSessionActive && sessionTimeLeft <= 0) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div>Session Complete</div>
        <SessionStats stats={stats} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div>Session ID: {sessionId}</div>
      <div>Time Remaining: {formatTime(sessionTimeLeft)}</div>
      {currentPrompt && <PromptModal />}
    </div>
  );
};

export default PresenceCheckSession;
