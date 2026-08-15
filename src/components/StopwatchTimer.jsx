import React, { useState } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Sparkles, 
  Download, 
  CheckCircle 
} from 'lucide-react';

import { useStopwatch, formatMsTime } from '../hooks/useStopwatch';
import { useTimer, formatTimerDisplay } from '../hooks/useTimer';

export function StopwatchTimer() {
  const [activeTab, setActiveTab] = useState('timer'); // 'timer' or 'stopwatch'

  // Stopwatch state
  const stopwatch = useStopwatch();

  // Timer state
  const timer = useTimer(300); // 5 min default

  const [inputHrs, setInputHrs] = useState('0');
  const [inputMins, setInputMins] = useState('5');
  const [inputSecs, setInputSecs] = useState('0');

  const handleCustomTimerSubmit = (e) => {
    e.preventDefault();
    timer.setCustomTime(inputHrs, inputMins, inputSecs);
  };

  // SVG Circular progress math for 200px radius 80
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timer.progressPercent / 100) * circumference;

  return (
    <div className="glass-card">
      <div className="tab-header">
        <button 
          onClick={() => setActiveTab('timer')}
          className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
        >
          Countdown Timer
        </button>
        <button 
          onClick={() => setActiveTab('stopwatch')}
          className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
        >
          Lap Stopwatch
        </button>
      </div>

      {activeTab === 'timer' ? (
        /* Countdown Timer Content */
        <div style={{ textAlign: 'center' }}>
          <div className="timer-ring-container">
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="var(--accent-cyan)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'drop-shadow(0 0 10px var(--accent-cyan))' }}
              />
            </svg>

            <div className="timer-time-text">
              {formatTimerDisplay(timer.secondsLeft)}
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: '1 min', sec: 60 },
              { label: '5 min', sec: 300 },
              { label: '15 min', sec: 900 },
              { label: '25m Pomodoro', sec: 1500 },
              { label: '45m Study', sec: 2700 }
            ].map((p, i) => (
              <button 
                key={i}
                onClick={() => timer.setPreset(p.sec)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Main Timer Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {!timer.isRunning ? (
              <button onClick={timer.start} className="btn btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
                <Play size={16} /> Start
              </button>
            ) : (
              <button onClick={timer.pause} className="btn btn-secondary" style={{ padding: '0.65rem 1.75rem' }}>
                <Pause size={16} /> Pause
              </button>
            )}

            <button onClick={timer.reset} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Custom Time Form */}
          <form onSubmit={handleCustomTimerSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Set:</span>
            <input type="number" min="0" max="23" value={inputHrs} onChange={e => setInputHrs(e.target.value)} style={{ width: '45px', padding: '0.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff' }} placeholder="H" />h
            <input type="number" min="0" max="59" value={inputMins} onChange={e => setInputMins(e.target.value)} style={{ width: '45px', padding: '0.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff' }} placeholder="M" />m
            <input type="number" min="0" max="59" value={inputSecs} onChange={e => setInputSecs(e.target.value)} style={{ width: '45px', padding: '0.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff' }} placeholder="S" />s
            <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }}>Apply</button>
          </form>
        </div>
      ) : (
        /* Precision Lap Stopwatch Content */
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 900, color: 'var(--text-main)', textShadow: '0 0 25px var(--glow-color)', margin: '1rem 0' }}>
            {formatMsTime(stopwatch.elapsedTime)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {!stopwatch.isRunning ? (
              <button onClick={stopwatch.start} className="btn btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
                <Play size={16} /> Start
              </button>
            ) : (
              <button onClick={stopwatch.pause} className="btn btn-secondary" style={{ padding: '0.65rem 1.75rem' }}>
                <Pause size={16} /> Pause
              </button>
            )}

            <button onClick={stopwatch.addLap} disabled={!stopwatch.isRunning} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <Flag size={16} /> Lap
            </button>

            <button onClick={stopwatch.reset} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Lap History List */}
          {stopwatch.laps.length > 0 && (
            <div style={{ maxHeight: '180px', overflowY: 'auto', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr', padding: '0.3rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span>LAP</span>
                <span>SPLIT</span>
                <span style={{ textAlign: 'right' }}>TOTAL</span>
              </div>
              {stopwatch.laps.map(lap => {
                const isFastest = lap.splitTime === stopwatch.minSplit && stopwatch.laps.length > 1;
                const isSlowest = lap.splitTime === stopwatch.maxSplit && stopwatch.laps.length > 1;

                return (
                  <div 
                    key={lap.id} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '50px 1fr 1fr', 
                      padding: '0.4rem 0.5rem', 
                      fontSize: '0.85rem', 
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: isFastest ? 'var(--accent-green)' : isSlowest ? 'var(--accent-pink)' : 'var(--text-main)',
                      fontWeight: isFastest || isSlowest ? 700 : 400
                    }}
                  >
                    <span>#{lap.id}</span>
                    <span>
                      {formatMsTime(lap.splitTime)} {isFastest ? '🏎️ Best' : isSlowest ? '🐢 Slow' : ''}
                    </span>
                    <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {formatMsTime(lap.totalTime)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
