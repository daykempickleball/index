/*
  THÔNG TIN CẦN ĐỔI TRƯỚC KHI CHẠY QUẢNG CÁO:
  - phoneDisplay: số hiển thị trên website
  - phoneInternational: số dùng cho tel: và Zalo, không có dấu +
*/
const SITE_CONFIG = {
  phoneDisplay: "0909 123 456",
  phoneInternational: "84909123456",
  zaloUrl: "https://zalo.me/84909123456"
};

const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

menuBtn?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.js-phone-text').forEach(el => {
  el.textContent = SITE_CONFIG.phoneDisplay;
});

document.querySelectorAll('.js-phone').forEach(el => {
  el.href = `tel:+${SITE_CONFIG.phoneInternational}`;
});

document.querySelectorAll('.js-zalo').forEach(el => {
  el.href = SITE_CONFIG.zaloUrl;
  el.target = '_blank';
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const leadForm = document.getElementById('lead-form');
const statusBox = leadForm?.querySelector('.form-status');

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const level = String(data.get('level') || '').trim();
  const goal = String(data.get('goal') || '').trim();

  if (!name || !phone || !level) {
    statusBox.textContent = 'Vui lòng điền đủ họ tên, số điện thoại và trình độ.';
    return;
  }

  const message = [
    'Xin chào APEX Pickleball, tôi muốn đăng ký học thử 1:1.',
    `Họ tên: ${name}`,
    `Số điện thoại: ${phone}`,
    `Trình độ: ${level}`,
    `Mục tiêu: ${goal || 'Trao đổi thêm khi tư vấn'}`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(message);
    statusBox.textContent = 'Đã sao chép thông tin. Đang mở Zalo để bạn gửi tin nhắn…';
  } catch {
    statusBox.textContent = 'Đang mở Zalo. Bạn vui lòng gửi lại thông tin vừa nhập.';
  }

  window.open(SITE_CONFIG.zaloUrl, '_blank', 'noopener');
});
