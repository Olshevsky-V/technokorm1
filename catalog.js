import { goodsApiLink, animalsApiLink, categoriesApiLink, imagesApiLink } from './config.js';

const catalog = document.querySelector('.catalog-goods-container');
const filters = document.querySelector('#filters');
const catalogCategory = document.querySelector('.catalog-category');
const catalogGoods = document.querySelector('.catalog-goods');
const categoriesFilter = document.querySelector('#categoriesFilter');
const animalsFilter = document.querySelector('#animalsFilter');

let goods = [];
let categories = [];
let animals = [];

// Универсальная функция загрузки с обработкой обертки API
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

// Загрузка всех данных
async function loadData() {
    try {
        // Загружаем все данные параллельно
        const [goodsData, categoriesData, animalsData] = await Promise.all([
            fetchWithWrapper(goodsApiLink),
            fetchWithWrapper(categoriesApiLink),
            fetchWithWrapper(animalsApiLink)
        ]);
        
        goods = goodsData;
        categories = categoriesData;
        animals = animalsData;
        
        console.log('Загруженные товары:', goods);
        console.log('Загруженные категории:', categories);
        console.log('Загруженные теги (animals):', animals);
        
        // Нормализуем теги в товарах
        if (Array.isArray(goods)) {
            goods = goods.map(card => {
                // Обрабатываем tags
                if (card.tags) {
                    if (typeof card.tags === 'string') {
                        try {
                            card.tags = JSON.parse(card.tags);
                        } catch {
                            card.tags = [];
                        }
                    }
                    if (!Array.isArray(card.tags)) {
                        card.tags = [];
                    }
                } else {
                    card.tags = [];
                }
                
                // Обрабатываем categories
                if (card.categories) {
                    if (typeof card.categories === 'string') {
                        try {
                            card.categories = JSON.parse(card.categories);
                        } catch {
                            card.categories = [];
                        }
                    }
                    if (!Array.isArray(card.categories)) {
                        card.categories = [];
                    }
                } else {
                    card.categories = [];
                }
                
                return card;
            });
        } else {
            goods = [];
        }
        
        // Рендерим всё после загрузки
        filtersRender();
        firstFilter();
        applyFilters();
        filtersUpdate();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

function filtersRender() {
    renderCategories(categories);
    renderAnimals(animals);
}

function renderGoods(array) {
    if (!catalog) return;
    
    catalog.innerHTML = '';

    if (!array || array.length === 0) {
        catalog.insertAdjacentHTML('beforeend', `
            <div class="goods-item">
                <a href="#">
                    <div class="good-item-img">
                        <img src="./img/latest-placeholder.png" alt="placeholder">
                    </div>
                    <h5>Нет товаров</h5>
                    <span class="categories"></span>
                    <span class="animaltypes"></span>
                </a>
            </div>
        `);
        return;
    }

    array.forEach((card) => {
        // Преобразуем ID категорий в названия
        const categoryNames = Array.isArray(card.categories) 
            ? card.categories
                .map(catId => {
                    if (catId === 0) return 'Без категории';
                    const category = categories.find(c => c.id === catId || c.Id === catId);
                    return category ? (category.name || category.Name || catId) : catId;
                })
                .filter(Boolean)
            : [];

        catalog.insertAdjacentHTML('beforeend', `
            <div class="goods-item" data-dbRender="true">
                <a href="#">
                    <div class="good-item-img">
                        <img src="${imagesApiLink}/${card.image || 'https://placehold.net/600x600.png'}" alt="${card.name || ''}" onerror="this.src='./img/latest-placeholder.png'">
                    </div>
                    <h5>${card.name || 'Без названия'}</h5>
                    <span class="categories">${categoryNames.join(', ') || 'Без категории'}</span>
                    <span class="animaltypes">${Array.isArray(card.tags) ? card.tags.join(', ') : ''}</span>     
                </a>
            </div>
        `);
    });
}

// ИСПРАВЛЕНО: убираем дублирование "Все"
function renderCategories(array) {
    if (!categoriesFilter) return;
    
    // Очищаем и добавляем ТОЛЬКО ОДИН пункт "Все"
    categoriesFilter.innerHTML = '<li class="categoryItem active" data-id="0">Все</li>';

    if (Array.isArray(array)) {
        array.forEach((item) => {
            const id = item.id || item.Id || 0;
            const name = item.name || item.Name || 'Без названия';
            
            // НЕ добавляем если это уже пункт "Все" (id=0)
            if (id !== 0) {
                categoriesFilter.insertAdjacentHTML('beforeend', `
                    <li class="categoryItem" data-id="${id}">${name}</li>
                `);
            }
        });
    }
}

// ИСПРАВЛЕНО: убираем дублирование "Для всех"
function renderAnimals(array) {
    if (!animalsFilter) return;
    
    // Очищаем и добавляем ТОЛЬКО ОДИН пункт "Для всех"
    animalsFilter.innerHTML = '<li class="animalItem active" data-id="all">Для всех</li>';

    if (Array.isArray(array)) {
        array.forEach((item) => {
            // Для тегов может быть разная структура
            const id = item.data || item.Data || item.id || item;
            const name = item.name || item.Name || item;
            
            // НЕ добавляем если это уже пункт "all"
            if (id !== 'all') {
                animalsFilter.insertAdjacentHTML('beforeend', `
                    <li class="animalItem" data-id="${id}">${name}</li>
                `);
            }
        });
    }
}

let currentAnimal = 'all';
let currentCategory = 0;

function firstFilter() {
    const categoryItems = document.querySelectorAll('.categoryItem');
    const animalItems = document.querySelectorAll('.animalItem');
    
    currentAnimal = localStorage.getItem('selectedAnimal') || 'all';
    currentCategory = parseInt(localStorage.getItem('selectedCategory')) || 0;

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

function applyFilters() {
    if (!Array.isArray(goods)) return;
    
    let filtered = goods.slice();

    if (currentCategory && currentCategory !== 0) {
        filtered = filtered.filter(card => 
            Array.isArray(card.categories) && card.categories.includes(currentCategory)
        );
    }

    if (currentAnimal && currentAnimal !== 'all') {
        filtered = filtered.filter(card => 
            Array.isArray(card.tags) && card.tags.includes(currentAnimal)
        );
    }

    renderGoods(filtered);
}

function filtersUpdate() {
    const categoryItems = document.querySelectorAll('.categoryItem');
    const animalItems = document.querySelectorAll('.animalItem');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = parseInt(item.dataset.id);
            applyFilters();
        });
    });

    animalItems.forEach(item => {
        item.addEventListener('click', () => {
            animalItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentAnimal = item.dataset.id;
            applyFilters();
        });
    });

    if (filters) {
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
        });
    }
}

// Запускаем загрузку
loadData();