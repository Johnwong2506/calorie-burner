export function renderFooter() {
  const host = document.getElementById('siteFooter');
  if (!host) return;
  host.innerHTML = `
    <div class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div><h3 class="footer-title">Calorie Burner</h3><p>Web giúp người dùng quản lý sức khỏe, hình dáng tốt hơn với bài tập, lịch tập và bữa ăn gợi ý.</p></div>
          <div><h3 class="footer-title">Trang chính</h3><div class="footer-links"><a href="./index.html">Trang chủ</a><a href="./exercises.html">Bài tập</a><a href="./routine.html">Lịch tập</a></div></div>
          <div><h3 class="footer-title">Tiện ích</h3><div class="footer-links"><a href="./meals.html">Bữa ăn</a><a href="./saved.html">Đã lưu</a><a href="./cart.html">Kế hoạch</a></div></div>
        </div>
        <div class="footer-copy">Built with HTML, CSS, JavaScript, wger API and TheMealDB.</div>
      </div>
    </div>`;
}
