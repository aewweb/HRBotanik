const TOKEN = "8135815901:AAGvHe4zyh-p5Q08B9eAATdEsi5aVio8CFE";
const CHAT_ID = "553356311";
const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const form = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');
const successModal = document.getElementById('successModal');

// Поля формы
const nameInput = form.querySelector('input[placeholder="Ваше имя"]');
const phoneInput = form.querySelector('input[placeholder="Телефон"]');
const emailInput = document.getElementById('emailInput');
const telegramInput = form.querySelector('input[placeholder="Телеграм"]');
const commentInput = form.querySelector('textarea[placeholder="Комментарий"]');
const contactMethodSelect = form.querySelector('select');
const consentCheckbox = document.getElementById('consentCheckbox');
const consentMarketing = document.getElementById('consentMarketing');

// Маска для телефона (формат: +7 (___) ___-__-__)
phoneInput.addEventListener('input', () => {
  let value = phoneInput.value.replace(/\D/g, '');
  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (!value.startsWith('7')) value = '7' + value;

  const formatted = `+${value.slice(0, 1)} (${value.slice(1, 4)}${value.length >= 4 ? ')' : ''} ${value.slice(4, 7)}${value.length >= 7 ? '-' : ''}${value.slice(7, 9)}${value.length >= 9 ? '-' : ''}${value.slice(9, 11)}`;
  phoneInput.value = formatted.trim();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Сбор данных
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const telegram = telegramInput.value.trim();
  const comment = commentInput.value.trim();
  const contactMethod = contactMethodSelect.value;
  const consent = consentCheckbox.checked;

  // Валидация
  if (!name || !phone || !email || !consent) {
    alert("Пожалуйста, заполните обязательные поля и подтвердите согласие.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Введите корректный email.");
    return;
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 11) {
    alert("Введите корректный номер телефона.");
    return;
  }

  // Формирование текста заявки
  const message = `
📩 Новая заявка:
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
💬 Телеграм: ${telegram || '—'}
📝 Комментарий: ${comment || '—'}
📍 Предпочтительный способ связи: ${contactMethod}
✅ Согласие на обработку: ${consent ? 'Да' : 'Нет'}
📢 Согласие на маркетинг: ${consentMarketing.checked ? 'Да' : 'Нет'}
  `;

  // Отправка
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    form.reset();
  } catch (error) {
    alert("Ошибка при отправке. Попробуйте позже.");
    return;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заявку';

    // Показ модального окна
    successModal.style.display = 'flex';

    const closeBtn = successModal.querySelector('.modal-close');
    closeBtn.onclick = () => successModal.style.display = 'none';
    window.onclick = (event) => {
      if (event.target === successModal) {
        successModal.style.display = 'none';
      }
    };
  }
});
