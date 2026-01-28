// Обработчик кликов по категориям
/*
function linkToCatalog() {
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // чтобы не переходить сразу по ссылке
        const category = link.dataset.category; // получаем название категории

        // сохраняем в localStorage
        localStorage.setItem('selectedCategory', category);

        // переходим на страницу каталога
        window.location.href = './catalog.html';
    });
});
}; 
*/
// Замените функцию linkToCatalog() на:

function linkToCatalog() {
    const container = document.querySelector('.categoriesList');
    container.addEventListener('click', (e) => {
        if (e.target.matches('.category-link')) {
            e.preventDefault();
            const category = e.target.dataset.category;
            localStorage.setItem('selectedCategory', category);
            window.location.href = './catalog.html';
        }
    });
}



let categories = [];

import { fetchData, categoriesApiLink } from "./config.js";

async function loadData() {
    categories = await fetchData(categoriesApiLink);
}

loadData().then(() => {
    render(categories);
    linkToCatalog();
});




const render = (array) => {
    const categoriesItems = document.querySelector('.categoriesList');
    categoriesItems.innerHTML = ''

    array.forEach((item) => {
        categoriesItems.insertAdjacentHTML('beforeend', `
                <li>
                    <a href="#" class="category-link" data-category="${item.id}">${item.Name}</a>
                 </li>
                `)
    })
}









let headerCategories = [
    {
        id: 0,
        name: 'Все',
        data: '0',
    },
    {
        id: 1,
        name: 'Профилактика',
        data: '1',
    },
    {
        id: 2,
        name: 'Ракушка',
        data: '2',
    },
    {
        id: 3,
        name: 'Соль-лизунец',
        data: '3',
    },
    {
        id: 4,
        name: 'ЗЦМ',
        data: '4',
    },
    {
        id: 5,
        name: 'Премиксы',
        data: '5',
    },
    {
        id: 6,
        name: 'БВМК',
        data: '6',
    },
    {
        id: 7,
        name: 'Комбикорма',
        data: '7',
    },
    {
        id: 8,
        name: 'Трикальцийфосфат',
        data: '8',
    },
    {
        id: 9,
        name: 'Сода пищевая',
        data: '9',
    },
    {
        id: 10,
        name: 'Мел кормовой',
        data: '10',
    }
]