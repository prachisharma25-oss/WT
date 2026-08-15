import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  Trash2, 
  Pin, 
  Sliders, 
  RotateCcw, 
  Sun, 
  Moon, 
  Grid, 
  List 
} from 'lucide-react';

import { 
  POPULAR_WORLD_CITIES, 
  getTimeInTimezone, 
  getTimezoneOffsetHours, 
  formatOffsetBadge, 
  getDayNightStatus 
} from '../utils/timeUtils';

export function WorldClock({ 
  effectiveTime, 
  scrubOffsetMinutes, 
  setScrubOffsetMinutes 
}) {
  const [activeCities, setActiveCities] = useState([
    { city: 'London', zone: 'Europe/London', country: 'United Kingdom', pinned: true },
    { city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan', pinned: true },
    { city: 'New York', zone: 'America/New_York', country: 'United States', pinned: true },
    { city: 'Sydney', zone: 'Australia/Sydney', country: 'Australia', pinned: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const togglePin = (index) => {
    setActiveCities(prev => prev.map((c, i) => i === index ? { ...c, pinned: !c.pinned } : c));
  };

  const removeCity = (index) => {
    setActiveCities(prev => prev.filter((_, i) => i !== index));
  };

  const addCity = (cityObj) => {
    if (activeCities.some(c => c.zone === cityObj.zone && c.city === cityObj.city)) return;
    setActiveCities(prev => [...prev, { ...cityObj, pinned: false }]);
    setShowAddModal(false);
  };

  // Sort pinned cities first
  const sortedCities = [...activeCities].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const filteredSearch = POPULAR_WORLD_CITIES.filter(c => 
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card col-span-12">
      <div className="glass-card-header">
        <div className="glass-card-title">
          <Globe size={18} /> World Clock Matrix & Multi-Region Live Tracker
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
            className="btn btn-secondary btn-sm"
            title="Toggle Grid / List View"
          >
            {viewMode === 'grid' ? <List size={14} /> : <Grid size={14} />} {viewMode.toUpperCase()}
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} /> Add City
          </button>
        </div>
      </div>

      {/* Interactive Time Travel Scrubber Bar */}
      <div className="time-scrubber-card" style={{ padding: '1rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
            <Sliders size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Interactive Time Travel Scrubber</span>
            {scrubOffsetMinutes !== 0 && (
              <span className="badge badge-pink">
                {scrubOffsetMinutes > 0 ? `+${(scrubOffsetMinutes / 60).toFixed(1)} hrs` : `${(scrubOffsetMinutes / 60).toFixed(1)} hrs`}
              </span>
            )}
          </div>

          {scrubOffsetMinutes !== 0 && (
            <button 
              onClick={() => setScrubOffsetMinutes(0)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              <RotateCcw size={12} /> Reset to Live
            </button>
          )}
        </div>

        <input 
          type="range"
          min="-720" // -12 hrs
          max="720"  // +12 hrs
          step="15"   // 15 min increments
          value={scrubOffsetMinutes}
          onChange={(e) => setScrubOffsetMinutes(parseInt(e.target.value, 10))}
          className="time-scrubber-slider"
          title="Drag slider to simulate global time shifts"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          <span>-12 Hours</span>
          <span>Live Real-Time</span>
          <span>+12 Hours</span>
        </div>
      </div>

      {/* Cities Grid View */}
      {viewMode === 'grid' ? (
        <div className="world-clock-grid">
          {sortedCities.map((item, idx) => {
            const timeInfo = getTimeInTimezone(effectiveTime, item.zone);
            const offsetHours = getTimezoneOffsetHours(effectiveTime, item.zone);
            const dayNight = getDayNightStatus(timeInfo.hour24);

            return (
              <div key={idx} className="world-clock-card" style={{ borderColor: item.pinned ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="world-clock-city">{item.city}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.country}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button 
                      onClick={() => togglePin(idx)}
                      style={{ background: 'transparent', border: 'none', color: item.pinned ? 'var(--accent-cyan)' : 'var(--text-dim)', cursor: 'pointer' }}
                      title={item.pinned ? "Unpin Clock" : "Pin Clock to Top"}
                    >
                      <Pin size={14} />
                    </button>
                    <button 
                      onClick={() => removeCity(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                      title="Remove City"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="world-clock-time">
                  {timeInfo.time12String}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span className={`badge ${offsetHours >= 0 ? 'badge-cyan' : 'badge-amber'}`}>
                    {formatOffsetBadge(offsetHours)}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                    {dayNight.isDay ? <Sun size={12} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={12} style={{ color: 'var(--accent-cyan)' }} />}
                    {dayNight.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sortedCities.map((item, idx) => {
            const timeInfo = getTimeInTimezone(effectiveTime, item.zone);
            const offsetHours = getTimezoneOffsetHours(effectiveTime, item.zone);

            return (
              <div key={idx} className="alarm-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => togglePin(idx)} style={{ background: 'transparent', border: 'none', color: item.pinned ? 'var(--accent-cyan)' : 'var(--text-dim)', cursor: 'pointer' }}>
                    <Pin size={16} />
                  </button>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.city}, {item.country}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.zone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className="badge badge-cyan">{formatOffsetBadge(offsetHours)}</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
                    {timeInfo.time12String}
                  </div>
                  <button onClick={() => removeCity(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add City Modal Overlay */}
      {showAddModal && (
        <div className="alarm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="glass-card-header">
              <div className="glass-card-title"><Globe size={18} /> Add World Timezone</div>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Close</button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredSearch.map((cityObj, i) => (
                <div 
                  key={i} 
                  onClick={() => addCity(cityObj)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{cityObj.city}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cityObj.country} ({cityObj.zone})</div>
                  </div>
                  <Plus size={16} style={{ color: 'var(--accent-cyan)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
