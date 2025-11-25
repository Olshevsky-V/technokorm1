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
Соль пищевая - 9
Мел кормовой - 10

все - all
КРС - cattle
Лошадь - horse 
Свинья - pig
Птица - bird

*/

const goods = [
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

if (localStorage.getItem('selectedCategory')) {
    window.addEventListener('load', () => {
        const category = parseInt(localStorage.getItem('selectedCategory'));
        let filteredGoods;
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.id) === category) {
                item.classList.add('active');
            }
        })

        if (category) {
            filteredGoods = goods.filter(card => card.categories.includes(category));
        }
        render(filteredGoods);
        localStorage.clear('selectedCategory');
    });
}

if (localStorage.getItem('selectedAnimal')) {
    window.addEventListener('load', () => {
        const animal = localStorage.getItem('selectedAnimal');
        let filteredGoods;
        animalItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === animal) {
                item.classList.add('active');
            }
        })

        if (animal) {
            filteredGoods = goods.filter(card => card.animalTypes.includes(animal));
        }
        render(filteredGoods);
        localStorage.clear('selectedAnimal');
    });
}




// Обработчик для категорий
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Убираем класс active у всех
        categoryItems.forEach(i => i.classList.remove('active'));
        // Добавляем класс active к выбранному
        item.classList.add('active');

        const categoryId = parseInt(item.dataset.id);
        let filteredGoods;
        if (categoryId === 0) {
            filteredGoods = goods; // все товары
        } else {
            filteredGoods = goods.filter(card => card.categories.includes(categoryId));
        }
        render(filteredGoods);
    });
});

// Обработчик для видов животных
animalItems.forEach(item => {
    item.addEventListener('click', () => {
        // Убираем класс active у всех
        animalItems.forEach(i => i.classList.remove('active'));
        // Добавляем класс актив к выбранному
        item.classList.add('active');

        const animalType = item.dataset.id; // например, 'cattle' или 'all'
        let filteredGoods;
        if (animalType === 'all') {
            filteredGoods = goods; // все товары
        } else {
            filteredGoods = goods.filter(card => card.animalTypes.includes(animalType));
        }
        render(filteredGoods);
    });
});

render(goods);

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
