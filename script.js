const memeInput = document.getElementById('memeInput');
const fileName = document.getElementById('fileName');
const scoreBtn = document.getElementById('scoreBtn');
const scoreValue = document.getElementById('scoreValue');
const scoreMood = document.getElementById('scoreMood');
const memeGallery = document.getElementById('memeGallery');
const konamiStatus = document.getElementById('konamiStatus');

const tabs = document.querySelectorAll('.tab-btn');
const screens = {
  home: document.getElementById('tab-home'),
  discover: document.getElementById('tab-discover'),
  upload: document.getElementById('tab-upload'),
  profile: document.getElementById('tab-profile')
};

let currentFile = null;
const loadedMemes = [];

function showTab(tabName) {
  Object.entries(screens).forEach(([name, el]) => {
    el.classList.toggle('hidden', name !== tabName);
  });
  tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabName));
}

tabs.forEach((btn) => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

memeInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0] ?? null;
  currentFile = file;

  if (!file) {
    fileName.textContent = 'No file selected';
    return;
  }

  if (file.type !== 'image/png') {
    fileName.textContent = 'Only PNG is allowed for MVP.';
    currentFile = null;
    memeInput.value = '';
    return;
  }

  fileName.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;

  const url = URL.createObjectURL(file);
  loadedMemes.push(url);
  renderGallery();
});

function renderGallery() {
  memeGallery.innerHTML = '';
  loadedMemes.forEach((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Loaded meme';
    img.className = 'meme-thumb';
    memeGallery.appendChild(img);
  });
}

function getFunnyMood(score) {
  if (score >= 85) return 'Certified banger 😂';
  if (score >= 60) return 'Pretty funny 😄';
  if (score >= 30) return 'Mild chuckle 🙂';
  return 'Dry meme territory 🫠';
}

scoreBtn.addEventListener('click', () => {
  if (!currentFile) {
    scoreValue.textContent = 'Score: --';
    scoreMood.textContent = 'Upload a PNG meme first.';
    return;
  }

  const seed = currentFile.name.length + currentFile.size;
  const score = seed % 101;
  scoreValue.textContent = `Score: ${score}/100`;
  scoreMood.textContent = getFunnyMood(score);
});

const konamiPattern = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];
let konamiBuffer = [];

window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  konamiBuffer.push(key);
  if (konamiBuffer.length > konamiPattern.length) konamiBuffer.shift();

  if (konamiPattern.every((k, i) => konamiBuffer[i] === k)) {
    konamiStatus.textContent = 'Konami unlocked! Meme spin mode active.';
    document.querySelectorAll('.meme-thumb').forEach((img) => img.classList.add('spin'));
  }
});
