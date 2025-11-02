document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");
  const items = document.querySelectorAll(".number-item");
  let triggered = false;

  function animateNumbers() {
    counters.forEach(counter => {
      const start = +counter.getAttribute("data-start");
      const target = +counter.getAttribute("data-target");
      const duration = 1500;
      const frames = 60;
      const increment = (target - start) / frames;
      let current = start;
      let frame = 0;

      const updateCount = () => {
        frame++;
        current += increment;
        counter.innerText = Math.floor(current);
        if (frame < frames) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !triggered) {
      items.forEach(item => item.classList.add("visible"));
      animateNumbers();
      triggered = true;
    }
  }, { threshold: 0.4 });

  observer.observe(document.querySelector(".numbers"));
});

  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  const nextBtn = document.getElementById('nextTabBtn');

  function activateTab(index) {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tabs[index].classList.add('active');
    contents[index].classList.add('active');
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
  });

  nextBtn.addEventListener('click', () => {
    const currentIndex = [...tabs].findIndex(t => t.classList.contains('active'));
    const nextIndex = (currentIndex + 1) % tabs.length;
    activateTab(nextIndex);
  });

  const carousel = document.getElementById('carousel');
  const cards = document.querySelectorAll('.case-card');
  const prevBtn = document.getElementById('prevCase');
  const next = document.getElementById('nextCase');
  const dotsContainer = document.getElementById('carouselDots');
  
  let currentIndex = 0;
  let visibleCards = window.innerWidth < 768 ? 1 : 3;
  
  function getMaxIndex() {
    return Math.max(0, cards.length - visibleCards);
  }
  
  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 20; // card + gap
    carousel.scrollTo({
      left: currentIndex * cardWidth,
      behavior: 'smooth'
    });
    updateDots();
  }
  
  function updateDots() {
    dotsContainer.innerHTML = '';
    const totalSteps = getMaxIndex() + 1;
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
  
      // 👇 Добавляем обработчик клика на точку
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
  
      dotsContainer.appendChild(dot);
    }
  }
  
  // 👈 Зацикливание влево
  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
    updateCarousel();
  });
  
  // 👉 Зацикливание вправо
  next.addEventListener('click', () => {
    currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
    updateCarousel();
  });
  
  // 📱 Адаптация при ресайзе
  window.addEventListener('resize', () => {
    visibleCards = window.innerWidth < 768 ? 1 : 3;
    currentIndex = 0;
    updateCarousel();
  });
  
  // 📱 Свайп на мобильных
  let startX = 0;
  let endX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  carousel.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });
  
  carousel.addEventListener('touchend', () => {
    const delta = endX - startX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
      } else {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
      }
      updateCarousel();
    }
  });
  
  updateCarousel();
  
  const reviewsCarousel = document.getElementById('reviewsCarousel');
  const reviewCards = document.querySelectorAll('.review-card');
  const prevReview = document.getElementById('prevReview');
  const nextReview = document.getElementById('nextReview');
  const reviewsDots = document.getElementById('reviewsDots');
  
  let reviewIndex = 0;
  
  function updateReviews() {
    const cardWidth = reviewCards[0].offsetWidth + 20;
    reviewsCarousel.scrollTo({
      left: reviewIndex * cardWidth,
      behavior: 'smooth'
    });
    updateReviewDots();
    animateReviewWords();
  }
  
  function animateReviewWords() {
    const activeCard = reviewCards[reviewIndex];
    const paragraphs = activeCard.querySelectorAll('p');
  
    paragraphs.forEach(p => {
      const words = p.textContent.trim().split(' ');
      p.innerHTML = ''; // очистить
  
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word + ' ';
        span.style.animationDelay = `${i * 50}ms`;
        p.appendChild(span);
      });
    });
  }

  function updateReviewDots() {
    reviewsDots.innerHTML = '';
    for (let i = 0; i < reviewCards.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === reviewIndex) dot.classList.add('active');
  
      // 👇 Добавляем обработчик клика на точку
      dot.addEventListener('click', () => {
        reviewIndex = i;
        updateReviews();
      });
  
      reviewsDots.appendChild(dot);
    }
  }
  
  // 👉 Зацикливание вправо
  nextReview.addEventListener('click', () => {
    reviewIndex = (reviewIndex + 1) % reviewCards.length;
    updateReviews();
  });
  
  // 👈 Зацикливание влево
  prevReview.addEventListener('click', () => {
    reviewIndex = (reviewIndex - 1 + reviewCards.length) % reviewCards.length;
    updateReviews();
  });
  
  // 📱 Свайп на мобильных
  let startXR = 0;
  let endXR = 0;
  
  reviewsCarousel.addEventListener('touchstart', (e) => {
    startXR = e.touches[0].clientX;
  });
  
  reviewsCarousel.addEventListener('touchmove', (e) => {
    endXR = e.touches[0].clientX;
  });
  
  reviewsCarousel.addEventListener('touchend', () => {
    const delta = endXR - startXR;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        reviewIndex = (reviewIndex + 1) % reviewCards.length;
      } else {
        reviewIndex = (reviewIndex - 1 + reviewCards.length) % reviewCards.length;
      }
      updateReviews();
    }
  });
  
  updateReviews();
  

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
