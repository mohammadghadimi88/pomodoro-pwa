let cycleCount = 0;
const cycleDisplay = document.getElementById('cycleCount');

let focusTime = 25 * 60;
let breakTime = 5 * 60;
let remainingTime = focusTime;
let isFocus = true;
let timerInterval = null;

const timerDisplay = document.getElementById('timer');
const dingSound = document.getElementById('dingSound');
const audio = document.getElementById('dingSound'); // برای mute/unmute
const btn = document.getElementById('mute-unmute-btn');
const icon = document.getElementById('mute-icon');

// دکمه قطع/وصل صدا
btn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
  } else {
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');
  }
});

function updateDisplay() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

if (remainingTime <= 0) {
  clearInterval(timerInterval);
  timerInterval = null;
  dingSound.play();
  if ('vibrate' in navigator) navigator.vibrate(300);

  // سوییچ بین فوکوس و استراحت
  isFocus = !isFocus;
  remainingTime = isFocus ? focusTime : breakTime;

  // 🔻 فقط وقتی چرخه کامل شد (یعنی از استراحت برگشت به فوکوس)
  if (isFocus) {
    cycleCount++;
    cycleDisplay.textContent = `Cycles: ${cycleCount}`;
  }

  startTimer();
}


function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  isFocus = true;
  remainingTime = focusTime;
  cycleCount = 0;
  cycleDisplay.textContent = `Cycles: ${cycleCount}`;
  updateDisplay();
}


document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('saveSettings').addEventListener('click', () => {
  focusTime = parseInt(document.getElementById('focusInput').value) * 60;
  breakTime = parseInt(document.getElementById('breakInput').value) * 60;
  resetTimer();
});

updateDisplay();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
