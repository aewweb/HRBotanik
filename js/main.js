document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.btn-with-icon').forEach(button => {
    const img = button.querySelector('.btn-icon');
    const originalSrc = img.src;
    const hoverSrc = img.getAttribute('data-hover');
  
    button.addEventListener('mouseenter', () => {
      img.src = hoverSrc;
    });
  
    button.addEventListener('mouseleave', () => {
      img.src = originalSrc;
    });
  });
 
  document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const content = document.getElementById(targetId);

      // Переключение видимости
      const isVisible = content.style.display === 'block';
      content.style.display = isVisible ? 'none' : 'block';

      // Переключение класса для переворота стрелки
      button.classList.toggle('active');
    });
  });

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
  
