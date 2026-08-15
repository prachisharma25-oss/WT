import React from 'react';
import { 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sliders, 
  Radio, 
  Palette, 
  Sun, 
  Moon 
} from 'lucide-react';

export function Header({
  theme,
  setTheme,
  volume,
  setVolume,
  isMuted,
  toggleMute,
  onOpenCustomizer,
  onToggleFullscreen,
  activeAmbientCount
}) {
  return (
    <header className="app-header">
      <div className="brand-container">
        <div className="brand-logo">
          <Clock size={24} />
        </div>
        <div>
          <h1 className="brand-title">ChronoPulse</h1>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>
            REAL-TIME WORLD DASHBOARD
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Quick Theme Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Palette size={16} style={{ color: 'var(--accent-cyan)' }} />
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="cyber">Cyber Neon</option>
            <option value="obsidian">Obsidian Dark</option>
            <option value="aurora">Glass Aurora</option>
            <option value="solar">Solar Flare Gold</option>
            <option value="oled">OLED Midnight</option>
            <option value="light">Pearl Light</option>
          </select>
        </div>

        {/* Master Volume Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
          <button onClick={toggleMute} className="btn btn-icon" style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }} title={isMuted ? "Unmute Sound" : "Mute Sound"}>
            {isMuted ? <VolumeX size={16} style={{ color: 'var(--accent-pink)' }} /> : <Volume2 size={16} style={{ color: 'var(--accent-cyan)' }} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '60px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            title="Master Audio Volume"
          />
        </div>

        {/* Customizer Button */}
        <button onClick={onOpenCustomizer} className="btn btn-secondary" title="Customize Dashboard & Widgets">
          <Sliders size={16} />
          <span className="hide-mobile">Customize</span>
        </button>

        {/* Ambient Desk Fullscreen View */}
        <button onClick={onToggleFullscreen} className="btn btn-primary" title="Launch Fullscreen Ambient Desk Clock">
          <Maximize2 size={16} />
          <span className="hide-mobile">Nightstand</span>
        </button>
      </div>
    </header>
  );
}
