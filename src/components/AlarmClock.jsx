import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  Clock, 
  AlertCircle, 
  Check, 
  X 
} from 'lucide-react';
import { soundEngine } from '../utils/soundSynth';

export function AlarmClock({ 
  alarms, 
  activeAlarmTrigger, 
  addAlarm, 
  toggleAlarm, 
  deleteAlarm, 
  snoozeAlarm, 
  dismissAlarm 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newLabel, setNewLabel] = useState('');
  const [newSound, setNewSound] = useState('chime');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAlarm({
      time: newTime,
      label: newLabel || 'Custom Alarm',
      sound: newSound,
      repeatDays: [1, 2, 3, 4, 5]
    });
    setNewLabel('');
    setShowAddForm(false);
  };

  const previewSound = (soundType) => {
    soundEngine.playAlarmPreset(soundType);
  };

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title">
          <Bell size={18} /> Intelligent Alarm Center
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} /> New Alarm
        </button>
      </div>

      {/* Add New Alarm Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Alarm Time</label>
              <input 
                type="time" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff' }}
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Sound Preset</label>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <select 
                  value={newSound} 
                  onChange={(e) => setNewSound(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="chime">Gentle Chime</option>
                  <option value="digital">Digital Beep</option>
                  <option value="cyber">Cyber Synth</option>
                  <option value="radar">Pulse Radar</option>
                </select>

                <button 
                  type="button" 
                  onClick={() => previewSound(newSound)}
                  className="btn btn-secondary btn-icon btn-sm"
                  title="Test Sound Tone"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Label / Reminder Name</label>
            <input 
              type="text" 
              placeholder="e.g., Team Standup Meeting"
              value={newLabel} 
              onChange={(e) => setNewLabel(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Save Alarm</button>
          </div>
        </form>
      )}

      {/* Alarms List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {alarms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            No alarms set. Click "New Alarm" to create one.
          </div>
        ) : (
          alarms.map((alarm) => (
            <div key={alarm.id} className="alarm-item" style={{ opacity: alarm.enabled ? 1 : 0.5 }}>
              <div>
                <div className="alarm-time">{alarm.time}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{alarm.label}</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{alarm.sound.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={alarm.enabled} 
                    onChange={() => toggleAlarm(alarm.id)} 
                  />
                  <span className="slider"></span>
                </label>

                <button 
                  onClick={() => deleteAlarm(alarm.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                  title="Delete Alarm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Triggered Alarm Popup Dialog Modal */}
      {activeAlarmTrigger && (
        <div className="alarm-modal-backdrop">
          <div className="alarm-modal-card">
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,0,127,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Bell size={32} style={{ color: 'var(--accent-pink)' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>
              {activeAlarmTrigger.time}
            </h2>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>
              {activeAlarmTrigger.label}
            </h3>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => snoozeAlarm(5)}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <Clock size={16} /> Snooze 5 Min
              </button>

              <button 
                onClick={dismissAlarm}
                className="btn btn-danger"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 800 }}
              >
                <Check size={16} /> Dismiss Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
