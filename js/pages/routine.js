import { getRoutines, saveRoutines } from '../utils/storage.js';
import { renderEmpty } from '../components/state.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const form = document.getElementById('routineForm');
const list = document.getElementById('routineList');
const empty = document.getElementById('routineEmpty');
const formTitle = document.getElementById('formTitle');
const resetBtn = document.getElementById('resetBtn');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let deletingId = null;

function clearForm() {
  form.reset();
  document.getElementById('routineId').value = '';
  formTitle.textContent = 'Tạo bài tập cá nhân';
}
function renderRoutines() {
  const routines = getRoutines();
  if (!routines.length) { list.innerHTML = ''; renderEmpty(empty, 'Chưa có bài tập cá nhân nào.'); return; }
  empty.innerHTML = '';
  list.innerHTML = routines.map(item => `
    <article class="routine-item">
      <div class="routine-head"><div><h3>${item.title}</h3><p class="card-text">${item.notes || 'Không có ghi chú.'}</p></div></div>
      <div class="routine-meta"><span class="tag">${item.muscle}</span><span class="tag success">${item.duration} phút</span><span class="tag">${item.calories} kcal</span></div>
      <div class="card-actions-row">
        <button class="btn btn-secondary edit-btn" data-id="${item.id}">Chỉnh sửa</button>
        <button class="btn btn-danger delete-btn" data-id="${item.id}">Xóa</button>
      </div>
    </article>`).join('');
  bindActions();
}
function bindActions() {
  document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', () => {
    const item = getRoutines().find(entry => entry.id === button.dataset.id);
    if (!item) return;
    document.getElementById('routineId').value = item.id;
    document.getElementById('routineTitle').value = item.title;
    document.getElementById('routineMuscle').value = item.muscle;
    document.getElementById('routineDuration').value = item.duration;
    document.getElementById('routineCalories').value = item.calories;
    document.getElementById('routineNotes').value = item.notes;
    formTitle.textContent = 'Cập nhật bài tập cá nhân';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', () => {
    deletingId = button.dataset.id; openModal(deleteModal);
  }));
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const routines = getRoutines();
  const payload = {
    id: document.getElementById('routineId').value || crypto.randomUUID(),
    title: document.getElementById('routineTitle').value.trim(),
    muscle: document.getElementById('routineMuscle').value.trim(),
    duration: Number(document.getElementById('routineDuration').value),
    calories: Number(document.getElementById('routineCalories').value),
    notes: document.getElementById('routineNotes').value.trim()
  };
  const index = routines.findIndex(item => item.id === payload.id);
  if (index >= 0) routines[index] = payload; else routines.unshift(payload);
  saveRoutines(routines); clearForm(); renderRoutines(); showToast(index >= 0 ? 'Đã cập nhật bài tập' : 'Đã tạo bài tập mới');
});
resetBtn?.addEventListener('click', clearForm);
confirmDeleteBtn?.addEventListener('click', () => {
  if (!deletingId) return;
  saveRoutines(getRoutines().filter(item => item.id !== deletingId));
  deletingId = null; closeModal(deleteModal); renderRoutines(); showToast('Đã xóa bài tập');
});
cancelDeleteBtn?.addEventListener('click', () => { deletingId = null; closeModal(deleteModal); });
deleteModal?.addEventListener('click', (event) => { if (event.target.dataset.close === 'true') { deletingId = null; closeModal(deleteModal); } });
renderRoutines();
