import { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundSynth';

const ALARMS_STORAGE_KEY = 'chronopulse_alarms_v1';

const DEFAULT_ALARMS = [
  { id: '1', time: '07:30', label: 'Morning Wakeup', enabled: true, sound: 'chime', repeatDays: [1,2,3,4,5] },
  { id: '2', time: '12:45', label: 'Lunch & Walk', enabled: false, sound: 'digital', repeatDays: [1,2,3,4,5] },
  { id: '3', time: '17:00', label: 'Evening Review', enabled: true, sound: 'cyber', repeatDays: [1,2,3,4,5] }
];

export function useAlarms(currentDate) {
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem(ALARMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ALARMS;
    } catch (e) {
      return DEFAULT_ALARMS;
    }
  });

  const [activeAlarmTrigger, setActiveAlarmTrigger] = useState(null);
  const triggeredMinuteRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
    } catch (e) {
      console.error(e);
    }
  }, [alarms]);

  // Check alarms on current time change
  useEffect(() => {
    if (!currentDate) return;
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = currentDate.getSeconds();
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1 is Mon...
    const timeStr = `${hours}:${minutes}`;

    // Prevent duplicate trigger in same minute
    const currentMinuteKey = `${timeStr}_${currentDate.getDate()}`;
    if (triggeredMinuteRef.current === currentMinuteKey && seconds > 2) {
      return;
    }

    // Find matching active alarm
    const triggered = alarms.find(a => {
      if (!a.enabled) return false;
      if (a.time !== timeStr) return false;
      // Check repeat days if set
      if (a.repeatDays && a.repeatDays.length > 0) {
        return a.repeatDays.includes(dayOfWeek);
      }
      return true;
    });

    if (triggered && seconds < 3 && !activeAlarmTrigger) {
      triggeredMinuteRef.current = currentMinuteKey;
      setActiveAlarmTrigger(triggered);
      soundEngine.playAlarmPreset(triggered.sound || 'digital');
    }
  }, [currentDate, alarms, activeAlarmTrigger]);

  const addAlarm = (newAlarm) => {
    const alarmObj = {
      id: Date.now().toString(),
      time: newAlarm.time || '08:00',
      label: newAlarm.label || 'New Alarm',
      enabled: true,
      sound: newAlarm.sound || 'chime',
      repeatDays: newAlarm.repeatDays || [1,2,3,4,5]
    };
    setAlarms(prev => [...prev, alarmObj]);
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const snoozeAlarm = (minutes = 5) => {
    if (!activeAlarmTrigger) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeHours = String(now.getHours()).padStart(2, '0');
    const snoozeMinutes = String(now.getMinutes()).padStart(2, '0');
    
    const snoozedAlarm = {
      ...activeAlarmTrigger,
      id: `snooze_${Date.now()}`,
      time: `${snoozeHours}:${snoozeMinutes}`,
      label: `Snoozed: ${activeAlarmTrigger.label}`,
      enabled: true
    };
    setAlarms(prev => [...prev, snoozedAlarm]);
    setActiveAlarmTrigger(null);
  };

  const dismissAlarm = () => {
    setActiveAlarmTrigger(null);
  };

  return {
    alarms,
    activeAlarmTrigger,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    snoozeAlarm,
    dismissAlarm
  };
}
