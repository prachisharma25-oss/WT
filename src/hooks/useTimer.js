import { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundSynth';

export function useTimer(initialSeconds = 300) {
  const [totalDuration, setTotalDuration] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            soundEngine.playTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft]);

  const start = () => {
    if (secondsLeft > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(totalDuration);
  };

  const setPreset = (seconds) => {
    setIsRunning(false);
    setIsFinished(false);
    setTotalDuration(seconds);
    setSecondsLeft(seconds);
  };

  const setCustomTime = (hours, mins, secs) => {
    const total = (parseInt(hours) || 0) * 3600 + (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    if (total > 0) {
      setPreset(total);
    }
  };

  const progressPercent = totalDuration > 0 ? ((totalDuration - secondsLeft) / totalDuration) * 100 : 0;

  return {
    totalDuration,
    secondsLeft,
    isRunning,
    isFinished,
    progressPercent,
    start,
    pause,
    reset,
    setPreset,
    setCustomTime
  };
}

export function formatTimerDisplay(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
