let focusTime = 25 * 60;
let breakTime = 5 * 60;
let remainingTime = focusTime;
let isFocus = true;
let timerInterval = null;

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const dingSound = document.getElementById('dingSound');

function updateDisplay() {
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        remainingTime--;
        updateDisplay();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            dingSound.play();
            if ("vibrate" in navigator) navigator.vibrate(300);

            if (isFocus) {
                remainingTime = breakTime;
                isFocus = false;
                statusDisplay.textContent = "Break Time";
            } else {
                remainingTime = focusTime;
                isFocus = true;
                statusDisplay.textContent = "Focus Time";
            }
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    isFocus = true;
    remainingTime = focusTime;
    statusDisplay.textContent = "Focus Time";
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
