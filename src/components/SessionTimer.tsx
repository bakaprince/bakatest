import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTime } from '../utils/scoring';

interface SessionTimerProps {
  elapsedSeconds: number;
  remainingSeconds: number;
  isCountdown: boolean;
  isWarning20Percent: boolean;
  isUrgent1Minute: boolean;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  elapsedSeconds,
  remainingSeconds,
  isCountdown,
  isWarning20Percent,
  isUrgent1Minute,
}) => {
  const displayTime = isCountdown ? formatTime(remainingSeconds) : formatTime(elapsedSeconds);

  let badgeColor = 'bg-gray-50 border-gray-200 text-gray-800';
  let iconColor = 'text-gray-500';

  if (isCountdown) {
    if (isUrgent1Minute) {
      badgeColor = 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse';
      iconColor = 'text-rose-600';
    } else if (isWarning20Percent) {
      badgeColor = 'bg-amber-50 border-amber-300 text-amber-700';
      iconColor = 'text-amber-600';
    } else {
      badgeColor = 'bg-blue-50 border-blue-200 text-blue-900';
      iconColor = 'text-blue-600';
    }
  }

  return (
    <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors shadow-2xs ${badgeColor}`}>
      <div className="flex items-center gap-2">
        {isUrgent1Minute ? (
          <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
        ) : (
          <Clock className={`w-4 h-4 ${iconColor}`} />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider">
          {isCountdown ? 'TIME REMAINING' : 'ELAPSED TIME'}
        </span>
      </div>

      <div className="font-mono font-bold text-base sm:text-lg tracking-tight">
        {displayTime}
      </div>
    </div>
  );
};
