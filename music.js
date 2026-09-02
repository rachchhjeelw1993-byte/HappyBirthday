// Adds a "Play/Stop music" toggle that plays the "Happy Birthday" melody using Web Audio.
// Requires a user gesture (click) to start audio (browser autoplay policies).

const notes = [
  [392, 0.3], [392, 0.3], [440, 0.6], [392, 0.6], [523.25, 0.6], [493.88, 1.0],
  [392, 0.3], [392, 0.3], [440, 0.6], [392, 0.6], [587.33, 0.6], [523.25, 1.0],
  [392, 0.3], [392, 0.3], [783.99, 0.6], [659.25, 0.6], [523.25, 0.6], [493.88, 0.6], [440, 1.0],
  [698.46, 0.3], [698.46, 0.3], [659.25, 0.6], [523.25, 0.6], [587.33, 0.6], [523.25, 1.0]
];

let audioContext = null;
let melodyOscillators = [];
let cleanupTimeout = null;
let isPlaying = false;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playBirthdayMelody() {
  if (isPlaying) return;
  const ctx = ensureAudioContext();
  if (ctx.state === 'suspended') {
    // Some browsers require resume on user gesture; caller should ensure this.
    ctx.resume();
  }

  const startTime = ctx.currentTime + 0.05; // small delay
  let t = startTime;

  // Create and schedule oscillators for each note
  notes.forEach(([freq, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // simple ADSR-ish envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.01);
    gain.gain.setValueAtTime(0.22, t + dur - 0.05);
    gain.gain.linearRampToValueAtTime(0, t + dur);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);

    // Keep track for early stop
    melodyOscillators.push(osc);

    t += dur;
  });

  const totalDuration = notes.reduce((s, n) => s + n[1], 0);
  // Cleanup after melody finishes
  cleanupTimeout = setTimeout(() => {
    melodyOscillators = [];
    cleanupTimeout = null;
    isPlaying = false;
    // Dispatch event to update UI (optional)
    document.dispatchEvent(new CustomEvent('birthday-melody-ended'));
  }, (totalDuration + 0.2) * 1000);

  isPlaying = true;
  document.dispatchEvent(new CustomEvent('birthday-melody-started'));
}

function stopBirthdayMelody() {
  if (!isPlaying && melodyOscillators.length === 0) return;
  if (cleanupTimeout) {
    clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }
  melodyOscillators.forEach(osc => {
    try { osc.stop(); } catch (e) { /* already stopped */ }
  });
  melodyOscillators = [];
  isPlaying = false;
  document.dispatchEvent(new CustomEvent('birthday-melody-stopped'));
}

function toggleBirthdayMelody() {
  // Toggle: play if not playing, stop if playing
  if (isPlaying) {
    stopBirthdayMelody();
    return false;
  } else {
    // Ensure audio context resumed on user gesture
    const ctx = ensureAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playBirthdayMelody());
    } else {
      playBirthdayMelody();
    }
    return true;
  }
}

// Optional convenience: attach to a button with id "musicToggle"
function attachMusicToggleButton(buttonId = 'musicToggle') {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  // Initialize text
  btn.textContent = 'Play music';
  const updateText = () => {
    btn.textContent = isPlaying ? 'Stop music' : 'Play music';
  };
  btn.addEventListener('click', (e) => {
    const nowPlaying = toggleBirthdayMelody();
    // updateText will also be triggered by events
    updateText();
  });
  // Keep button text in sync if melody ends
  document.addEventListener('birthday-melody-ended', updateText);
  document.addEventListener('birthday-melody-stopped', updateText);
  document.addEventListener('birthday-melody-started', updateText);
}

// Auto-attach on DOMContentLoaded if a button exists
document.addEventListener('DOMContentLoaded', () => attachMusicToggleButton('musicToggle'));

// Expose functions for manual use
window.playBirthdayMelody = playBirthdayMelody;
window.stopBirthdayMelody = stopBirthdayMelody;
window.toggleBirthdayMelody = toggleBirthdayMelody;
window.attachMusicToggleButton = attachMusicToggleButton;
