import { Track } from '../types';
import { generateLaughterAudio } from './geminiService';

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Nodes storage for cleanup
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private noiseNodes: AudioBufferSourceNode[] = [];
  private audioNodes: AudioNode[] = []; // Generic bucket for filters, panners etc
  private geminiSource: AudioBufferSourceNode | null = null;
  
  // Logic control
  private birdInterval: number | null = null;
  private isStopped = true;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  // Resume context if suspended
  async init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    }
  }

  stop() {
    this.isStopped = true;
    
    // Clear timers
    if (this.birdInterval) {
        clearInterval(this.birdInterval);
        this.birdInterval = null;
    }

    // Ramp down
    if (this.masterGain && this.ctx) {
       this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }

    setTimeout(() => {
        this.oscillators.forEach(osc => { try { osc.stop(); } catch(e) {} osc.disconnect(); });
        this.noiseNodes.forEach(node => { try { node.stop(); } catch(e) {} node.disconnect(); });
        this.audioNodes.forEach(node => { try { node.disconnect(); } catch(e) {} });
        
        if (this.geminiSource) {
            try { this.geminiSource.stop(); } catch(e) {}
            this.geminiSource.disconnect();
        }
        
        this.oscillators = [];
        this.gainNodes = [];
        this.noiseNodes = [];
        this.audioNodes = [];
        this.geminiSource = null;
        
        // Reset gain
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.value = 0.5;
        }
    }, 200);
  }

  async play(track: Track) {
    await this.init();
    this.stop(); 
    this.isStopped = false;

    setTimeout(async () => {
        if (this.isStopped) return;
        if (!this.ctx || !this.masterGain) return;

        switch (track.category) {
        case 'nature':
            this.playNatureRealistic(track);
            break;
        case 'vitamin':
            this.playVitaminTone(track);
            break;
        case 'relaxation':
            this.playAmbient(track);
            break;
        case 'laughter':
            this.playGeminiLaughter(track);
            break;
        }
    }, 250);
  }

  pause() {
    if (this.ctx) this.ctx.suspend();
  }

  resume() {
    if (this.ctx) this.ctx.resume();
  }

  // --- Helpers for Noise ---

  private createPinkNoise(): AudioBuffer {
    if (!this.ctx) throw new Error("No Context");
    const bufferSize = 2 * this.ctx.sampleRate; // 2 seconds loop
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate); // Stereo
    
    for (let channel = 0; channel < 2; channel++) {
        const output = buffer.getChannelData(channel);
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; // Compensation gain
            b6 = white * 0.115926;
        }
    }
    return buffer;
  }

  private createBrownNoise(): AudioBuffer {
      if (!this.ctx) throw new Error("No Context");
      const bufferSize = 4 * this.ctx.sampleRate; // 4 seconds loop for variety
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
          const output = buffer.getChannelData(channel);
          let lastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              output[i] = (lastOut + (0.02 * white)) / 1.02;
              lastOut = output[i];
              output[i] *= 3.5; 
          }
      }
      return buffer;
  }

  // --- Generators ---

  // 1. Realistic Nature Landscapes
  private playNatureRealistic(track: Track) {
      if (!this.ctx || !this.masterGain) return;

      // Map ID to function
      switch(track.id) {
          case 'nat-1': // Frequency (Pure)
            this.playPureFrequency(track.frequency || 429.62);
            break;
          case 'nat-2': // Forest (Wind + Birds)
            this.playForest();
            break;
          case 'nat-3': // Rain (Rain + Pad)
            this.playRain();
            break;
          case 'nat-4': // Ocean (Deep Waves)
            this.playOcean();
            break;
          default:
            this.playForest();
      }
  }

  private playPureFrequency(freq: number) {
      if (!this.ctx || !this.masterGain) return;
      // Main Tone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const gain = this.ctx.createGain();
      gain.gain.value = 0.4;
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);

      // Subtle Harmonic (Octave up) for richness
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;
      const gain2 = this.ctx.createGain();
      gain2.gain.value = 0.05;
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start();
      this.oscillators.push(osc2);
      this.gainNodes.push(gain2);
  }

  private playOcean() {
      if (!this.ctx || !this.masterGain) return;
      const brownNoiseBuffer = this.createBrownNoise();
      
      // Create two wave layers for stereo width and complexity
      [0.08, 0.1].forEach((rate, i) => {
          if (!this.ctx || !this.masterGain) return;
          const src = this.ctx.createBufferSource();
          src.buffer = brownNoiseBuffer;
          src.loop = true;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.Q.value = 1; 

          const gain = this.ctx.createGain();
          // Modulate volume
          const gainLFO = this.ctx.createOscillator();
          gainLFO.type = 'sine';
          gainLFO.frequency.value = rate;
          const gainAmp = this.ctx.createGain();
          gainAmp.gain.value = 0.3; // Depth
          
          // Base Gain
          gain.gain.value = 0.4;
          
          // Connect LFO to Gain
          gainLFO.connect(gainAmp);
          gainAmp.connect(gain.gain);
          
          // Modulate Filter Cutoff (The "Crashing" sound)
          const filterLFO = this.ctx.createOscillator();
          filterLFO.type = 'sine';
          filterLFO.frequency.value = rate;
          // Phase shift the filter slightly from the volume for realism
          // (Audio node scheduling is tricky for phase, we just use slightly diff freq)
          
          const filterAmp = this.ctx.createGain();
          filterAmp.gain.value = 400; // Swing 400Hz
          
          filter.frequency.value = 300; // Base cutoff
          
          filterLFO.connect(filterAmp);
          filterAmp.connect(filter.frequency);

          // Panning
          const panner = this.ctx.createStereoPanner();
          panner.pan.value = i === 0 ? -0.5 : 0.5;

          src.connect(filter);
          filter.connect(gain);
          gain.connect(panner);
          panner.connect(this.masterGain);
          
          src.start(this.ctx.currentTime + (i * 2)); // Offset start
          gainLFO.start();
          filterLFO.start();

          this.noiseNodes.push(src);
          this.audioNodes.push(filter, gain, gainLFO, gainAmp, filterLFO, filterAmp, panner);
      });
  }

  private playRain() {
      if (!this.ctx || !this.masterGain) return;
      const pinkBuffer = this.createPinkNoise();

      // 1. Rain Layer
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.value = 200; // Remove rumble

      const gain = this.ctx.createGain();
      gain.gain.value = 0.5;

      src.connect(filter);
      filter.connect(hpFilter);
      hpFilter.connect(gain);
      gain.connect(this.masterGain);
      src.start();
      
      this.noiseNodes.push(src);
      this.audioNodes.push(filter, hpFilter, gain);

      // 2. Music/Pad Layer (Relaxation)
      const frequencies = [261.63, 329.63, 392.00]; // C Major
      frequencies.forEach((f, i) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          
          const padGain = this.ctx.createGain();
          padGain.gain.value = 0.05; // Very soft
          
          const panner = this.ctx.createStereoPanner();
          panner.pan.value = (Math.random() * 2) - 1;

          osc.connect(padGain);
          padGain.connect(panner);
          panner.connect(this.masterGain);
          osc.start();
          
          this.oscillators.push(osc);
          this.gainNodes.push(padGain);
          this.audioNodes.push(panner);
      });
  }

  private playForest() {
    if (!this.ctx || !this.masterGain) return;
    
    // 1. Wind (Filtered Pink Noise, moving)
    const pinkBuffer = this.createPinkNoise();
    const src = this.ctx.createBufferSource();
    src.buffer = pinkBuffer;
    src.loop = true;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    // LFO for wind gust
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1; 
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 200;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    const gain = this.ctx.createGain();
    gain.gain.value = 0.3;
    
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start();
    lfo.start();
    
    this.noiseNodes.push(src);
    this.audioNodes.push(filter, lfo, lfoGain, gain);

    // 2. Birds (Procedural)
    const playBird = () => {
        if (!this.ctx || !this.masterGain || this.isStopped) return;
        
        const osc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();
        
        // Randomize bird
        const startFreq = 2000 + Math.random() * 2000;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        // Chirp down or up
        osc.frequency.exponentialRampToValueAtTime(startFreq * (0.8 + Math.random()*0.4), this.ctx.currentTime + 0.1);
        
        birdGain.gain.setValueAtTime(0, this.ctx.currentTime);
        birdGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.02);
        birdGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        // Panning for birds
        const panner = this.ctx.createStereoPanner();
        panner.pan.value = (Math.random() * 2) - 1;

        osc.connect(birdGain);
        birdGain.connect(panner);
        panner.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
        
        // Cleanup ephemeral nodes? 
        // JS GC handles disconnected nodes usually, but technically we could track them.
        // For this demo, let's just let them finish.
    };

    // Trigger birds randomly
    this.birdInterval = window.setInterval(() => {
        if (Math.random() > 0.4) playBird();
    }, 1500);
  }
  
  // 2. Vitamin/Healing Activation (Binaural + Tones)
  private playVitaminTone(track: Track) {
      if (!this.ctx || !this.masterGain) return;
      const baseFreq = track.frequency || 440;

      // Create a complex healing chord
      [1, 1.5, 2].forEach((ratio, idx) => {
         if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine'; // Pure for healing
          osc.frequency.value = baseFreq * ratio;
          
          const gain = this.ctx.createGain();
          gain.gain.value = 0.15 / (idx + 1);
          
          // Slight Binaural beat detune
          if (idx === 0) osc.detune.value = 4; // 4Hz difference = Theta waves

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start();
          this.oscillators.push(osc);
          this.gainNodes.push(gain);
      });
  }

  // 3. Ambient Relaxation (Drone)
  private playAmbient(track: Track) {
    if (!this.ctx || !this.masterGain) return;
    
    const count = 6;
    const baseFreq = 100 + (Math.random() * 50);
    
    for(let i=0; i<count; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = i < 3 ? 'sine' : 'triangle';
        osc.frequency.value = baseFreq * (i % 2 === 0 ? 1 : 1.5); // Fifth intervals
        if (i > 3) osc.frequency.value *= 2; // Octave
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.03;
        
        // Slow LFO for volume to make it "breathe"
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05 + (Math.random() * 0.1);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.02; // Modulate gain slightly
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        const panner = this.ctx.createStereoPanner();
        panner.pan.value = (Math.random() * 2) - 1;
        
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
        osc.start();
        
        this.oscillators.push(osc);
        this.gainNodes.push(gain);
        this.audioNodes.push(lfo, lfoGain, panner);
    }
  }

  // 4. Gemini Laughter
  private async playGeminiLaughter(track: Track) {
      if (!this.ctx || !this.masterGain) return;
      
      try {
          const buffer = await generateLaughterAudio(track.prompt || "Laugh", track.voice || "Puck", this.ctx);
          
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = true; 
          
          source.connect(this.masterGain);
          source.start();
          this.geminiSource = source;
          
      } catch (err) {
          console.error("Failed to play Gemini audio", err);
          // Fallback
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = 300;
          const g = this.ctx.createGain();
          g.gain.value = 0.1;
          osc.connect(g);
          g.connect(this.masterGain);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.3);
      }
  }
}

export const audioSynthesizer = new AudioSynthesizer();