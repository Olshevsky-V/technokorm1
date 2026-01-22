// Обработчик кликов по категориям
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