import React, { useState } from 'react';
import { Monitor, Calendar, Hash, Percent } from 'lucide-react';
import { getOrdinalSuffix, getYearProgress } from '../utils/timeUtils';

export function DigitalClock({ date }) {
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [fontFamily, setFontFamily] = useState('Orbitron'); // 'Orbitron', 'Inter', 'Space Mono'

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const displayHours = is24Hour ? String(hours24).padStart(2, '0') : String(hours12).padStart(2, '0');

  // Date formatting
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = daysOfWeek[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOrdinal = getOrdinalSuffix(date.getDate());
  const year = date.getFullYear();

  // Calculate Week Number of the Year
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((date - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);

  const yearPercent = getYearProgress(date);

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title">
          <Monitor size={18} /> Digital Master Clock
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setIs24Hour(!is24Hour)}
            className={`badge ${is24Hour ? 'badge-pink' : 'badge-cyan'}`}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {is24Hour ? '24-HOUR' : '12-HOUR'}
          </button>

          <select 
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          >
            <option value="Orbitron">Cyber LED</option>
            <option value="Inter">Clean Sans</option>
            <option value="Space Mono">Tech Mono</option>
            <option value="Cinzel">Serif Luxury</option>
          </select>
        </div>
      </div>

      <div className="digital-clock-container">
        <div 
          className="digital-time-display"
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
        >
          <span>{displayHours}</span>
          <span style={{ animation: 'blinkColon 1s infinite' }}>:</span>
          <span>{minutes}</span>

          {showSeconds && (
            <>
              <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>:</span>
              <span className="digital-seconds">{seconds}</span>
            </>
          )}

          {!is24Hour && <span className="digital-ampm">{ampm}</span>}
        </div>

        {/* Date & Week Details */}
        <div className="digital-date-info">
          <Calendar size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span>{dayName}, {monthName} {dayOrdinal}, {year}</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <Hash size={14} style={{ color: 'var(--accent-amber)' }} />
          <span>Week {weekNum}</span>
        </div>

        {/* Year Progress Bar */}
        <div style={{ width: '100%', marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Percent size={12} style={{ color: 'var(--accent-green)' }} /> {year} Year Progress
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{yearPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${yearPercent}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-green) 100%)',
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
