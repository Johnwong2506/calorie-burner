import { getExerciseById } from '../api/exerciseApi.js';
import { renderLoading, clearState } from '../components/state.js';
import { getQueryParam } from '../utils/helpers.js';
import { addToCart, toggleSavedExercise, isSavedExercise } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const loading = document.getElementById('detailLoading');
const detail = document.getElementById('exerciseDetail');
function stripHtml(text) { const div = document.createElement('div'); div.innerHTML = text || ''; return div.textContent || ''; }
function renderExercise(item) {
  detail.innerHTML = `
    <article class="detail-card">
      <div class="exercise-tags"><span class="tag">${item.category}</span><span class="tag success">${item.muscle}</span><span class="tag">~ ${item.calories} kcal</span></div>
      <h1 class="detail-title">${item.name}</h1>
      <img class="exercise-thumb" src="${item.image}" alt="${item.name}" />
      <p class="detail-text">${stripHtml(item.description)}</p>
      <div class="detail-actions">
        <button id="addPlanBtn" class="btn btn-primary">Thêm vào kế hoạch</button>
        <button id="saveBtn" class="btn btn-secondary">${isSavedExercise(item.id) ? 'Đã lưu bài tập' : 'Lưu bài tập'}</button>
      </div>
    </article>`;
  document.getElementById('addPlanBtn')?.addEventListener('click', () => { addToCart(item); showToast('Đã thêm vào kế hoạch'); refreshHeaderBadges(); });
  document.getElementById('saveBtn')?.addEventListener('click', () => { const saved = toggleSavedExercise(item); showToast(saved ? 'Đã lưu bài tập' : 'Đã bỏ lưu bài tập'); renderExercise(item); refreshHeaderBadges(); });
}
(async function init() {
  const id = getQueryParam('id');
  if (!id) return;
  try {
    renderLoading(loading, 'Đang tải chi tiết bài tập...');
    const item = await getExerciseById(id);
    clearState(loading); renderExercise(item);
  } catch {
    renderLoading(loading, 'Không thể tải chi tiết bài tập.');
  }
})();
