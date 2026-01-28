const locationsBox = document.querySelector('.locations-box');
import { fetchData, locationsApiLink } from './config.js';

function formatTelNumber(number) {
  // Удаляем все символы кроме цифр и знака "+"
  return number.replace(/[^\d+]/g, '');
}

let locations = [];

async function loadData() {
    locations = await fetchData(locationsApiLink);
}

loadData().then(() => {
    render(locations);
});

/* fetch(locationsApiLink)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    locations = data.data;
    render(locations);
  })
  .catch(error => {
    console.error('Ошибка запроса:', error);
  });
  */

// функция для отображения
const render = (array) => {
  // оборачиваем в блок с заголовком и списком
  locationsBox.innerHTML = `
    <h2>Где купить</h2>
    <ul class="locations-list"></ul>
  `;

  // находим <ul> внутри
  const ul = locationsBox.querySelector('.locations-list');

  array.forEach((card) => {
    const telRaw = card.tel; 
    const telHref = formatTelNumber(telRaw);
    // Создаем переменные для полей, учитывая null
    const locationHTML = card.location ? `<h3>${card.location}</h3>` : '';
    const addressHTML = card.addres ? `<span>${card.addres}</span>` : '';
    const nameHTML = card.name ? `<span>${card.name}</span>` : '';

    // Вставляем только непустые части
    ul.insertAdjacentHTML('beforeend', `
      <li>
        ${locationHTML}
        ${addressHTML}
        ${nameHTML}
        <a href="tel:${telHref}">${card.tel}</a>
      </li>
    `);
  });
}
