import React, { useEffect } from 'react';
import usePresenceStore from '../store/presenceStore';

export const PromptModal: React.FC = () => {
  const {
    promptTimeLeft,
    updatePromptTimer,
    handlePromptResponse
  } = usePresenceStore();

  useEffect(() => {
    const timer = setInterval(() => {
      updatePromptTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [updatePromptTimer]);

  const progressPercentage = (promptTimeLeft / 15) * 100;
  const isUrgent = promptTimeLeft <= 5;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Are you still here?</h3>
        <p className="text-gray-600 mb-6">Please confirm your presence to continue.</p>

        <div className="mb-6">
          <p className="text-5xl font-bold mb-2" style={{ color: isUrgent ? '#ef4444' : '#22c55e' }}>
            {promptTimeLeft}
          </p>
          <p className="text-sm text-gray-500">seconds remaining</p>
        </div>
        
        <button
          onClick={handlePromptResponse}
          className="w-full py-3 px-6 rounded-lg font-semibold text-lg text-white transition-colors bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          I'm here!
        </button>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: isUrgent ? '#ef4444' : '#22c55e'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
