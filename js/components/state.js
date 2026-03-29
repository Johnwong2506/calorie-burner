export function renderLoading(container, message = 'Đang tải dữ liệu...') {
  if (!container) return;
  container.innerHTML = `<div class="loading-box">${message}</div>`;
}
export function clearState(container) { if (container) container.innerHTML = ''; }
export function renderEmpty(container, message = 'Không có dữ liệu.') { if (container) container.innerHTML = `<div class="empty-box">${message}</div>`; }
