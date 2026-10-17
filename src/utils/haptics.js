/**
 * Native Haptics and Micro-Acoustic Feedback Utility
 * Delivers native-feeling tactile feedback on mobile devices and modern browsers.
 */

// Global AudioContext singleton (lazily initialized on first user interaction)
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Triggers physical vibration on supported mobile devices
 * @param {'light' | 'medium' | 'success' | 'warning'} type 
 */
export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12); // Crisp 12ms micro-tap
        break;
      case 'medium':
        navigator.vibrate(24);
        break;
      case 'success':
        navigator.vibrate([15, 30, 20]); // Double gentle bump
        break;
      case 'warning':
        navigator.vibrate([30, 40, 30]);
        break;
      default:
        navigator.vibrate(12);
    }
  } catch (e) {
    // Silently continue if blocked by browser policy
  }
}

/**
 * Plays a clean, synthetic, low-volume micro-click (iOS/Android native feel)
 * @param {number} frequency 
 * @param {number} duration 
 */
export function playMicroClick(frequency = 520, duration = 0.03) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);

    // Ultra-soft volume to avoid being intrusive
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
}

/**
 * Combined tactile tap: triggers both micro-vibration and subtle audio tick
 */
export function tactileTap(type = 'light') {
  triggerHaptic(type);
  playMicroClick(type === 'medium' ? 620 : 500, 0.025);
}

export function toggleSoundFeedback() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}
