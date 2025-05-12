const eggImage = document.getElementById('egg-image');

const eggImages = [
  'images/full-egg.png',
  'images/crackedegg.png',
  'images/brokenegg.png'
];

let currentIndex = 0;

eggImage.addEventListener('click', () => {
  currentIndex++;

  if (currentIndex <= 1 ) {
    eggImage.src = eggImages[currentIndex];
  } else {
    eggImage.src = eggImages[2];

    document.body.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = 'index.html#generate';
    }, 2000); 
  }
});
