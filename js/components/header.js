import { getCartCount, getCurrentUser, logoutUser, getSavedExercises, getSavedMeals } from '../utils/storage.js';

function currentPage() { return window.location.pathname.split('/').pop() || 'index.html'; }
function active(page) { return currentPage() === page ? 'active' : ''; }

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
          <a class="nav-link ${active('index.html')}" href="./index.html">Trang chủ</a>
          <a class="nav-link ${active('exercises.html')}" href="./exercises.html">Bài tập</a>
          <a class="nav-link ${active('routine.html')}" href="./routine.html">Lịch tập</a>
          <a class="nav-link ${active('meals.html')}" href="./meals.html">Bữa ăn</a>
          <a class="nav-link nav-badge ${active('saved.html')}" href="./saved.html">Đã lưu<span id="savedBadge" class="badge">${savedCount}</span></a>
          <a class="nav-link nav-badge ${active('cart.html')}" href="./cart.html">Kế hoạch<span id="cartBadge" class="badge">${getCartCount()}</span></a>
        </nav>
        <div class="nav-actions">
          ${user ? `<span class="user-chip">${user.name}</span><button id="logoutBtn" class="btn btn-secondary">Đăng xuất</button>` : `<a class="btn btn-secondary" href="./login.html">Đăng nhập</a><a class="btn btn-primary" href="./register.html">Đăng ký</a>`}
        </div>
      </div>
    </div>`;
  document.getElementById('logoutBtn')?.addEventListener('click', () => { logoutUser(); window.location.href = './login.html'; });
}

export function refreshHeaderBadges() {
  const cartBadge = document.getElementById('cartBadge');
  const savedBadge = document.getElementById('savedBadge');
  if (cartBadge) cartBadge.textContent = getCartCount();
  if (savedBadge) savedBadge.textContent = getSavedExercises().length + getSavedMeals().length;
}
