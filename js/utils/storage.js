import { STORAGE_KEYS } from './constants.js';

function read(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() { return read(STORAGE_KEYS.USERS, []); }
export function registerUser(user) {
  const users = getUsers();
  const exists = users.some(item => item.email.toLowerCase() === user.email.toLowerCase());
  if (exists) return { success: false, message: 'Email đã tồn tại.' };
  users.push(user); write(STORAGE_KEYS.USERS, users);
  return { success: true, message: 'Đăng ký thành công.' };
}
export function loginUser(email, password) {
  const found = getUsers().find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
  if (!found) return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
  write(STORAGE_KEYS.CURRENT_USER, { name: found.name, email: found.email });
  return { success: true, message: 'Đăng nhập thành công.' };
}
export function getCurrentUser() { return read(STORAGE_KEYS.CURRENT_USER, null); }
export function logoutUser() { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); }

export function getSavedExercises() { return read(STORAGE_KEYS.SAVED_EXERCISES, []); }
export function isSavedExercise(id) { return getSavedExercises().some(item => item.id === id); }
export function toggleSavedExercise(item) {
  const saved = getSavedExercises();
  const exists = saved.some(entry => entry.id === item.id);
  if (exists) { write(STORAGE_KEYS.SAVED_EXERCISES, saved.filter(entry => entry.id !== item.id)); return false; }
  write(STORAGE_KEYS.SAVED_EXERCISES, [...saved, item]); return true;
}

export function getSavedMeals() { return read(STORAGE_KEYS.SAVED_MEALS, []); }
export function isSavedMeal(id) { return getSavedMeals().some(item => item.idMeal === id); }
export function toggleSavedMeal(item) {
  const saved = getSavedMeals();
  const exists = saved.some(entry => entry.idMeal === item.idMeal);
  if (exists) { write(STORAGE_KEYS.SAVED_MEALS, saved.filter(entry => entry.idMeal !== item.idMeal)); return false; }
  write(STORAGE_KEYS.SAVED_MEALS, [...saved, item]); return true;
}

export function getCart() { return read(STORAGE_KEYS.CART, []); }
export function addToCart(item) {
  const cart = getCart();
  const exists = cart.find(entry => entry.id === item.id);
  if (exists) exists.quantity += 1;
  else cart.push({ id: item.id, name: item.name, calories: item.calories, quantity: 1, muscle: item.muscle });
  write(STORAGE_KEYS.CART, cart);
}
export function updateCartQuantity(id, action) {
  const updated = getCart().map(item => {
    if (item.id === id) {
      if (action === 'increase') item.quantity += 1;
      if (action === 'decrease') item.quantity -= 1;
    }
    return item;
  }).filter(item => item.quantity > 0);
  write(STORAGE_KEYS.CART, updated);
}
export function removeFromCart(id) { write(STORAGE_KEYS.CART, getCart().filter(item => item.id !== id)); }
export function getCartCount() { return getCart().reduce((sum, item) => sum + item.quantity, 0); }
export function getCartTotalCalories() { return getCart().reduce((sum, item) => sum + item.quantity * item.calories, 0); }

export function getRoutines() { return read(STORAGE_KEYS.ROUTINES, []); }
export function saveRoutines(items) { write(STORAGE_KEYS.ROUTINES, items); }
