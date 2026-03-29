import { truncateText } from '../utils/helpers.js';
import { isSavedExercise, isSavedMeal } from '../utils/storage.js';

export function renderExerciseCards(items, container) {
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="exercise-card">
      <img class="exercise-thumb" src="${item.image}" alt="${item.name}" />
      <div class="card-body">
        <div class="exercise-tags"><span class="tag">${item.category}</span><span class="tag success">${item.muscle}</span></div>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-text">${truncateText(stripHtml(item.description), 120)}</p>
        <div class="card-actions">
          <a class="btn btn-secondary" href="./exercise-detail.html?id=${item.id}">Xem chi tiết</a>
          <div class="card-actions-row">
            <button class="btn btn-primary add-plan-btn" data-id="${item.id}">Thêm kế hoạch</button>
            <button class="btn btn-secondary save-exercise-btn" data-id="${item.id}">${isSavedExercise(item.id) ? 'Đã lưu' : 'Yêu thích'}</button>
          </div>
        </div>
      </div>
    </article>`).join('');
}

export function renderMealCards(items, container) {
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="meal-card">
      <img src="${item.strMealThumb}" alt="${item.strMeal}" />
      <div class="card-body">
        <div class="meal-tags"><span class="tag">Healthy idea</span></div>
        <h3 class="card-title">${item.strMeal}</h3>
        <p class="card-text">Gợi ý bữa ăn phù hợp để bổ sung năng lượng sau tập luyện.</p>
        <div class="card-actions">
          <a class="btn btn-secondary" href="https://www.themealdb.com/meal/${item.idMeal}" target="_blank" rel="noopener">Xem món</a>
          <button class="btn btn-primary save-meal-btn" data-id="${item.idMeal}">${isSavedMeal(item.idMeal) ? 'Đã lưu' : 'Lưu món'}</button>
        </div>
      </div>
    </article>`).join('');
}

function stripHtml(text) {
  const div = document.createElement('div');
  div.innerHTML = text || '';
  return div.textContent || div.innerText || '';
}
