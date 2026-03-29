import { getExercises } from '../api/exerciseApi.js';
import { renderExerciseCards } from '../components/cards.js';
import { renderLoading, renderEmpty, clearState } from '../components/state.js';
import { debounce } from '../utils/helpers.js';
import { addToCart, toggleSavedExercise } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const loading = document.getElementById('exerciseLoading');
const list = document.getElementById('exerciseList');
const empty = document.getElementById('exerciseEmpty');
const searchInput = document.getElementById('exerciseSearch');
const muscleFilter = document.getElementById('muscleFilter');
const sortSelect = document.getElementById('sortSelect');

let allExercises = [];
let filteredExercises = [];

function renderMuscles() {
  const muscles = [...new Set(allExercises.map(item => item.muscle))].sort();
  muscleFilter.innerHTML = `<option value="all">Tất cả nhóm cơ</option>${muscles.map(m => `<option value="${m}">${m}</option>`).join('')}`;
}
function bindActions() {
  document.querySelectorAll('.add-plan-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = filteredExercises.find(entry => entry.id === Number(button.dataset.id));
      addToCart(item); showToast('Đã thêm vào kế hoạch'); refreshHeaderBadges();
    });
  });
  document.querySelectorAll('.save-exercise-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = filteredExercises.find(entry => entry.id === Number(button.dataset.id));
      const saved = toggleSavedExercise(item); showToast(saved ? 'Đã lưu bài tập' : 'Đã bỏ lưu bài tập');
      renderExerciseCards(filteredExercises, list); bindActions(); refreshHeaderBadges();
    });
  });
}
function applyFilters() {
  const keyword = searchInput.value.toLowerCase().trim();
  const muscle = muscleFilter.value;
  const sort = sortSelect.value;
  filteredExercises = [...allExercises];
  if (keyword) filteredExercises = filteredExercises.filter(item => item.name.toLowerCase().includes(keyword));
  if (muscle !== 'all') filteredExercises = filteredExercises.filter(item => item.muscle === muscle);
  filteredExercises.sort((a,b) => sort === 'name-desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  if (!filteredExercises.length) { list.innerHTML = ''; renderEmpty(empty, 'Không tìm thấy bài tập phù hợp.'); return; }
  empty.innerHTML = ''; renderExerciseCards(filteredExercises, list); bindActions();
}
(async function init() {
  try {
    renderLoading(loading, 'Đang tải danh sách bài tập...');
    allExercises = await getExercises(18);
    filteredExercises = [...allExercises];
    renderMuscles(); clearState(loading); renderExerciseCards(filteredExercises, list); bindActions();
  } catch {
    renderEmpty(empty, 'Không thể tải bài tập.');
  }
})();
searchInput?.addEventListener('input', debounce(applyFilters, 250));
muscleFilter?.addEventListener('change', applyFilters);
sortSelect?.addEventListener('change', applyFilters);
