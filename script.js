// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Изменение навигации при прокрутке
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдение за элементами для анимации
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Обработка формы заказа
const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получение данных формы
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Валидация
    if (!data.name || !data.phone || !data.event || !data.date) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Имитация отправки данных
    showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
    
    // Очистка формы
    this.reset();
    
    // Здесь можно добавить реальную отправку данных на сервер
    console.log('Данные формы:', data);
});

// Система уведомлений
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Анимация счетчика для цен
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// История вашего вечера
function initStory() {
    const storySteps = document.querySelectorAll('.story-step');
    const nextBtn = document.getElementById('next-story');
    const prevBtn = document.getElementById('prev-story');
    const resultDiv = document.querySelector('.story-result');
    
    if (!nextBtn || !prevBtn || !resultDiv) return;
    
    let currentStep = 1;
    let selectedOptions = {};
    
    // Обработка выбора опций
    document.querySelectorAll('.story-option').forEach(option => {
        option.addEventListener('click', function() {
            const step = this.closest('.story-step').dataset.step;
            const value = this.dataset.value;
            
            // Убираем выделение с других опций в этом шаге
            this.closest('.story-options').querySelectorAll('.story-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Выделяем выбранную опцию
            this.classList.add('selected');
            
            selectedOptions[step] = value;
        });
    });
    
    // Следующий шаг
    nextBtn.addEventListener('click', function() {
        if (currentStep < 3) {
            if (selectedOptions[currentStep]) {
                storySteps[currentStep - 1].classList.remove('active');
                storySteps[currentStep].classList.add('active');
                currentStep++;
                
                if (currentStep > 1) {
                    prevBtn.style.display = 'block';
                }
                
                if (currentStep === 3) {
                    nextBtn.textContent = 'Создать мой вечер';
                }
            } else {
                showNotification('Пожалуйста, выберите вариант', 'error');
            }
        } else {
            // Показываем результат
            storySteps[2].classList.remove('active');
            resultDiv.style.display = 'block';
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
        }
    });
    
    // Предыдущий шаг
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            storySteps[currentStep - 1].classList.remove('active');
            storySteps[currentStep - 2].classList.add('active');
            currentStep--;
            
            if (currentStep === 1) {
                prevBtn.style.display = 'none';
            }
            
            if (currentStep < 3) {
                nextBtn.textContent = 'Продолжить';
            }
        }
    });
    
    // Обработка формы результата
    const resultForm = resultDiv.querySelector('.story-form-mini');
    if (resultForm) {
        resultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Спасибо! Мы создадим для вас идеальный вечер и свяжемся в ближайшее время.', 'success');
        });
    }
}

// Анимация цен при появлении в области видимости
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const priceElement = entry.target;
            const priceText = priceElement.textContent;
            const priceNumber = parseInt(priceText.match(/\d+/)[0]);
            
            // Временно скрываем текст
            priceElement.textContent = '0₽';
            
            // Анимируем счетчик
            animateCounter(priceElement, priceNumber);
            
            // Восстанавливаем текст с символом валюты
            setTimeout(() => {
                priceElement.textContent = `от ${priceNumber}₽`;
            }, 2000);
            
            priceObserver.unobserve(priceElement);
        }
    });
}, { threshold: 0.5 });

// Наблюдение за ценами
document.addEventListener('DOMContentLoaded', () => {
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(price => {
        priceObserver.observe(price);
    });
});

// Эффект параллакса для главной секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const cocktailGlass = document.querySelector('.cocktail-glass');
    
    if (hero && cocktailGlass) {
        const rate = scrolled * -0.5;
        cocktailGlass.style.transform = `translateY(${rate}px)`;
    }
});

// Добавление активного класса для текущего раздела в навигации
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Добавляем стили для активного состояния навигации
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #ff6b6b !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Предзагрузка изображений (для будущих реальных изображений)
function preloadImages() {
    const imageUrls = [
        // Здесь можно добавить URL реальных изображений
        // 'images/cocktail1.jpg',
        // 'images/cocktail2.jpg',
        // и т.д.
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Вызываем предзагрузку при загрузке страницы
window.addEventListener('load', preloadImages);

// Добавляем эффект печатающегося текста для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Применяем эффект печатающегося текста к заголовку при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 500);
    }
    
    // Инициализация истории
    initStory();
});
