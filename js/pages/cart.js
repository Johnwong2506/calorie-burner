import { getCart, updateCartQuantity, removeFromCart, getCartCount, getCartTotalCalories } from '../utils/storage.js';
import { renderEmpty } from '../components/state.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const list = document.getElementById('cartList');
const summary = document.getElementById('cartSummary');
const empty = document.getElementById('cartEmpty');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let deletingId = null;

function renderPage() {
  const items = getCart();
  if (!items.length) {
    list.innerHTML = ''; summary.innerHTML = ''; renderEmpty(empty, 'Chưa có bài tập nào trong kế hoạch.'); refreshHeaderBadges(); return;
  }
  empty.innerHTML = '';
  list.innerHTML = `<div class="routine-list">${items.map(item => `
    <article class="routine-item">
      <div class="routine-head"><div><h3>${item.name}</h3><p class="card-text">Nhóm cơ: ${item.muscle}</p></div></div>
      <div class="routine-meta"><span class="tag">${item.quantity} buổi</span><span class="tag success">${item.calories} kcal/buổi</span></div>
      <div class="card-actions-row">
        <div class="card-actions-row"><button class="btn btn-secondary qty-btn" data-id="${item.id}" data-action="decrease">-</button><button class="btn btn-secondary qty-btn" data-id="${item.id}" data-action="increase">+</button></div>
        <button class="btn btn-danger delete-btn" data-id="${item.id}">Xóa</button>
      </div>
    </article>`).join('')}</div>`;
  summary.innerHTML = `<aside class="routine-item"><h3>Tổng quan kế hoạch</h3><div class="routine-meta"><span class="tag">${getCartCount()} buổi</span><span class="tag success">${getCartTotalCalories()} kcal</span></div><p class="card-text">Theo dõi tổng lượng calo dự kiến đốt từ các bài tập bạn đã chọn.</p></aside>`;
  bindActions(); refreshHeaderBadges();
}
function bindActions() {
  document.querySelectorAll('.qty-btn').forEach(button => button.addEventListener('click', () => { updateCartQuantity(Number(button.dataset.id), button.dataset.action); renderPage(); }));
  document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', () => { deletingId = Number(button.dataset.id); openModal(deleteModal); }));
}
confirmDeleteBtn?.addEventListener('click', () => { if (deletingId !== null) { removeFromCart(deletingId); deletingId = null; closeModal(deleteModal); renderPage(); showToast('Đã xóa khỏi kế hoạch'); } });
cancelDeleteBtn?.addEventListener('click', () => { deletingId = null; closeModal(deleteModal); });
deleteModal?.addEventListener('click', (event) => { if (event.target.dataset.close === 'true') { deletingId = null; closeModal(deleteModal); } });
renderPage();
