import React, { useEffect } from 'react';
import { useFocusStore } from '../store/focusStore';

const SessionReportDisplay: React.FC = () => {
  const { switchCount, totalTimeAwaySeconds, trustScore } = useFocusStore();
  console.log(switchCount,totalTimeAwaySeconds);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex w-full bg-white items-center min-h-screen bg-white-100 ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Session Report</h2>
        <div className="mb-6">
          <p className="text-6xl font-bold text-blue-600">{trustScore}</p>
          <p className="text-gray-500">Trust Score</p>
        </div>
        <div className="flex justify-around">
          <div>
            <p className="text-3xl font-bold text-black">{switchCount}</p>
            <p className="text-gray-500">Switches</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{formatTime(totalTimeAwaySeconds)}</p>
            <p className="text-gray-500">Time Away</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FocusTracker: React.FC = () => {
  const {
    startSession,
    updateSessionTimer,
    isSessionOver,
    isPageFocused,
    switchCount,
    sessionId,
    durationLeft,
  } = useFocusStore();

  useEffect(() => {
    if (!sessionId) {
      startSession();
    }

    if (isSessionOver) return;

    const { handleBlur, handleFocus } = useFocusStore.getState();
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    const sessionTimer = setInterval(updateSessionTimer, 1000);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(sessionTimer);
    };
  }, [sessionId, isSessionOver, startSession, updateSessionTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isSessionOver) {
    return <SessionReportDisplay />;
  }

  return (
    <div className="">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Focus Tracker</h2>
        
        <p className="text-center text-gray-500 mb-6">
          Time Remaining: <span className="font-mono font-bold text-lg text-black">{formatTime(durationLeft)}</span>
        </p>
        
        <div className="space-y-3 text-lg">
          <div className={`p-3 rounded flex justify-between ${isPageFocused ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span>Status:</span>
            <span className="font-semibold">{isPageFocused ? 'Focused' : 'Away'}</span>
          </div>
          <div className="p-3 bg-gray-100 rounded flex justify-between">
            <span>Tab Switches:</span>
            <span className="font-semibold">{switchCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
