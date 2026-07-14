/*
  THÔNG TIN CẦN ĐỔI TRƯỚC KHI CHẠY QUẢNG CÁO:
  - phoneDisplay: số hiển thị trên website
  - phoneInternational: số dùng cho tel: và Zalo, không có dấu +
*/
const SITE_CONFIG = {
  phoneDisplay: "0772 334 449",
  phoneInternational: "84772334449",
  zaloUrl: "https://zalo.me/0772334449"
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
const submitButton = leadForm?.querySelector('button[type="submit"]');
const submitLabel = submitButton?.querySelector('.submit-label');
const sheetFrame = document.querySelector('.sheet-submit-frame');
let sheetSubmissionPending = false;
let sheetSubmissionTimer;

function setFormStatus(message, type = '') {
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.classList.remove('success', 'error');
  if (type) statusBox.classList.add(type);
}

function finishSheetSubmission() {
  if (!sheetSubmissionPending) return;
  sheetSubmissionPending = false;
  clearTimeout(sheetSubmissionTimer);

  if (submitButton) submitButton.disabled = false;
  if (submitLabel) submitLabel.textContent = 'Gửi đăng ký';
  leadForm?.reset();
  setFormStatus('Đăng ký thành công! Coach Linh sẽ liên hệ với bạn sớm.', 'success');
}

sheetFrame?.addEventListener('load', finishSheetSubmission);

leadForm?.addEventListener('submit', (event) => {
  const data = new FormData(leadForm);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const level = String(data.get('level') || '').trim();

  if (!name || !phone || !level) {
    event.preventDefault();
    setFormStatus('Vui lòng điền đủ họ tên, số điện thoại và trình độ.', 'error');
    return;
  }

  if (!/^[0-9+\s().-]{8,20}$/.test(phone)) {
    event.preventDefault();
    setFormStatus('Số điện thoại chưa đúng định dạng.', 'error');
    return;
  }

  sheetSubmissionPending = true;
  if (submitButton) submitButton.disabled = true;
  if (submitLabel) submitLabel.textContent = 'Đang gửi...';
  setFormStatus('Đang lưu thông tin vào hệ thống...');

  sheetSubmissionTimer = window.setTimeout(() => {
    if (!sheetSubmissionPending) return;
    sheetSubmissionPending = false;
    if (submitButton) submitButton.disabled = false;
    if (submitLabel) submitLabel.textContent = 'Gửi đăng ký';
    setFormStatus('Chưa thể xác nhận dữ liệu. Vui lòng thử lại hoặc liên hệ Zalo 0772 334 449.', 'error');
  }, 20000);
});
