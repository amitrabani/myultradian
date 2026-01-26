// Audio service for playing notification sounds

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a simple chime sound using Web Audio API
 */
export function playChime(volume = 0.5): void {
  try {
    const ctx = getAudioContext();

    // Resume context if suspended (required for user gesture)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (error) {
    console.error('Audio playback error:', error);
  }
}

/**
 * Play a completion sound (two chimes)
 */
export function playCompletionSound(volume = 0.5): void {
  playChime(volume);
  setTimeout(() => playChime(volume), 200);
}

/**
 * Play a gentle notification sound for stage transitions
 */
export function playStageTransition(volume = 0.4): void {
  try {
    const ctx = getAudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.error('Audio playback error:', error);
  }
}

/**
 * Initialize audio context (call on user interaction)
 */
export function initializeAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.error('Audio initialization error:', error);
  }
}
