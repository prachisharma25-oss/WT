import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/soundSynth';

export function AnalogClock({ date, themeStyle = 'cyber' }) {
  const canvasRef = useRef(null);
  const [faceStyle, setFaceStyle] = useState('cyber'); // 'cyber', 'luxury', 'swiss', 'vintage'
  const [motionMode, setMotionMode] = useState('sweep'); // 'sweep' or 'tick'
  const [audioTick, setAudioTick] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const width = 280;
    const height = 280;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 15;

    // Time calculations
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const millis = date.getMilliseconds();

    const secAngle = motionMode === 'sweep'
      ? ((seconds + millis / 1000) / 60) * Math.PI * 2
      : (seconds / 60) * Math.PI * 2;
    
    const minAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
    const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2;

    ctx.clearRect(0, 0, width, height);

    // Get Accent Color computed from CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const cyanColor = computedStyle.getPropertyValue('--accent-cyan').trim() || '#00f0ff';
    const pinkColor = computedStyle.getPropertyValue('--accent-pink').trim() || '#ff007f';
    const faceBg = computedStyle.getPropertyValue('--clock-face-bg').trim() || 'rgba(12, 16, 29, 0.85)';

    // 1. Clock Face Outer Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = faceBg;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = cyanColor;
    ctx.shadowColor = cyanColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset glow

    // Inner Ring detail
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    // 2. Hour Markers & Numbers
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const innerR = radius - 16;
      const outerR = radius - 8;

      const x1 = centerX + Math.cos(angle) * innerR;
      const y1 = centerY + Math.sin(angle) * innerR;
      const x2 = centerX + Math.cos(angle) * outerR;
      const y2 = centerY + Math.sin(angle) * outerR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = i % 3 === 0 ? 3 : 1;
      ctx.strokeStyle = i % 3 === 0 ? cyanColor : 'rgba(255,255,255,0.4)';
      ctx.stroke();

      // Numerals if luxury or swiss style
      if (faceStyle === 'luxury' || faceStyle === 'swiss') {
        const textR = radius - 28;
        const tx = centerX + Math.cos(angle) * textR;
        const ty = centerY + Math.sin(angle) * textR;
        const num = i === 0 ? 12 : i;

        ctx.font = '600 12px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), tx, ty);
      }
    }

    // 3. Hour Hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(hourAngle);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -radius * 0.52);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // 4. Minute Hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(minAngle);
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -radius * 0.75);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = cyanColor;
    ctx.shadowColor = cyanColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // 5. Second Hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(secAngle);
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -radius * 0.85);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = pinkColor;
    ctx.shadowColor = pinkColor;
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Second hand counter-balance circle
    ctx.beginPath();
    ctx.arc(0, 12, 4, 0, Math.PI * 2);
    ctx.fillStyle = pinkColor;
    ctx.fill();
    ctx.restore();

    // 6. Center Pin Cap
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = cyanColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

  }, [date, faceStyle, motionMode]);

  // Handle optional audio ticking
  useEffect(() => {
    if (audioTick) {
      soundEngine.playTick();
    }
  }, [date.getSeconds(), audioTick]);

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title">
          <Sparkles size={18} /> Analog Chronometer
        </div>
        <div className="badge badge-cyan">{motionMode.toUpperCase()}</div>
      </div>

      <div className="analog-clock-wrapper">
        <div className="analog-canvas-container">
          <canvas ref={canvasRef} style={{ width: '280px', height: '280px' }} />
        </div>

        <div className="clock-controls-bar">
          <button 
            onClick={() => setMotionMode(prev => prev === 'sweep' ? 'tick' : 'sweep')}
            className="btn btn-secondary btn-sm"
            title="Toggle Smooth Sweep vs Crisp Ticking Motion"
          >
            <RefreshCw size={12} /> {motionMode === 'sweep' ? 'Sweep Motion' : 'Tick Motion'}
          </button>

          <button 
            onClick={() => setFaceStyle(prev => prev === 'cyber' ? 'swiss' : 'cyber')}
            className="btn btn-secondary btn-sm"
          >
            Style: {faceStyle.toUpperCase()}
          </button>

          <button 
            onClick={() => setAudioTick(prev => !prev)}
            className={`btn btn-sm ${audioTick ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Mechanical Ticking Audio"
          >
            {audioTick ? <Volume2 size={12} /> : <VolumeX size={12} />} Tick Audio
          </button>
        </div>
      </div>
    </div>
  );
}
