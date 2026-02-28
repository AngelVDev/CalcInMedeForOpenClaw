const display = document.getElementById('display');
const memeFeed = document.getElementById('memeFeed');
const keys = document.getElementById('keys');
const soundEnabled = document.getElementById('soundEnabled');

const memeMap = {
  0: '0️⃣ Zero chill mode.',
  1: '1️⃣ One brain cell, max focus.',
  2: '2️⃣ Double trouble 😈',
  3: '3️⃣ Third time is the meme.',
  4: '4️⃣ Fantastic four-function energy.',
  5: '5️⃣ High five! ✋',
  6: '6️⃣ Beast mode activated 💪',
  7: '7️⃣ Lucky hit 🍀',
  8: '8️⃣ Infinite-ish vibes ♾️',
  9: '9️⃣ Cloud nine calculator.'
};

let current = '0';
let previous = null;
let operator = null;
let resetOnNextNumber = false;

function setDisplay(text) {
  display.textContent = text;
}

function updateMeme(numberPressed) {
  memeFeed.textContent = memeMap[numberPressed] ?? 'No meme found.';
}

function beep(freq = 440, duration = 80) {
  if (!soundEnabled.checked) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, duration);
}

function compute(a, b, op) {
  const left = Number(a);
  const right = Number(b);

  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? 'Error' : left / right;
    default:
      return right;
  }
}

function inputNumber(value) {
  if (resetOnNextNumber) {
    current = value;
    resetOnNextNumber = false;
  } else {
    current = current === '0' ? value : current + value;
  }

  updateMeme(Number(value));
  beep(280 + Number(value) * 50);
  setDisplay(current);
}

function inputDecimal() {
  if (resetOnNextNumber) {
    current = '0.';
    resetOnNextNumber = false;
  } else if (!current.includes('.')) {
    current += '.';
  }

  setDisplay(current);
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetOnNextNumber = false;
  memeFeed.textContent = 'Calculator reset. Meme engine standing by.';
  beep(220, 100);
  setDisplay(current);
}

function removeLast() {
  if (resetOnNextNumber) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  setDisplay(current);
}

function chooseOperator(nextOperator) {
  if (operator && !resetOnNextNumber) {
    const result = compute(previous, current, operator);
    current = String(result);
    setDisplay(current);
  }

  previous = current;
  operator = nextOperator;
  resetOnNextNumber = true;
  beep(620, 70);
}

function evaluate() {
  if (!operator || previous === null) return;
  const result = compute(previous, current, operator);
  current = String(result);
  previous = null;
  operator = null;
  resetOnNextNumber = true;

  setDisplay(current);
  memeFeed.textContent = `Result: ${current} ✅`;
  beep(780, 120);
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'number') return inputNumber(value);
  if (action === 'decimal') return inputDecimal();
  if (action === 'clear') return clearAll();
  if (action === 'backspace') return removeLast();
  if (action === 'operator') return chooseOperator(value);
  if (action === 'equals') return evaluate();
});
