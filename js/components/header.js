import { getCartCount, getCurrentUser, logoutUser, getSavedExercises, getSavedMeals } from '../utils/storage.js';

function currentPage() { return window.location.pathname.split('/').pop() || 'index.html'; }
function active(page) { return currentPage() === page ? 'active' : ''; }

const audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
let bgAudio = null;

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', saved === 'dark');
  return saved;
}

function setTheme(mode) {
  document.body.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('theme', mode);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = mode === 'dark' ? 'Light' : 'Dark';
}

function initAudioState() {
  const setting = localStorage.getItem('audioOn') === 'true';
  bgAudio = new Audio(audioSrc);
  bgAudio.loop = true;
  const btn = document.getElementById('audioToggle');
  if (!btn) return setting;
  btn.textContent = setting ? 'Audio: On' : 'Audio: Off';
  return setting;
}

function setAudio(enabled) {
  localStorage.setItem('audioOn', enabled);
  const btn = document.getElementById('audioToggle');
  if (btn) btn.textContent = enabled ? 'Audio: On' : 'Audio: Off';
  if (enabled) {
    bgAudio?.play().catch(() => {
      console.warn('Autoplay blocked, user interaction required.');
    });
  } else {
    bgAudio?.pause();
  }
}

function initChatWidget() {
  if (document.getElementById('chatWidget')) return;
  const widget = document.createElement('div');
  widget.id = 'chatWidget';
  widget.innerHTML = `
    <div id="chatWidgetHeader">
      <h4>Support Chat</h4>
      <button id="closeChatBtn">✕</button>
    </div>
    <div id="chatMessages"></div>
    <div id="chatInputGroup">
      <input id="chatInput" placeholder="Nhập câu hỏi..." />
      <button id="chatSendBtn">Gửi</button>
    </div>
  `;
  document.body.appendChild(widget);

  const chatMessages = widget.querySelector('#chatMessages');
  const chatInput = widget.querySelector('#chatInput');
  const chatSendBtn = widget.querySelector('#chatSendBtn');
  const closeChatBtn = widget.querySelector('#closeChatBtn');

  function appendMsg(message, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    msg.textContent = message;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  closeChatBtn.addEventListener('click', () => widget.classList.remove('active'));
  chatSendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMsg(text, true);
    chatInput.value = '';
    setTimeout(() => appendMsg('Tôi đang xử lý yêu cầu của bạn. Vui lòng đợi...'), 300);
    setTimeout(() => appendMsg('Xin chào! Tôi là trợ lý ảo Calorie Burner, bạn muốn hỏi gì hôm nay?'), 1200);
  });
}

export function renderHeader() {
  const host = document.getElementById('siteHeader');
  if (!host) return;
  const user = getCurrentUser();
  const savedCount = getSavedExercises().length + getSavedMeals().length;

  host.innerHTML = `
    <div class="site-header">
      <div class="container navbar">
        <a href="./index.html" class="logo"><span class="logo-mark"></span>Calorie Burner</a>
        <nav class="nav-links">
          <a class="nav-link ${active('index.html')}" href="./index.html">Home</a>
          <a class="nav-link ${active('exercises.html')}" href="./exercises.html">Workouts</a>
          <a class="nav-link ${active('routine.html')}" href="./routine.html">Schedule</a>
          <a class="nav-link ${active('meals.html')}" href="./meals.html">Meals</a>
          <a class="nav-link nav-badge ${active('saved.html')}" href="./saved.html">Saved<span id="savedBadge" class="badge">${savedCount}</span></a>
          <a class="nav-link nav-badge ${active('cart.html')}" href="./cart.html">Plan<span id="cartBadge" class="badge">${getCartCount()}</span></a>
        </nav>
        <div class="nav-actions">
          <button id="themeToggle" class="theme-toggle">${initTheme() === 'dark' ? 'Light' : 'Dark'}</button>
          <button id="audioToggle" class="audio-toggle">Audio</button>
          <button id="chatToggle" class="chat-toggle">Chat</button>
          ${user ? `<span class="user-chip">${user.name}</span><button id="logoutBtn" class="btn btn-secondary">Log Out</button>` : `<a class="btn btn-secondary" href="./login.html">Log In</a><a class="btn btn-primary" href="./register.html">Sign Up</a>`}
        </div>
      </div>
    </div>`;

  document.getElementById('logoutBtn')?.addEventListener('click', () => { logoutUser(); window.location.href = './login.html'; });
  initChatWidget();
  const installedAudio = initAudioState();
  setAudio(installedAudio);

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(next);
  });

  document.getElementById('audioToggle')?.addEventListener('click', () => {
    const enabled = localStorage.getItem('audioOn') !== 'true';
    setAudio(enabled);
  });

  document.getElementById('chatToggle')?.addEventListener('click', () => {
    const widget = document.getElementById('chatWidget');
    if (widget) widget.classList.toggle('active');
  });
}

export function refreshHeaderBadges() {
  const cartBadge = document.getElementById('cartBadge');
  const savedBadge = document.getElementById('savedBadge');
  if (cartBadge) cartBadge.textContent = getCartCount();
  if (savedBadge) savedBadge.textContent = getSavedExercises().length + getSavedMeals().length;
}
