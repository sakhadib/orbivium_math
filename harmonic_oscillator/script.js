// Select DOM elements
const canvas = document.getElementById("oscillatorCanvas");
const ctx = canvas.getContext("2d");
const massSlider = document.getElementById("massSlider");
const springSlider = document.getElementById("springSlider");
const dampingSlider = document.getElementById("dampingSlider");
const frequencySlider = document.getElementById("frequencySlider");
const amplitudeSlider = document.getElementById("amplitudeSlider");
const playPauseButton = document.getElementById("playPauseButton");
const soundToggleButton = document.getElementById("soundToggleButton");
const resetButton = document.getElementById("resetButton");

const massValue = document.getElementById("massValue");
const springValue = document.getElementById("springValue");
const dampingValue = document.getElementById("dampingValue");
const frequencyValue = document.getElementById("frequencyValue");
const amplitudeValue = document.getElementById("amplitudeValue");

// Oscillator state
let isPlaying = false;
let soundEnabled = true;
let time = 0;
let animationFrame;

// Parameters
let mass = parseFloat(massSlider.value);
let springConstant = parseFloat(springSlider.value);
let damping = parseFloat(dampingSlider.value);
let frequency = parseFloat(frequencySlider.value);
let amplitude = parseFloat(amplitudeSlider.value);

// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorNode = null;
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
gainNode.gain.value = 0.5; // Set default volume

// Update labels
function updateLabels() {
  massValue.textContent = `Mass: ${mass} kg`;
  springValue.textContent = `Spring Constant: ${springConstant} N/m`;
  dampingValue.textContent = `Damping: ${damping}`;
  frequencyValue.textContent = `Frequency: ${frequency} Hz`;
  amplitudeValue.textContent = `Amplitude: ${amplitude} px`;
}

// Draw the oscillator
function drawOscillator(position) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw spring
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 50);
  ctx.lineTo(canvas.width / 2, position);
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw mass
  ctx.beginPath();
  ctx.arc(canvas.width / 2, position, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#6c757d";
  ctx.fill();
}

// Calculate position
function calculatePosition() {
  const omega = 2 * Math.PI * frequency; // Angular frequency
  const dampingFactor = Math.exp(-damping * time); // Damping term
  const oscillation = amplitude * Math.cos(omega * time); // Harmonic motion
  return canvas.height / 2 + dampingFactor * oscillation;
}

// Start audio oscillator
function startSound() {
  if (!soundEnabled || oscillatorNode) return; // Prevent multiple oscillators if sound is disabled

  oscillatorNode = audioContext.createOscillator();
  oscillatorNode.type = "sine"; // Simple sine wave
  oscillatorNode.frequency.setValueAtTime(frequency * 100, audioContext.currentTime); // Frequency scaled
  oscillatorNode.connect(gainNode);
  oscillatorNode.start();
}

// Stop audio oscillator
function stopSound() {
  if (oscillatorNode) {
    oscillatorNode.stop();
    oscillatorNode.disconnect();
    oscillatorNode = null;
  }
}

// Animation loop
function animate() {
  if (!isPlaying) return;

  const position = calculatePosition();
  drawOscillator(position);

  if (oscillatorNode) {
    oscillatorNode.frequency.setValueAtTime(frequency * 100, audioContext.currentTime); // Update frequency dynamically
  }

  time += 0.016; // Increment time (assuming ~60 FPS)

  animationFrame = requestAnimationFrame(animate);
}

// Start animation
function play() {
  if (!isPlaying) {
    isPlaying = true;
    playPauseButton.innerHTML = "<i class='uil uil-pause'></i> Pause";
    if (soundEnabled) startSound();
    animate();
  }
}

// Stop animation
function pause() {
  if (isPlaying) {
    isPlaying = false;
    playPauseButton.innerHTML = "<i class='uil uil-play'></i> Play";
    stopSound();
    cancelAnimationFrame(animationFrame);
  }
}

// Toggle sound
soundToggleButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggleButton.innerHTML = soundEnabled ? "<i class='uil uil-volume'></i> ON" : "<i class='uil uil-volume'></i> OFF";
  if (!soundEnabled) stopSound();
});

// Reset everything
resetButton.addEventListener("click", () => {
  pause();
  time = 0;
  massSlider.value = 5;
  springSlider.value = 50;
  dampingSlider.value = 0.1;
  frequencySlider.value = 1;
  amplitudeSlider.value = 100;
  mass = 5;
  springConstant = 50;
  damping = 0.1;
  frequency = 1;
  amplitude = 100;
  updateLabels();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Event listeners
playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

massSlider.addEventListener("input", (e) => {
  mass = parseFloat(e.target.value);
  updateLabels();
});

springSlider.addEventListener("input", (e) => {
  springConstant = parseFloat(e.target.value);
  frequency = Math.sqrt(springConstant / mass) / (2 * Math.PI); // Update frequency based on spring constant and mass
  frequencySlider.value = frequency.toFixed(1);
  updateLabels();
});

dampingSlider.addEventListener("input", (e) => {
  damping = parseFloat(e.target.value);
  updateLabels();
});

frequencySlider.addEventListener("input", (e) => {
  frequency = parseFloat(e.target.value);
  if (oscillatorNode) {
    oscillatorNode.frequency.setValueAtTime(frequency * 100, audioContext.currentTime);
  }
  updateLabels();
});

amplitudeSlider.addEventListener("input", (e) => {
  amplitude = parseFloat(e.target.value);
  updateLabels();
});

// Initialize labels
updateLabels();
