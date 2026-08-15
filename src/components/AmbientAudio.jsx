import React, { useState } from 'react';
import { CloudRain, Radio, Waves, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/soundSynth';

export function AmbientAudio() {
  const [rainActive, setRainActive] = useState(false);
  const [droneActive, setDroneActive] = useState(false);

  const toggleRain = () => {
    const next = !rainActive;
    setRainActive(next);
    soundEngine.toggleRain(next, 0.5);
  };

  const toggleDrone = () => {
    const next = !droneActive;
    setDroneActive(next);
    soundEngine.toggleDrone(next, 0.5);
  };

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title">
          <Waves size={18} /> Ambient Focus Sound Generator
        </div>
        <div className="badge badge-cyan">WEB AUDIO SYNTH</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        {/* Rain Sound Button */}
        <div 
          onClick={toggleRain}
          style={{
            padding: '1rem',
            background: rainActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
            border: rainActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <CloudRain size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Soft Rain Synth</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{rainActive ? 'PLAYING' : 'OFF'}</div>
          </div>
        </div>

        {/* Binaural Space Drone Button */}
        <div 
          onClick={toggleDrone}
          style={{
            padding: '1rem',
            background: droneActive ? 'rgba(157, 0, 255, 0.15)' : 'rgba(255,255,255,0.03)',
            border: droneActive ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(157, 0, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
            <Radio size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Alpha Wave Drone</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{droneActive ? 'PLAYING' : 'OFF'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
