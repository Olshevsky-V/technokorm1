const catalog = document.querySelector('.catalog-goods-container');
// Получаем все фильтры
const categoryItems = document.querySelectorAll('.categoryItem');
const animalItems = document.querySelectorAll('.animalItem');
const filters = document.querySelector('#filters');
const catalogCategory = document.querySelector('.catalog-category');
const catalogGoods = document.querySelector('.catalog-goods');

import { goodsApiLink } from './config.js';
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
/* let goods = [];

fetch("http://vlad.artyfakt.ru/api/goods")
  .then(response => response.json())
  .then(data => {
    goods = data.data ? data.data : data;

    if (!Array.isArray(goods)) {
      console.error('Goods is not an array:', goods);
      return;
    }

    // Делаем преобразование прямо тут:
    goods = goods.map(card => {
      // Для каждого свойства categories и animalTypes:
      ['categories', 'animalTypes'].forEach(field => {
        if (typeof card[field] === 'string') {
          try {
            card[field] = JSON.parse(card[field]);
          } catch {
            card[field] = []; // Если ошибка парсинга — ставим пустой массив
            console.error(`Error parsing ${field} for card id ${card.id}`);
          }
        }
      });
      return card;
    });

    render(goods);
  })
  .catch(console.error);
  */


/* const goods = [
    {
        id: 0,
        title: 'какое-то название',
        categories: [0, 1],
        animalTypes: ['all', 'cattle'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 1,
        title: 'какое-то название 1',
        categories: [0, 3],
        animalTypes: ['all', 'cattle'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 2,
        title: 'какое-то название 2',
        categories: [0, 1],
        animalTypes: ['all', 'horse'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 3,
        title: 'какое-то название 3',
        categories: [0, 3],
        animalTypes: ['all', 'cattle'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 4,
        title: 'какое-то название 4',
        categories: [0, 7],
        animalTypes: ['all', 'pig'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 5,
        title: 'какое-то название 5',
        categories: [0, 9],
        animalTypes: ['all', 'bird'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 6,
        title: 'какое-то название 6',
        categories: [0, 4],
        animalTypes: ['all', 'horse'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 7,
        title: 'какое-то название 7',
        categories: [0, 3],
        animalTypes: ['all', 'cattle'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 8,
        title: 'какое-то название 8',
        categories: [0, 8],
        animalTypes: ['all', 'horse'],
        link: '#',
        img: './img/latest-placeholder.png'
    },
    {
        id: 9,
        title: 'какое-то название 9',
        categories: [0, 9],
        animalTypes: ['all', 'cattle'],
        link: '#',
        img: './img/latest-placeholder.png'
    }
];
*/

const render = (array) => {
    catalog.innerHTML = ''

    array.forEach((card) => {
        catalog.insertAdjacentHTML('beforeend', `
            <div class="goods-item">
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
  if (currentAnimal) {
    animalItems.forEach(i => {
      if (i.dataset.id === currentAnimal) {
        i.classList.add('active');
      }
    });
  }

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

