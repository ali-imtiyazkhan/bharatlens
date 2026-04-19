export interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export type VoicePersona = 'historic' | 'modern' | 'mystical';

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  speak(text: string, persona: VoicePersona = 'modern', onEnd?: () => void) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on persona and availability
    const selectedVoice = this.selectVoiceForPersona(persona);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Apply persona settings
    switch (persona) {
      case 'historic':
        utterance.rate = 0.85; // Slow and deliberate
        utterance.pitch = 0.9; // Deeper tone
        break;
      case 'mystical':
        utterance.rate = 0.75;
        utterance.pitch = 0.7;
        break;
      case 'modern':
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        break;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  private selectVoiceForPersona(persona: VoicePersona): SpeechSynthesisVoice | undefined {
    // English is primary for now
    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));
    
    if (persona === 'historic') {
      // Look for more "mature" or deep voices (platform dependent naming)
      return enVoices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Arthur') || v.name.includes('Daniel')) || enVoices[0];
    }
    
    if (persona === 'mystical') {
      return enVoices.find(v => v.name.includes('Samantha') || v.name.includes('Moira') || v.name.includes('Rishi')) || enVoices[0];
    }

    // Default to a clear modern voice
    return enVoices.find(v => v.name.includes('Google US English') || v.name.includes('Alex') || v.name.includes('Standard')) || enVoices[0];
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}

export const speechManager = typeof window !== 'undefined' ? new SpeechManager() : null;
