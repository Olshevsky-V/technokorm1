const slides = document.querySelectorAll('.slide');
const controls = document.querySelectorAll('.slider-btn');
let slideIndex = 0;

function show(index){
    slides[slideIndex].classList.remove('active');
    slides[index].classList.add('active');
    slideIndex = index;
}

controls.forEach((e) => {
    e.addEventListener('click', () => {
        if (event.target.classList.contains('prev-btn')){
            let index = slideIndex - 1;
            if(index < 0) {
                index = slides.length -1;
            }
            show(index)
        } else if (event.target.classList.contains('next-btn')){
            let index = slideIndex + 1;
            if(index >= slides.length) {
                index = 0;
            }
            show(index);
        }
    })
})





const slider = document.querySelector('#slider');
let swipeStartX = 0;

slider.addEventListener('touchstart', (e) => {
  swipeStartX = e.touches[0].clientX
});

slider.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - swipeStartX;

  // Регулярно используем порог в 50px (можно настроить)
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      let index = slideIndex - 1;
            if(index < 0) {
                index = slides.length -1;
            }
            show(index)
    } else {
      let index = slideIndex + 1;
            if(index >= slides.length) {
                index = 0;
            }
            show(index);
    }
  }
  }
);

show(slideIndex);





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