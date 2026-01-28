import { categoriesApiLink, goodsApiLink, locationsApiLink } from './config.js';


// api.js
let fetchGoods = [];
let fetchLocations = [];
let fetchCategories = [];
let isLoaded = false;

export const loadData = async () => {
  if (!isLoaded) {
    try {
      const [dataGoods, dataLocations, dataCategories] = await Promise.all([
        fetch(goodsApiLink).then(res => res.json()),
        fetch(locationsApiLink).then(res => res.json()),
        fetch(categoriesApiLink).then(res => res.json())
      ]);
      console.log('API categories:', dataCategories); // Проверяем ответ
      fetchCategories = dataCategories;
      fetchGoods = dataGoods;
      fetchLocations = dataLocations;
      isLoaded = true;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }
};

// Для получения данных после загрузки
export const getGoods = () => {
  if (!isLoaded) throw new Error('Данные еще не загружены');
  return fetchGoods;
};

export const getLocations = () => {
  if (!isLoaded) throw new Error('Данные еще не загружены');
  return fetchLocations;
};

export const getCategories = () => {
  if (!isLoaded) throw new Error('Данные еще не загружены');
  return fetchCategories;
};

/*

Вот это добавить в файл вызывающий массив

import { loadData, getArray1, getArray2 } from './apiRequests.js';

async function init() {
  await loadData(); // ждем загрузки данных
  const array1 = getArray1(); // уже готовый массив
  const array2 = getArray2();
  
  console.log(array1);
  console.log(array2);
  
  // дальше работайте с массивами
}

init();
*/