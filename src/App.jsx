import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/components.css';

import { Header } from './components/Header';
import { AnalogClock } from './components/AnalogClock';
import { DigitalClock } from './components/DigitalClock';
import { SolarWidget } from './components/SolarWidget';
import { WorldClock } from './components/WorldClock';
import { AlarmClock } from './components/AlarmClock';
import { StopwatchTimer } from './components/StopwatchTimer';
import { AmbientAudio } from './components/AmbientAudio';
import { FullscreenAmbient } from './components/FullscreenAmbient';
import { CustomizerModal } from './components/CustomizerModal';

import { useClock } from './hooks/useClock';
import { useAlarms } from './hooks/useAlarms';
import { soundEngine } from './utils/soundSynth';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('chronopulse_theme') || 'cyber');
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [scrubOffsetMinutes, setScrubOffsetMinutes] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const [widgetVisibility, setWidgetVisibility] = useState({
    analog: true,
    digital: true,
    solar: true,
    world: true,
    alarm: true,
    stopwatch: true,
    ambient: true
  });

  // Clock Hook
  const { realTime, effectiveTime } = useClock({
    scrubOffsetMinutes
  });

  // Alarms Hook
  const alarmState = useAlarms(realTime);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chronopulse_theme', theme);
  }, [theme]);

  // Sync Master Volume
  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="app-container">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-bg-glow">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      {/* Top Navbar Header */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onToggleFullscreen={() => setIsFullscreen(true)}
      />

      {/* Dashboard Main Grid */}
      <main className="dashboard-content">
        <div className="dashboard-grid">
          {/* Top Row: Digital Master Clock (5 cols) & Analog Clock (4 cols) & Solar Arc (3 cols) */}
          {widgetVisibility.digital && (
            <div className="col-span-5">
              <DigitalClock date={effectiveTime} />
            </div>
          )}

          {widgetVisibility.analog && (
            <div className="col-span-4">
              <AnalogClock date={effectiveTime} themeStyle={theme} />
            </div>
          )}

          {widgetVisibility.solar && (
            <div className="col-span-3">
              <SolarWidget date={effectiveTime} />
            </div>
          )}

          {/* World Clock Matrix & Time Scrubber (Full 12 cols) */}
          {widgetVisibility.world && (
            <WorldClock 
              effectiveTime={effectiveTime}
              scrubOffsetMinutes={scrubOffsetMinutes}
              setScrubOffsetMinutes={setScrubOffsetMinutes}
            />
          )}

          {/* Bottom Row: Alarm Center (4 cols) & Stopwatch/Timer (5 cols) & Ambient Focus Audio (3 cols) */}
          {widgetVisibility.alarm && (
            <div className="col-span-4">
              <AlarmClock 
                alarms={alarmState.alarms}
                activeAlarmTrigger={alarmState.activeAlarmTrigger}
                addAlarm={alarmState.addAlarm}
                toggleAlarm={alarmState.toggleAlarm}
                deleteAlarm={alarmState.deleteAlarm}
                snoozeAlarm={alarmState.snoozeAlarm}
                dismissAlarm={alarmState.dismissAlarm}
              />
            </div>
          )}

          {widgetVisibility.stopwatch && (
            <div className="col-span-5">
              <StopwatchTimer />
            </div>
          )}

          {widgetVisibility.ambient && (
            <div className="col-span-3">
              <AmbientAudio />
            </div>
          )}
        </div>
      </main>

      {/* Fullscreen Nightstand Mode */}
      {isFullscreen && (
        <FullscreenAmbient 
          date={effectiveTime} 
          onClose={() => setIsFullscreen(false)} 
        />
      )}

      {/* Layout & Theme Customizer Modal */}
      <CustomizerModal 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgetVisibility={widgetVisibility}
        setWidgetVisibility={setWidgetVisibility}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
