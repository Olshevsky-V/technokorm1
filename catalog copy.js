import { goodsApiLink } from './config.js';

const catalog = document.querySelector('.catalog-goods-container');
// Получаем все фильтры
const categoryItems = document.querySelectorAll('.categoryItem');
const animalItems = document.querySelectorAll('.animalItem');
const filters = document.querySelector('#filters');
const catalogCategory = document.querySelector('.catalog-category');
const catalogGoods = document.querySelector('.catalog-goods');


/*категории: 
Все - 0
Профилактика - 1
Ракушка - 2
Соль-лизунец - 3
ЗЦМ - 4
Премиксы - 5
БВМК - 6
Комбикорма - 7
Трикальцийфосфат - 8
Сода пищевая - 9
Мел кормовой - 10

все - all
КРС - cattle
Лошадь - horse 
Свинья - pig
Птица - bird

*/
let goods = [];

function fetchGoods() {
  fetch(goodsApiLink)
    .then(response => response.json())
    .then(data => {
      goods = data.data ? data.data : data;

      // Преобразование данных
      goods = goods.map(card => {
        ['categories', 'animalTypes'].forEach(field => {
          if (typeof card[field] === 'string') {
            try {
              card[field] = JSON.parse(card[field]);
            } catch {
              card[field] = [];
            }
          }
        });
        return card;
      });

      firstFilter();        // восстанавливаем текущий фильтр
      applyFilters();       // фильтруем товары
    })
    .catch(console.error);
}

fetchGoods();


const render = (array) => {
    catalog.innerHTML = ''

    array.forEach((card) => {
        catalog.insertAdjacentHTML('beforeend', `
            <div class="goods-item" data-dbRender="true">
                    <a href="${card.link}">
                        <div class="good-item-img">
                            <img src="${card.img}" alt="${card.title}">
                        </div>
                        <h5>${card.title}</h5>
                        <span class="categories">${card.categories.join(', ')}</span>
                        <span class="animaltypes">${card.animalTypes.join(', ')}</span>     
                    </a>
                </div>
                `)
    })
}


let currentAnimal = 'all';
let currentCategory = 0;

function firstFilter() {
  currentAnimal = localStorage.getItem('selectedAnimal');

  currentCategory = localStorage.getItem('selectedCategory');
  // Если значение в localStorage отсутствует, или равно null
  if (currentCategory === null) {
    // Можно оставить текущий `currentCategory` равным 0 по умолчанию
    currentCategory = 0;
  } else {
    // Значение из localStorage — строка, нужно привести к числу
    currentCategory = parseInt(currentCategory);
  }
  
  if (currentAnimal === null) {
    currentAnimal = "all";
  }else{
    currentAnimal = currentAnimal
  }

  // Обнуляем активные классы у категорий и животных
  categoryItems.forEach(i => i.classList.remove('active'));
  animalItems.forEach(i => i.classList.remove('active'));

  // Устанавливаем активный элемент категории, если есть
  categoryItems.forEach(i => {
    if (parseInt(i.dataset.id) === currentCategory) {
      i.classList.add('active');
    }
  });

  // аналогично для животных
  animalItems.forEach(i => {
      if (i.dataset.id === currentAnimal) {
        i.classList.add('active');
      }
    });
  

  localStorage.removeItem('selectedAnimal');
  localStorage.removeItem('selectedCategory');
}


function applyFilters() {
  let filtered = goods.slice();

  if (currentCategory && currentCategory !== 0) {
    filtered = filtered.filter(card => card.categories.includes(currentCategory));
  }

  if (currentAnimal && currentAnimal !== 'all') {
    filtered = filtered.filter(card => card.animalTypes.includes(currentAnimal));
  }

  render(filtered);
}

// Обработчики для категорий
categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    // Убираем class active у всех
    categoryItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Обновляем текущий фильтр
    currentCategory = parseInt(item.dataset.id);
    applyFilters();
  });
});

// Обработчики для видов животных
animalItems.forEach(item => {
  item.addEventListener('click', () => {
    animalItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    currentAnimal = item.dataset.id;
    applyFilters();
  });
});

filters.addEventListener('click', () => {
    if (catalogCategory.classList.contains('active')) {
        catalogCategory.classList.remove('active');
        catalogGoods.classList.add('active');
        filters.classList.remove('active');
    } else {
        catalogCategory.classList.add('active');
        catalogGoods.classList.remove('active');
        filters.classList.add('active');
    }
})

