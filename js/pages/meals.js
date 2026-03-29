import { getHealthyMeals } from '../api/mealApi.js';
import { renderMealCards } from '../components/cards.js';
import { renderLoading, renderEmpty, clearState } from '../components/state.js';
import { toggleSavedMeal } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const loading = document.getElementById('mealLoading');
const list = document.getElementById('mealList');
const empty = document.getElementById('mealEmpty');
const searchInput = document.getElementById('mealSearch');
const searchBtn = document.getElementById('mealSearchBtn');
let meals = [];
function bindActions() {
  document.querySelectorAll('.save-meal-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = meals.find(entry => entry.idMeal === button.dataset.id);
      const saved = toggleSavedMeal(item); showToast(saved ? 'Đã lưu món ăn' : 'Đã bỏ lưu món ăn');
      renderMealCards(meals, list); bindActions(); refreshHeaderBadges();
    });
  });
}
async function loadMeals(ingredient) {
  try {
    renderLoading(loading, 'Đang tải món ăn...');
    meals = (await getHealthyMeals(ingredient)).slice(0, 12);
    clearState(loading);
    if (!meals.length) { list.innerHTML = ''; renderEmpty(empty, 'Không tìm thấy món ăn phù hợp.'); return; }
    empty.innerHTML = ''; renderMealCards(meals, list); bindActions();
  } catch {
    renderEmpty(empty, 'Không thể tải món ăn.');
  }
}
searchBtn?.addEventListener('click', () => loadMeals(searchInput.value.trim() || 'chicken_breast'));
loadMeals('chicken_breast');
