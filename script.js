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



















if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(reg => {
    // اگر SW جدید نصب شده ولی هنوز فعال نشده (waiting)
    if (reg.waiting) {
      showUpdateUI(reg);
    }

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // SW جدید نصب شد و صفحه تحت کنترل SW قدیمی است -> نمایش نوتیف
          showUpdateUI(reg);
        }
      });
    });
  });

  // وقتی SW جدید فعال شد و کنترل بهش داده شد، صفحه را ریلود می‌کنیم
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  // پیام از SW دریافت می‌کنیم (مثلاً NEW_VERSION_AVAILABLE)
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
      // دلخواه: نشان بده به کاربر که نسخهٔ جدید آمده
      showUpdateUI();
    }
  });
}

function showUpdateUI(registration) {
  // این تابع مثالیه — می‌تونی یک بنر/دکمه در صفحه بسازی
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.innerHTML = 'New version available. <button id="reload">Reload</button>';
  Object.assign(banner.style, { position: 'fixed', bottom: 10, right: 10, background: '#fff', color:'#000', padding:'10px', borderRadius:'8px' });
  document.body.appendChild(banner);
  document.getElementById('reload').addEventListener('click', () => {
    // پیام به SW برای فعال‌سازی سریع
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      location.reload();
    }
  });
}
