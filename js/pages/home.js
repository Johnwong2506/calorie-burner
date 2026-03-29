import { getExercises } from '../api/exerciseApi.js';
import { getHealthyMeals } from '../api/mealApi.js';
import { renderExerciseCards, renderMealCards } from '../components/cards.js';
import { renderLoading, clearState } from '../components/state.js';
import { addToCart, toggleSavedExercise, toggleSavedMeal } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const exerciseLoading = document.getElementById('homeExercisesLoading');
const exerciseList = document.getElementById('homeExercises');
const mealLoading = document.getElementById('homeMealsLoading');
const mealList = document.getElementById('homeMeals');
let exercises = [];
let meals = [];

function bindExerciseActions() {
  document.querySelectorAll('.add-plan-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = exercises.find(entry => entry.id === Number(button.dataset.id));
      addToCart(item); showToast('Đã thêm vào kế hoạch'); refreshHeaderBadges();
    });
  });
  document.querySelectorAll('.save-exercise-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = exercises.find(entry => entry.id === Number(button.dataset.id));
      const saved = toggleSavedExercise(item); showToast(saved ? 'Đã lưu bài tập' : 'Đã bỏ lưu bài tập');
      renderExerciseCards(exercises, exerciseList); bindExerciseActions(); refreshHeaderBadges();
    });
  });
}
function bindMealActions() {
  document.querySelectorAll('.save-meal-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = meals.find(entry => entry.idMeal === button.dataset.id);
      const saved = toggleSavedMeal(item); showToast(saved ? 'Đã lưu món ăn' : 'Đã bỏ lưu món ăn');
      renderMealCards(meals, mealList); bindMealActions(); refreshHeaderBadges();
    });
  });
}
(async function init() {
  try {
    renderLoading(exerciseLoading, 'Đang tải bài tập nổi bật...');
    exercises = (await getExercises(6)).slice(0, 3);
    clearState(exerciseLoading); renderExerciseCards(exercises, exerciseList); bindExerciseActions();
  } catch {
    renderLoading(exerciseLoading, 'Không thể tải bài tập.');
  }
  try {
    renderLoading(mealLoading, 'Đang tải bữa ăn...');
    meals = (await getHealthyMeals('chicken_breast')).slice(0, 3);
    clearState(mealLoading); renderMealCards(meals, mealList); bindMealActions();
  } catch {
    renderLoading(mealLoading, 'Không thể tải bữa ăn.');
  }
})();
