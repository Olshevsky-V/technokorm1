import { fetchData, animalsApiLink } from './config.js'

const slides = document.querySelectorAll('.slide');
const controls = document.querySelectorAll('.slider-btn');
let slideIndex = 0;

function show(index){
    slides[slideIndex].classList.remove('active');
    slides[index].classList.add('active');
    slideIndex = index;
}

controls.forEach((e) => {
    e.addEventListener('click', () => {
        if (event.target.classList.contains('prev-btn')){
            let index = slideIndex - 1;
            if(index < 0) {
                index = slides.length -1;
            }
            show(index)
        } else if (event.target.classList.contains('next-btn')){
            let index = slideIndex + 1;
            if(index >= slides.length) {
                index = 0;
            }
            show(index);
        }
    })
})





const slider = document.querySelector('#slider');
let swipeStartX = 0;

slider.addEventListener('touchstart', (e) => {
  swipeStartX = e.touches[0].clientX
});

slider.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - swipeStartX;

  // Регулярно используем порог в 50px (можно настроить)
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      let index = slideIndex - 1;
            if(index < 0) {
                index = slides.length -1;
            }
            show(index)
    } else {
      let index = slideIndex + 1;
            if(index >= slides.length) {
                index = 0;
            }
            show(index);
    }
  }
  }
);

show(slideIndex);

// Переменная для хранения идентификатора таймера
let autoSwitchIntervalId;

// Функция для запуска автоматического переключения
function startAutoSwitch() {
    // если таймер уже запущен, не запускать заново
    if (autoSwitchIntervalId) return;
    autoSwitchIntervalId = setInterval(() => {
        let next = slideIndex + 1;
        if (next >= slides.length) {
            next = 0;
        }
        show(next);
    }, 3000);
}

// Функция для остановки автоматического переключения
function stopAutoSwitch() {
    clearInterval(autoSwitchIntervalId);
    autoSwitchIntervalId = null; // очистить переменную
}

// Запуск автоматического переключения при загрузке скрипта
startAutoSwitch();

// Навешиваем обработчики на контейнер слайдера
slider.addEventListener('mouseenter', () => {
    stopAutoSwitch();
});
slider.addEventListener('mouseleave', () => {
    startAutoSwitch();
});

function linkToAnimals () {
    document.querySelectorAll('.animal-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // чтобы не переходить сразу по ссылке
    const animal = link.dataset.animal; // получаем название категории

    // сохраняем в localStorage
    localStorage.setItem('selectedAnimal', animal);

    // переходим на страницу каталога
    window.location.href = './catalog.html';
  });
});
}

let animals = [];
async function loadData() {
    animals = await fetchData(animalsApiLink);
}

loadData().then(() => {
    render(animals);
    linkToAnimals();
});

const render = (array) => {
    const animalsBox = document.querySelector('.category-box');
    animalsBox.innerHTML = `
        <h4>Каталог</h4>
        <ul class="categories container"></ul>
    `
    const ul = document.querySelector('.categories')

    array.forEach((item) => {
        ul.insertAdjacentHTML('beforeend', `
                <li class="animal-link" data-animal="${item.Data}" data-dbRender="true">
                        <img src="${item.img}" alt="${item.Data}">
                        <h5>${item.Name}</h5>
                    </li>
                `)
    })
}

