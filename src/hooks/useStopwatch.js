import { useState, useEffect, useRef } from 'react';

export function useStopwatch() {
  const [elapsedTime, setElapsedTime] = useState(0); // in ms
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      const update = () => {
        const now = performance.now();
        const delta = now - startTimeRef.current;
        setElapsedTime(accumulatedTimeRef.current + delta);
        animFrameRef.current = requestAnimationFrame(update);
      };
      animFrameRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animFrameRef.current);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning]);

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = performance.now();
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      accumulatedTimeRef.current = elapsedTime;
      setIsRunning(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
  };

  const addLap = () => {
    if (elapsedTime === 0) return;
    const lastLapTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const lapSplit = elapsedTime - lastLapTotal;

    const newLap = {
      id: laps.length + 1,
      splitTime: lapSplit,
      totalTime: elapsedTime
    };

    setLaps(prev => [newLap, ...prev]);
  };

  // Compute fastest & slowest laps
  let minSplit = Infinity;
  let maxSplit = -Infinity;
  if (laps.length > 1) {
    laps.forEach(l => {
      if (l.splitTime < minSplit) minSplit = l.splitTime;
      if (l.splitTime > maxSplit) maxSplit = l.splitTime;
    });
  }

  return {
    elapsedTime,
    isRunning,
    laps,
    minSplit,
    maxSplit,
    start,
    pause,
    reset,
    addLap
  };
}

export function formatMsTime(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (n) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}
