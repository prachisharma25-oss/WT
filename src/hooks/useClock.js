import { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundSynth';

export function useClock(options = {}) {
  const {
    enableTickSound = false,
    tickMode = 'sweep', // 'sweep' or 'tick'
    scrubOffsetMinutes = 0
  } = options;

  const [realTime, setRealTime] = useState(new Date());
  const lastSecondRef = useRef(realTime.getSeconds());

  useEffect(() => {
    let animId;
    const updateTime = () => {
      const now = new Date();
      setRealTime(now);

      // Trigger soft tick sound on second boundary if enabled
      const currentSec = now.getSeconds();
      if (enableTickSound && currentSec !== lastSecondRef.current) {
        lastSecondRef.current = currentSec;
        soundEngine.playTick(currentSec === 0 ? 1.4 : 1.0); // pitch accent on 00 seconds
      }

      animId = requestAnimationFrame(updateTime);
    };

    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, [enableTickSound]);

  // Compute displayed time with scrubber offset applied
  const effectiveTime = new Date(realTime.getTime() + scrubOffsetMinutes * 60 * 1000);

  return {
    realTime,
    effectiveTime,
    scrubOffsetMinutes,
    isTimeTravelActive: scrubOffsetMinutes !== 0
  };
}
