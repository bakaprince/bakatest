import { useState, useEffect, useRef } from 'react';
import { TimerConfig } from '../types/session';

interface UseTimerProps {
  timerConfig: TimerConfig;
  deadlineTimestamp: number | null;
  initialElapsedSeconds: number;
  isActive: boolean;
  onTimeExpire?: () => void;
  onTick?: (elapsed: number) => void;
}

export function useTimer({
  timerConfig,
  deadlineTimestamp,
  initialElapsedSeconds,
  isActive,
  onTimeExpire,
  onTick,
}: UseTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(initialElapsedSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (timerConfig.mode === 'countdown' && deadlineTimestamp) {
      return Math.max(0, Math.floor((deadlineTimestamp - Date.now()) / 1000));
    }
    return 0;
  });

  const onTimeExpireRef = useRef(onTimeExpire);
  onTimeExpireRef.current = onTimeExpire;

  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    // Use interval with real Date.now() timestamp comparisons to ensure accurate time even when tabs sleep
    const startTimeOffset = Date.now() - elapsedSeconds * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const newElapsed = Math.floor((now - startTimeOffset) / 1000);
      setElapsedSeconds(newElapsed);
      if (onTickRef.current) {
        onTickRef.current(newElapsed);
      }

      if (timerConfig.mode === 'countdown' && deadlineTimestamp) {
        const remaining = Math.max(0, Math.floor((deadlineTimestamp - now) / 1000));
        setRemainingSeconds(remaining);

        if (remaining <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          clearInterval(interval);
          if (onTimeExpireRef.current) {
            onTimeExpireRef.current();
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, timerConfig.mode, deadlineTimestamp]);

  return {
    elapsedSeconds,
    remainingSeconds,
    isCountdown: timerConfig.mode === 'countdown',
    isWarning20Percent:
      timerConfig.mode === 'countdown' &&
      timerConfig.countdownMinutes !== null &&
      remainingSeconds <= timerConfig.countdownMinutes * 60 * 0.2 &&
      remainingSeconds > 60,
    isUrgent1Minute:
      timerConfig.mode === 'countdown' &&
      remainingSeconds <= 60 &&
      remainingSeconds > 0,
  };
}
