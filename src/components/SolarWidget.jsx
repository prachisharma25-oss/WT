import React from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { getSolarPositionArc, getDayProgress } from '../utils/timeUtils';

export function SolarWidget({ date }) {
  const solar = getSolarPositionArc(date);
  const dayProgress = getDayProgress(date);

  // Approximate Sunrise & Sunset
  const sunriseTime = "06:00 AM";
  const sunsetTime = "06:30 PM";

  // Calculate SVG arc path for Sun movement across 180 degrees
  // Radius 90, Center X 150, Center Y 100
  const angleRad = (solar.angleDegrees * Math.PI) / 180;
  const sunX = 150 - Math.cos(angleRad) * 110;
  const sunY = 90 - Math.sin(angleRad) * 75;

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title">
          {solar.isNight ? <Moon size={18} /> : <Sun size={18} />} Solar Cycle & Daylight Arc
        </div>
        <div className={`badge ${solar.isNight ? 'badge-pink' : 'badge-amber'}`}>
          {solar.isNight ? 'NIGHTTIME' : 'DAYLIGHT'}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="solar-arc-container">
          <svg className="solar-arc-svg" viewBox="0 0 300 100">
            {/* Horizon Line */}
            <line x1="20" y1="90" x2="280" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Arc Path */}
            <path 
              d="M 40 90 A 110 75 0 0 1 260 90" 
              fill="none" 
              stroke="rgba(255, 170, 0, 0.25)" 
              strokeWidth="3" 
            />

            {/* Glowing Sun / Moon Element along Arc */}
            <circle 
              cx={sunX} 
              cy={sunY} 
              r="10" 
              fill={solar.isNight ? 'var(--accent-cyan)' : 'var(--accent-amber)'}
              filter="drop-shadow(0 0 10px var(--accent-amber))"
            />
          </svg>
        </div>

        <div className="solar-info-grid">
          <div className="solar-info-item">
            <div className="solar-info-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Sunrise size={12} /> Sunrise
            </div>
            <div className="solar-info-value">{sunriseTime}</div>
          </div>

          <div className="solar-info-item">
            <div className="solar-info-label">Sun Elevation</div>
            <div className="solar-info-value">{solar.sunElevation.toFixed(1)}°</div>
          </div>

          <div className="solar-info-item">
            <div className="solar-info-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Sunset size={12} /> Sunset
            </div>
            <div className="solar-info-value">{sunsetTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
