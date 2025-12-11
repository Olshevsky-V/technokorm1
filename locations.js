const locationsBox = document.querySelector('.locations-box');

function formatTelNumber(number) {
  // Удаляем все символы кроме цифр и знака "+"
  return number.replace(/[^\d+]/g, '');
}

let locations = [];

fetch("http://u196209.test-handyhost.ru/api/locations")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    locations = data.data;
    render(locations);
  })
  .catch(error => {
    console.error('Ошибка запроса:', error);
  });

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
    ul.insertAdjacentHTML('beforeend', `
      <li>
        <h3>${card.location}</h3>
        <span>${card.addres}</span>
        <br>
        <span>${card.name}</span>
        <a href="tel:${telHref}">${card.tel}</a>
      </li>
    `);
  });
}
