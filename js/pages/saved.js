import { getSavedExercises, getSavedMeals, toggleSavedExercise, toggleSavedMeal, addToCart } from '../utils/storage.js';
import { renderExerciseCards, renderMealCards } from '../components/cards.js';
import { renderEmpty } from '../components/state.js';
import { showToast } from '../components/toast.js';
import { refreshHeaderBadges } from '../components/header.js';

const savedExercises = document.getElementById('savedExercises');
const savedExercisesEmpty = document.getElementById('savedExercisesEmpty');
const savedMeals = document.getElementById('savedMeals');
const savedMealsEmpty = document.getElementById('savedMealsEmpty');

function bindExerciseActions(items) {
  document.querySelectorAll('.add-plan-btn').forEach(button => button.addEventListener('click', () => {
    const item = items.find(entry => entry.id === Number(button.dataset.id)); addToCart(item); showToast('Đã thêm vào kế hoạch'); refreshHeaderBadges();
  }));
  document.querySelectorAll('.save-exercise-btn').forEach(button => button.addEventListener('click', () => {
    const item = items.find(entry => entry.id === Number(button.dataset.id)); toggleSavedExercise(item); showToast('Đã bỏ lưu bài tập'); renderPage(); refreshHeaderBadges();
  }));
}
function bindMealActions(items) {
  document.querySelectorAll('.save-meal-btn').forEach(button => button.addEventListener('click', () => {
    const item = items.find(entry => entry.idMeal === button.dataset.id); toggleSavedMeal(item); showToast('Đã bỏ lưu món ăn'); renderPage(); refreshHeaderBadges();
  }));
}
function renderPage() {
  const exercises = getSavedExercises();
  const meals = getSavedMeals();
  if (!exercises.length) { savedExercises.innerHTML = ''; renderEmpty(savedExercisesEmpty, 'Chưa có bài tập yêu thích.'); }
  else { savedExercisesEmpty.innerHTML = ''; renderExerciseCards(exercises, savedExercises); bindExerciseActions(exercises); }
  if (!meals.length) { savedMeals.innerHTML = ''; renderEmpty(savedMealsEmpty, 'Chưa có món ăn yêu thích.'); }
  else { savedMealsEmpty.innerHTML = ''; renderMealCards(meals, savedMeals); bindMealActions(meals); }
}
renderPage();
