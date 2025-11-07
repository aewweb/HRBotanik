const TOKEN = "8135815901:AAGvHe4zyh-p5Q08B9eAATdEsi5aVio8CFE";
const CHAT_ID = "553356311";
const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const form = document.getElementById('contactForm');
const emailInput = document.getElementById('emailInput');
const consentCheckbox = document.getElementById('consentCheckbox');
const submitBtn = form.querySelector('button[type="submit"]');
const successModal = document.getElementById('successModal');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const consent = consentCheckbox.checked;

  if (!email || !consent) {
    alert("Пожалуйста, введите email и подтвердите согласие.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Введите корректный email.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `Новая заявка: ${email}`
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

    // Закрытие по клику на крестик
    closeBtn.onclick = () => {
      successModal.style.display = 'none';
    };

    // Закрытие по клику вне окна
    window.onclick = (event) => {
      if (event.target === successModal) {
        successModal.style.display = 'none';
      }
    };
  }
});
