// Web Audio API procedural sound engine - Zero external audio file dependencies
class SoundEngine {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;
  private enabled: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.initContext();
      this.startEngineHum();
    } else {
      this.stopEngineHum();
    }
  }

  // Continuous electric vehicle engine hum whose frequency scales with speed
  public startEngineHum() {
    if (!this.enabled || this.isEngineRunning) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Base idle hum (55Hz)

      // Lowpass filter to muffle harsh harmonics
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Audio engine start failed:', e);
    }
  }

  public updateEngineSpeed(speed: number) {
    if (!this.enabled || !this.engineOsc || !this.ctx || !this.isEngineRunning) return;
    // Map speed (0 to 24) to frequency (55Hz to 180Hz)
    const targetFreq = 55 + Math.min(speed, 24) * 5.2;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
  }

  public stopEngineHum() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
    }
    this.isEngineRunning = false;
  }

  // Futuristic landmark entry arpeggio chord
  public playZoneEnter() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
    });
  }

  // High-frequency futuristic cyber turbo sweep during Nitro
  public playNitroBoost() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Sector checkpoint passing dual-chime
  public playCheckpoint() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [587.33, 880]; // D5 -> A5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.25);
    });
  }

  // Grand celebratory lap finish fanfare
  public playLapComplete() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.45);
    });
  }

  // Crisp UI Click Feedback
  public playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // ==========================================
  // PROCEDURAL LO-FI CHILL RADIO SYNTHESIZER
  // Zero external MP3 downloads - warm analog electric piano chords
  // ==========================================
  private lofiTimer: any = null;
  private lofiMasterGain: GainNode | null = null;
  private lofiFilter: BiquadFilterNode | null = null;
  private isLofiRunning: boolean = false;
  private chordIndex: number = 0;

  // Warm Rhodes chord progression: Dm9 -> G13 -> Cmaj9 -> Am9
  private lofiChords = [
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
    [98.00, 174.61, 246.94, 329.63],          // G13
    [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
    [110.00, 164.81, 196.00, 246.94, 329.63], // Am9
  ];

  public startLofi() {
    if (this.isLofiRunning) return;
    this.initContext();
    if (!this.ctx) return;

    this.isLofiRunning = true;
    this.chordIndex = 0;

    // Master bus with vintage lowpass filter (460Hz) and gentle warmth
    this.lofiFilter = this.ctx.createBiquadFilter();
    this.lofiFilter.type = 'lowpass';
    this.lofiFilter.frequency.setValueAtTime(460, this.ctx.currentTime);
    this.lofiFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.lofiMasterGain = this.ctx.createGain();
    this.lofiMasterGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    this.lofiFilter.connect(this.lofiMasterGain);
    this.lofiMasterGain.connect(this.ctx.destination);

    // Play first chord immediately
    this.playNextLofiChord();

    // Loop chords every 3.2s
    this.lofiTimer = setInterval(() => {
      if (this.isLofiRunning) {
        this.playNextLofiChord();
      }
    }, 3200);
  }

  private playNextLofiChord() {
    if (!this.ctx || !this.isLofiRunning || !this.lofiFilter) return;

    const chord = this.lofiChords[this.chordIndex % this.lofiChords.length];
    this.chordIndex++;

    const now = this.ctx.currentTime;

    // Subtle tape wow & flutter LFO for vintage warmth
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(1.6, now); // 1.6 Hz slow tape wobble
    lfoGain.gain.setValueAtTime(1.8, now);  // slight pitch deviation
    lfo.connect(lfoGain);

    chord.forEach((freq, noteIdx) => {
      if (!this.ctx || !this.lofiFilter) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator(); // detuned sub for stereo width
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc2.type = 'sine';

      // Slight humanized timing stagger
      const noteStart = now + noteIdx * 0.035;

      osc.frequency.setValueAtTime(freq, noteStart);
      osc2.frequency.setValueAtTime(freq * 1.002, noteStart); // warm detune

      lfoGain.connect(osc.frequency);
      lfoGain.connect(osc2.frequency);

      // Warm vintage Rhodes envelope: fast soft attack, smooth long sustain and tail
      noteGain.gain.setValueAtTime(0.0001, noteStart);
      noteGain.gain.exponentialRampToValueAtTime(0.05, noteStart + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.02, noteStart + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 3.1);

      osc.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.lofiFilter);

      osc.start(noteStart);
      osc2.start(noteStart);
      osc.stop(noteStart + 3.1);
      osc2.stop(noteStart + 3.1);
    });

    lfo.start(now);
    lfo.stop(now + 3.2);
  }

  public stopLofi() {
    this.isLofiRunning = false;
    if (this.lofiTimer) {
      clearInterval(this.lofiTimer);
      this.lofiTimer = null;
    }
    if (this.lofiMasterGain && this.ctx) {
      try {
        this.lofiMasterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      } catch (e) {}
    }
  }

  public toggleLofi(): boolean {
    if (this.isLofiRunning) {
      this.stopLofi();
      return false;
    } else {
      this.startLofi();
      return true;
    }
  }

  public isLofiActive(): boolean {
    return this.isLofiRunning;
  }
}

export const sound = new SoundEngine();
