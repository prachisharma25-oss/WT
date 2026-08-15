// Web Audio API Synthesizer Engine for Clocks, Alarms, Timers & Ambient Sounds

class SoundSynthEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.ambientNodes = {
      rainGain: null,
      rainSource: null,
      noiseGain: null,
      noiseSource: null,
      droneGain: null,
      droneOsc1: null,
      droneOsc2: null
    };
    this.isMuted = false;
    this.volume = 0.8;
    this.ambientVolume = 0.5;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  // Play Mechanical Clock Tick
  playTick(pitch = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.015);
  }

  // Play Alarm Sound Preset
  playAlarmPreset(soundType = 'digital') {
    this.initContext();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (soundType === 'chime') {
      // Gentle Chime Chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.2);
      });
    } else if (soundType === 'cyber') {
      // Cyber Arpeggiator
      [440, 880, 1320, 1760, 2200].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } else if (soundType === 'radar') {
      // Pulse Radar Tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Classic Digital Beep Beep
      [0, 0.15, 0.3].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1046.5, now + delay);
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + delay);
        osc.stop(now + delay + 0.08);
      });
    }
  }

  // Play Timer Complete Chime
  playTimerFinish() {
    this.initContext();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const freqs = [587.33, 739.99, 880, 1174.66]; // D Major Arpeggio
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.15);
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 1.5);
    });
  }

  // Ambient Focus Generator: Rain Sound
  toggleRain(enable, volume = 0.5) {
    this.initContext();
    const ctx = this.audioCtx;

    if (!enable) {
      if (this.ambientNodes.rainGain) {
        this.ambientNodes.rainGain.gain.setValueAtTime(0, ctx.currentTime);
        setTimeout(() => {
          if (this.ambientNodes.rainSource) {
            this.ambientNodes.rainSource.stop();
            this.ambientNodes.rainSource = null;
          }
        }, 200);
      }
      return;
    }

    if (this.ambientNodes.rainSource) return; // already playing

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish rain noise filter
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to sound like soft rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.ambientNodes.rainSource = noise;
    this.ambientNodes.rainGain = gain;
  }

  // Ambient Focus Generator: Deep Binaural Space Drone
  toggleDrone(enable, volume = 0.5) {
    this.initContext();
    const ctx = this.audioCtx;

    if (!enable) {
      if (this.ambientNodes.droneGain) {
        this.ambientNodes.droneGain.gain.setValueAtTime(0, ctx.currentTime);
        setTimeout(() => {
          if (this.ambientNodes.droneOsc1) this.ambientNodes.droneOsc1.stop();
          if (this.ambientNodes.droneOsc2) this.ambientNodes.droneOsc2.stop();
          this.ambientNodes.droneOsc1 = null;
          this.ambientNodes.droneOsc2 = null;
        }, 200);
      }
      return;
    }

    if (this.ambientNodes.droneOsc1) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(108, ctx.currentTime); // A2 base
    osc2.frequency.setValueAtTime(114, ctx.currentTime); // 6Hz binaural alpha beat

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.ambientNodes.droneOsc1 = osc1;
    this.ambientNodes.droneOsc2 = osc2;
    this.ambientNodes.droneGain = gain;
  }
}

export const soundEngine = new SoundSynthEngine();
