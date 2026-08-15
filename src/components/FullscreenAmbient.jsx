import React, { useState, useEffect } from 'react';
import { Minimize2, Sun, Moon } from 'lucide-react';
import { getOrdinalSuffix, getDayNightStatus } from '../utils/timeUtils';

export function FullscreenAmbient({ date, onClose }) {
  const [offsetY, setOffsetY] = useState(0);

  // Anti-burn-in subtle floating motion
  useEffect(() => {
    const interval = setInterval(() => {
      setOffsetY(prev => (prev === 0 ? 12 : prev === 12 ? -12 : 0));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const hours12 = date.getHours() % 12 || 12;
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = daysOfWeek[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOrdinal = getOrdinalSuffix(date.getDate());
  const year = date.getFullYear();

  const dayNight = getDayNightStatus(date.getHours());

  return (
    <div className="fullscreen-nightstand" onClick={onClose} title="Click anywhere to exit Fullscreen Mode">
      <button 
        onClick={onClose}
        className="btn btn-secondary btn-sm"
        style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, background: 'rgba(255,255,255,0.1)' }}
      >
        <Minimize2 size={16} /> Exit Ambient View
      </button>

      <div style={{ transform: `translateY(${offsetY}px)`, transition: 'transform 8s ease-in-out', textAlign: 'center' }}>
        <div className="fullscreen-clock">
          {String(hours12).padStart(2, '0')}:{minutes}
          <span style={{ fontSize: '3rem', opacity: 0.7, marginLeft: '0.5rem' }}>:{seconds}</span>
          <span style={{ fontSize: '2rem', color: 'var(--accent-pink)', marginLeft: '1rem' }}>{ampm}</span>
        </div>

        <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <span>{dayName}, {monthName} {dayOrdinal}, {year}</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)' }}>
            {dayNight.isDay ? <Sun size={24} /> : <Moon size={24} />} {dayNight.status}
          </span>
        </div>
      </div>
    </div>
  );
}
