/**
 * ============================================
 * SOUND EFFECT SYSTEM
 * Using Web Audio API for game sounds
 * ============================================
 */

class SoundSystem {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;

    // Sound frequencies for different card types
    this.sounds = {
      attack: { freq: 150, duration: 0.15, type: "square" },
      defense: { freq: 400, duration: 0.2, type: "sine" },
      skill: { freq: 600, duration: 0.25, type: "triangle" },
      power: { freq: 300, duration: 0.3, type: "sawtooth" },
      buff: { freq: 350, duration: 0.25, type: "triangle", rise: true },
      heal: { freq: 500, duration: 0.3, type: "sine", rise: true },
      critical: { freq: 200, duration: 0.4, type: "square", sweep: true },
      damage: { freq: 100, duration: 0.2, type: "square" },
      victory: { freq: 523, duration: 0.5, type: "sine", melody: true },
      defeat: { freq: 100, duration: 0.5, type: "sawtooth", fall: true },
      click: { freq: 800, duration: 0.05, type: "sine" },
      powerup: { freq: 400, duration: 0.35, type: "triangle", rise: true },
    };
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
  }

  play(soundName) {
    if (!this.enabled) return;

    try {
      this.init();

      const sound = this.sounds[soundName];
      if (!sound) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(
        sound.freq,
        this.audioContext.currentTime,
      );

      // Envelope
      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + sound.duration,
      );

      // Special effects
      if (sound.rise) {
        oscillator.frequency.linearRampToValueAtTime(
          sound.freq * 1.5,
          this.audioContext.currentTime + sound.duration,
        );
      }
      if (sound.fall) {
        oscillator.frequency.linearRampToValueAtTime(
          sound.freq * 0.5,
          this.audioContext.currentTime + sound.duration,
        );
      }
      if (sound.sweep) {
        oscillator.frequency.linearRampToValueAtTime(
          sound.freq * 2,
          this.audioContext.currentTime + sound.duration / 2,
        );
        oscillator.frequency.linearRampToValueAtTime(
          sound.freq,
          this.audioContext.currentTime + sound.duration,
        );
      }
      if (sound.melody) {
        // Simple victory jingle
        setTimeout(() => this.playNote(659, 0.15), 100);
        setTimeout(() => this.playNote(784, 0.2), 250);
      }

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (e) {
      console.log("Sound error:", e);
    }
  }

  playNote(freq, duration) {
    if (!this.enabled) return;

    try {
      this.init();

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(
        this.volume * 0.5,
        this.audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration,
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.log("Note error:", e);
    }
  }

  playCardSound(cardType) {
    const typeMap = {
      [Card.TYPES.ATTACK]: "attack",
      [Card.TYPES.DEFENSE]: "defense",
      [Card.TYPES.BLOCK]: "defense",
      [Card.TYPES.SKILL]: "skill",
      [Card.TYPES.POWER]: "power",
      [Card.TYPES.BUFF]: "buff",
      [Card.TYPES.HEAL]: "heal",
      [Card.TYPES.KILL]: "critical",
    };
    this.play(typeMap[cardType] || "click");
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
}

// Global instance
const soundSystem = new SoundSystem();
