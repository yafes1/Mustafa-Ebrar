// Web Audio API Sound Synthesizer & Music Player
// Supports procedural romantic melodies, music-box chimes, MP3 uploads & external audio URLs!

import { MusicConfig, MusicType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgOscillators: OscillatorNode[] = [];
  private bgGain: GainNode | null = null;
  private musicBoxInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private currentMusicConfig: MusicConfig = {
    type: 'sensiz-olmaz',
    title: 'Sensiz Olmaz ❤️',
    customUrl: '/assets/aistudio/videoplayback_40b8365a.mp3',
  };
  private audioElement: HTMLAudioElement | null = null;
  private volume: number = 0.5;
  private listeners: Array<() => void> = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isBgmPlaying) {
      this.stopBgm();
    }
    this.notify();
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.bgGain && this.ctx) {
      this.bgGain.gain.setValueAtTime(this.volume * 0.08, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public getCurrentMusic(): MusicConfig {
    return this.currentMusicConfig;
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // Cute pop sound on button clicks
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Boing / dodge sound when runaway button escapes
  public playBoing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Joyful triumphant romantic chord progression when "Evet / Affettim" is clicked
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.7);
    });
  }

  // Change active music type or track
  public setMusic(config: MusicConfig, autoPlay: boolean = true) {
    this.currentMusicConfig = config;
    if (this.isBgmPlaying || autoPlay) {
      this.stopBgm();
      this.startBgm();
    } else {
      this.notify();
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    if (this.isMuted) this.isMuted = false;
    this.stopBgm();
    this.isBgmPlaying = true;

    const { type, customUrl } = this.currentMusicConfig;

    if (type === 'sensiz-olmaz') {
      this.playCustomAudio('/assets/aistudio/videoplayback_40b8365a.mp3');
    } else if ((type === 'custom-url' || type === 'custom-file') && customUrl) {
      this.playCustomAudio(customUrl);
    } else if (type === 'music-box') {
      this.playMusicBoxSynthesizer();
    } else if (type === 'synth-lofi') {
      this.playLofiSynthesizer();
    } else {
      this.playPianoSynthesizer();
    }

    this.notify();
  }

  public stopBgm() {
    // Stop oscillators
    this.bgOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.bgOscillators = [];

    if (this.bgGain) {
      try {
        this.bgGain.disconnect();
      } catch {
        // ignore
      }
      this.bgGain = null;
    }

    if (this.musicBoxInterval) {
      window.clearInterval(this.musicBoxInterval);
      this.musicBoxInterval = null;
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.audioElement = null;
    }

    this.isBgmPlaying = false;
    this.notify();
  }

  private playCustomAudio(url: string) {
    try {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.volume;
      this.audioElement = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback blocked until user interaction:', err);
          // Don't kill audio element, so when user clicks later it plays
        });
      }
    } catch {
      this.playPianoSynthesizer();
    }
  }

  private playPianoSynthesizer() {
    const ctx = this.getContext();
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04 * this.volume, ctx.currentTime);
    gain.connect(ctx.destination);
    this.bgGain = gain;

    // Fmaj7 / Cmaj7 warm chord
    const freqs = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gain);
      osc.start();
      this.bgOscillators.push(osc);
    });
  }

  private playLofiSynthesizer() {
    const ctx = this.getContext();
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.035 * this.volume, ctx.currentTime);

    // Warm Low-pass filter for cozy lofi tape warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);

    filter.connect(gain);
    gain.connect(ctx.destination);
    this.bgGain = gain;

    // A minor 9 chord (A2, C3, E3, G3, B3)
    const freqs = [110.0, 130.81, 164.81, 196.0, 246.94];
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.bgOscillators.push(osc);
    });
  }

  private playMusicBoxSynthesizer() {
    const ctx = this.getContext();
    if (!ctx) return;

    // Nostalgic delicate music box bell notes sequence:
    // E5, G5, B5, A5, G5, E5, D5, E5 (Canon / romantic arpeggio)
    const melody = [659.25, 783.99, 987.77, 880.0, 783.99, 659.25, 587.33, 659.25];
    let step = 0;

    const playBell = () => {
      if (!this.isBgmPlaying) return;
      const c = this.getContext();
      if (!c) return;

      const freq = melody[step % melody.length];
      step++;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime);

      gain.gain.setValueAtTime(0.09 * this.volume, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(c.currentTime);
      osc.stop(c.currentTime + 1.2);
    };

    // Play immediately and then interval
    playBell();
    this.musicBoxInterval = window.setInterval(playBell, 900);
  }
}

export const sound = new SoundEngine();
