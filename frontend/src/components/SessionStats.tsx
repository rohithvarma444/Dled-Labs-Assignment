import React from 'react';
import type { SessionStatus as SessionStatsType } from '../types/presence';

interface SessionStatsProps {
  stats: SessionStatsType;
}

const SessionStats: React.FC<SessionStatsProps> = ({ stats }) => {
  const getPerformanceConfig = (responseRate: number) => {
    if (responseRate >= 80) {
      return {
        icon: '🎉',
        message: 'Excellent engagement!',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    } else if (responseRate >= 60) {
      return {
        icon: '⚡',
        message: 'Good engagement',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        icon: '⚠️',
        message: 'Focus could be improved',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    }
  };

  const performanceConfig = getPerformanceConfig(stats.responseRate);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Session Summary</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Prompts</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.responded}</div>
          <div className="text-sm text-gray-600">Responded</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{stats.missed}</div>
          <div className="text-sm text-gray-600">Missed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.responseRate}%</div>
          <div className="text-sm text-gray-600">Response Rate</div>
        </div>
      </div>
      
      {/* Performance Indicator */}
      <div className={`p-4 rounded-lg border ${performanceConfig.bgColor} ${performanceConfig.borderColor}`}>
        <div className={`flex items-center justify-center space-x-2 ${performanceConfig.textColor}`}>
          <span className="text-xl">{performanceConfig.icon}</span>
          <span className="font-semibold">{performanceConfig.message}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;
