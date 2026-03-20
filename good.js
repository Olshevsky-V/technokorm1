import { animalsApiLink, categoriesApiLink, goodsApiLink, imagesApiLink } from './config.js';

// Элементы каталога (могут отсутствовать на странице товара)
const catalog = document.querySelector('.catalog-goods-container');
const filters = document.querySelector('#filters');
const catalogCategory = document.querySelector('.catalog-category');
const catalogGoods = document.querySelector('.catalog-goods');
const categoriesFilter = document.querySelector('#categoriesFilter');
const animalsFilter = document.querySelector('#animalsFilter');

let categories = [];
let animals = [];
let goods = [];

// КОПИРУЕМ fetchWithWrapper ИЗ catalog.js
async function fetchWithWrapper(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        console.log(`Ответ от ${url}:`, data);
        
        // Если ответ в формате {success: true, data: [...]}
        if (data && typeof data === 'object' && 'data' in data) {
            return data.data;
        }
        
        // Если ответ уже массив
        if (Array.isArray(data)) {
            return data;
        }
        
        return [];
        
    } catch (error) {
        console.error(`Ошибка загрузки ${url}:`, error);
        return [];
    }
}

async function loadData() {
    try {
        // Загружаем все данные параллельно (используем fetchWithWrapper!)
        const [categoriesData, animalsData, goodsData] = await Promise.all([
            fetchWithWrapper(categoriesApiLink),
            fetchWithWrapper(animalsApiLink),
            fetchWithWrapper(goodsApiLink)
        ]);
        
        categories = categoriesData;
        animals = animalsData;
        goods = goodsData;
        
        console.log('Загруженные категории:', categories);
        console.log('Загруженные теги (animals):', animals);
        console.log('Загруженные товары:', goods);
        
        // Получаем ID из URL и рендерим карточку
        const goodId = getGoodIdFromUrl();
        
        if (goodId) {
            renderGoodCard(goodId);
        }

        if (categoriesFilter || animalsFilter) {
                filtersRender();
                firstFilter();
                linkToCatalog();
            }
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const container = document.querySelector('.good-container');
        if (container) {
            container.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
        }
    }
}

function filtersRender() {
    renderCategories(categories);
    renderAnimals(animals);
}

function renderCategories(array) {
    if (!categoriesFilter) return;
    
    categoriesFilter.innerHTML = '<li class="categoryItem active" data-id="1">Все</li>';

    if (Array.isArray(array)) {
        array.forEach((item) => {
            const id = item.id || item.Id || 0;
            const name = item.name || item.Name || 'Без названия';
            
            if (id !== 1) {
                categoriesFilter.insertAdjacentHTML('beforeend', `
                    <li class="categoryItem" data-id="${id}">${escapeHtml(name)}</li>
                `);
            }
        });
    }
}

function renderAnimals(array) {
    if (!animalsFilter) return;
    
    animalsFilter.innerHTML = '<li class="animalItem active" data-id="all">Для всех</li>';

    if (Array.isArray(array)) {
        array.forEach((item) => {
            const id = item.data || item.Data || item.id || item;
            const name = item.name || item.Name || item;
            
            if (id !== 'all') {
                animalsFilter.insertAdjacentHTML('beforeend', `
                    <li class="animalItem" data-id="${id}">${escapeHtml(name)}</li>
                `);
            }
        });
    }
}

function getGoodIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Функция рендеринга карточки товара
function renderGoodCard(goodId) {
    const container = document.querySelector('.good-container');
    
    if (!container) {
        console.log('Контейнер .good-container не найден');
        return;
    }
    
    // Ищем товар по ID (goods теперь массив!)
    const good = goods.find(g => g.id == goodId);
    
    console.log('Ищем товар с ID:', goodId);
    console.log('Доступные товары:', goods);
    
    if (!good) {
        container.innerHTML = '<p class="error">Товар не найден</p>';
        return;
    }
    
    // Рендерим карточку
    container.innerHTML = `
        <div class="good-header">
            <div class="good-header--text">
                <h3>${escapeHtml(good.name)}</h3>
                <p>${escapeHtml(good.description)}</p>
            </div>
            <img src="${imagesApiLink}/${good.image || './img/placeholder.png'}" 
                 alt="${escapeHtml(good.name)}" 
                 style="max-width: 300px; max-height: 300px;">
        </div>
        <div class="good-content">
            ${escapeHtml(good.content)}
        </div>
    `;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let currentAnimal = 'all';
let currentCategory = 1;

function firstFilter() {
    const categoryItems = document.querySelectorAll('.categoryItem');
    const animalItems = document.querySelectorAll('.animalItem');
    
    if (categoryItems.length === 0 && animalItems.length === 0) return;
    
    currentAnimal = localStorage.getItem('selectedAnimal') || 'all';
    currentCategory = parseInt(localStorage.getItem('selectedCategory')) || 1;

    categoryItems.forEach(i => i.classList.remove('active'));
    animalItems.forEach(i => i.classList.remove('active'));

    categoryItems.forEach(i => {
        if (parseInt(i.dataset.id) === currentCategory) {
            i.classList.add('active');
        }
    });

    animalItems.forEach(i => {
        if (i.dataset.id === currentAnimal) {
            i.classList.add('active');
        }
    });

    localStorage.removeItem('selectedAnimal');
    localStorage.removeItem('selectedCategory');
}

function linkToCatalog() {
    if (categoriesFilter) {
        categoriesFilter.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.categoryItem');
            if (categoryItem) {
                e.preventDefault();
                const categoryId = categoryItem.dataset.id;
                localStorage.setItem('selectedCategory', categoryId);
                window.location.href = './catalog.html';
            }
        });
    }
    
    if (animalsFilter) {
        animalsFilter.addEventListener('click', (e) => {
            const animalItem = e.target.closest('.animalItem');
            if (animalItem) {
                e.preventDefault();
                const animalId = animalItem.dataset.id;
                localStorage.setItem('selectedAnimal', animalId);
                window.location.href = './catalog.html';
            }
        });
    }
}

loadData();