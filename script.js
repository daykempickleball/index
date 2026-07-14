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
const submissionIdInput = document.getElementById('submission-id');
let sheetSubmissionPending = false;
let sheetSubmissionTimer;
let currentSubmissionId = '';

function setFormStatus(message, type = '') {
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.classList.remove('success', 'error');
  if (type) statusBox.classList.add(type);
}

function resetSubmitButton() {
  if (submitButton) submitButton.disabled = false;
  if (submitLabel) submitLabel.textContent = 'Gửi đăng ký';
}

function finishSubmission(ok, message) {
  if (!sheetSubmissionPending) return;
  sheetSubmissionPending = false;
  clearTimeout(sheetSubmissionTimer);
  resetSubmitButton();

  if (ok) {
    leadForm?.reset();
    currentSubmissionId = '';
    setFormStatus(message || 'Đăng ký thành công! Coach Linh sẽ liên hệ với bạn sớm.', 'success');
  } else {
    setFormStatus(message || 'Không thể lưu dữ liệu. Vui lòng thử lại hoặc liên hệ Zalo 0772 334 449.', 'error');
  }
}

// Apps Script trả kết quả từ iframe bằng postMessage.
// Chỉ chấp nhận phản hồi từ tên miền chính thức của Google Apps Script.
window.addEventListener('message', (event) => {
  const allowedOrigins = new Set([
    'https://script.google.com',
    'https://script.googleusercontent.com'
  ]);

  if (!allowedOrigins.has(event.origin)) return;

  const data = event.data;
  if (!data || data.source !== '5p-pickleball-form') return;
  if (!sheetSubmissionPending) return;
  if (!data.submissionId || data.submissionId !== currentSubmissionId) return;

  finishSubmission(Boolean(data.ok), String(data.message || ''));
});

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

  currentSubmissionId = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  if (submissionIdInput) submissionIdInput.value = currentSubmissionId;

  sheetSubmissionPending = true;
  if (submitButton) submitButton.disabled = true;
  if (submitLabel) submitLabel.textContent = 'Đang gửi...';
  setFormStatus('Đang lưu thông tin vào Google Sheets...');

  // Nếu Apps Script bị chặn quyền hoặc chưa triển khai đúng, không báo thành công giả.
  sheetSubmissionTimer = window.setTimeout(() => {
    if (!sheetSubmissionPending) return;
    finishSubmission(false, 'Google Sheets chưa xác nhận dữ liệu. Kiểm tra lại bản triển khai Apps Script hoặc liên hệ Zalo 0772 334 449.');
  }, 20000);
});
