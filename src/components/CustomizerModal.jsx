import React from 'react';
import { Sliders, Eye, EyeOff, Check, X } from 'lucide-react';

export function CustomizerModal({
  isOpen,
  onClose,
  widgetVisibility,
  setWidgetVisibility,
  theme,
  setTheme
}) {
  if (!isOpen) return null;

  const toggleWidget = (key) => {
    setWidgetVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const widgetLabels = {
    analog: 'Analog Chronometer',
    digital: 'Digital Master Clock',
    solar: 'Solar Cycle & Arc Visualizer',
    world: 'World Clock Matrix & Scrubber',
    alarm: 'Intelligent Alarm Center',
    stopwatch: 'Stopwatch & Countdown Timer',
    ambient: 'Ambient Focus Sound Generator'
  };

  return (
    <div className="alarm-modal-backdrop" onClick={onClose}>
      <div className="glass-card" style={{ maxWidth: '550px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="glass-card-header">
          <div className="glass-card-title">
            <Sliders size={18} /> Dashboard Layout & Theme Settings
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm"><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Theme Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Visual Theme Palette</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'cyber', label: 'Cyber Neon' },
                { id: 'obsidian', label: 'Obsidian Dark' },
                { id: 'aurora', label: 'Glass Aurora' },
                { id: 'solar', label: 'Solar Gold' },
                { id: 'oled', label: 'OLED Black' },
                { id: 'light', label: 'Pearl Light' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`btn ${theme === t.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Widget Visibility */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Visible Dashboard Cards</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.keys(widgetLabels).map(key => {
                const isVisible = widgetVisibility[key];
                return (
                  <div 
                    key={key} 
                    onClick={() => toggleWidget(key)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: isVisible ? '1px solid var(--panel-border)' : '1px solid rgba(255,255,255,0.04)',
                      opacity: isVisible ? 1 : 0.5
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{widgetLabels[key]}</span>
                    {isVisible ? <Eye size={16} style={{ color: 'var(--accent-cyan)' }} /> : <EyeOff size={16} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.55rem 1.5rem' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
