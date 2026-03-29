import { registerUser } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

const form = document.getElementById('registerForm');
const messageBox = document.getElementById('authMessage');
const renderMessage = (message, type) => messageBox.innerHTML = `<div class="auth-message ${type}">${message}</div>`;
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  if (password !== confirmPassword) { renderMessage('Mật khẩu xác nhận không khớp.', 'error'); return; }
  const result = registerUser({ name, email, password });
  renderMessage(result.message, result.success ? 'success' : 'error');
  if (result.success) { showToast('Tạo tài khoản thành công'); form.reset(); setTimeout(() => window.location.href = './login.html', 700); }
});
