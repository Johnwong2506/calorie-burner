export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
export function debounce(callback, delay = 250) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}
export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
export function slugify(value) {
  return value.toLowerCase().replace(/\s+/g, '-');
}
