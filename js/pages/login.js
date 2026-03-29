import { loginUser } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

const form = document.getElementById('loginForm');
const messageBox = document.getElementById('authMessage');
const renderMessage = (message, type) => messageBox.innerHTML = `<div class="auth-message ${type}">${message}</div>`;
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const result = loginUser(email, password);
  renderMessage(result.message, result.success ? 'success' : 'error');
  if (result.success) { showToast('Đăng nhập thành công'); setTimeout(() => window.location.href = './index.html', 700); }
});
