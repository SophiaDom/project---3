// Handle Scroll Lock and Position Management
let scrollUnlocked = false;

const returningFromEgg = window.location.hash === '#generate';
const unlockBtn = document.getElementById('unlock-scroll-btn');

const minScrollLimit = 0; // Start from 0vw
const maxScrollLimit = window.innerWidth * 3; // 300vw
const showUnlockMin = window.innerWidth * 3;
const showUnlockMax = window.innerWidth * 4;
const maxScrollPosition = maxScrollLimit;

const handleScrollLock = () => {
    const scrollLeft = window.scrollX;

    if (returningFromEgg && !scrollUnlocked) {
        if (scrollLeft > maxScrollLimit) {
            window.scrollTo({ left: maxScrollLimit, behavior: 'smooth' });
        } else if (scrollLeft < minScrollLimit) {
            window.scrollTo({ left: minScrollLimit, behavior: 'smooth' });
        }
    }

    if (scrollLeft >= showUnlockMin && scrollLeft <= showUnlockMax) {
        unlockBtn.style.display = 'block';
    } else {
        unlockBtn.style.display = 'none';
    }
};

window.addEventListener('scroll', handleScrollLock);

const adjustScrollPosition = (position) => {
    const clampedPosition = Math.min(Math.max(position, minScrollLimit), maxScrollPosition);
    window.scrollTo({ left: clampedPosition, behavior: 'smooth' });
};

window.addEventListener('load', () => {
    window.scrollTo({ left: minScrollLimit });


    const storedPosition = getStoredScrollPosition();
    if (storedPosition) {
        setTimeout(() => adjustScrollPosition(storedPosition), 50);
        sessionStorage.removeItem('scrollPosition');
    }

    if (returningFromEgg) {
        window.scrollTo({ left: minScrollLimit });
    }

    // Force scroll restriction on load
    handleScrollLock();

    // Restore inputs if returning
    const savedData = JSON.parse(sessionStorage.getItem('userSubmission'));
    if (savedData) {
        document.getElementById('datetime').value = savedData.timestamp;
        const colorInputs = document.querySelectorAll('.color-input');
        savedData.colors.forEach((color, index) => {
            if (colorInputs[index]) colorInputs[index].value = color;
        });
        const patternSelects = document.querySelectorAll('.patterns select');
        savedData.patterns.forEach((pattern, index) => {
            if (patternSelects[index]) patternSelects[index].value = pattern;
        });
    }
});





// Title generation
const createStaggeredTitle = (text, index, delayStep = 2.5) => {
    const h1 = document.createElement('h1');
    h1.textContent = text;
    h1.className = 'text title';
    if (index === 0) h1.classList.add('first-title');
    h1.style.position = 'fixed';
    h1.style.top = index === 0 ? '8vh' : `${Math.floor(Math.random() * 95)}vh`;
    h1.style.left = index === 0 ? '10vw' : `${Math.floor(Math.random() * 95)}vw`;
    h1.style.height = '0';
    h1.style.overflow = 'hidden';
    h1.style.writingMode = Math.random() < 0.5 ? 'vertical-rl' : 'horizontal-tb';
    if (h1.style.writingMode === 'horizontal-tb') h1.style.letterSpacing = '1em';
    document.querySelector('.titlepage').appendChild(h1);

    setTimeout(() => {
        h1.style.animation = `typewriter-${h1.style.writingMode === 'vertical-rl' ? 'vertical' : 'horizontal'} 3.5s ease forwards`;
        h1.style.height = '9em';
    }, index * delayStep * 500);
};

for (let i = 0; i < 100; i++) {
    setTimeout(() => createStaggeredTitle('HATCHED', i), i * 500);
}

// Frost scroll visual effect
window.addEventListener('scroll', () => {
    const frost = document.querySelector('.frost');
    const scrollLeft = window.scrollX;
    const progress = Math.min((scrollLeft - (window.innerWidth / 4)) / (window.innerWidth / 2), 1);
    frost.style.backgroundColor = `rgba(255, 255, 255, ${progress * 0.8})`;
    frost.style.backdropFilter = frost.style.webkitBackdropFilter = `blur(${progress * 3}px)`;
});

// Generate inputs
const generateColorInputs = () => {
    const colorsContainer = document.querySelector('.colors');
    for (let i = 0; i < 6; i++) {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.classList.add('color-input');
        colorInput.value = '#BBB730';
        colorsContainer.appendChild(colorInput);
    }
};

const generatePatterns = () => {
    const patternsContainer = document.querySelector('.patterns');
    const patternsOptions = [
        "Hatching", "Cross Hatching", "Right Leaning", "Left Leaning",
        "Dashed Vertical", "Dashed Horizontal", "Ripple Vertical", "Ripple Horizontal",
        "X's", "Dotted", "Zig-Zag", "Radial", "Random"
    ];
    for (let i = 0; i < 6; i++) {
        const select = document.createElement('select');
        patternsOptions.forEach(pattern => {
            const option = document.createElement('option');
            option.value = pattern.toLowerCase().replace(/\s+/g, '-');
            option.textContent = pattern;
            select.appendChild(option);
        });
        patternsContainer.appendChild(select);
    }
};

generateColorInputs();
generatePatterns();

// --- Overlay and Egg Crack Animation ---
const eggLoading = document.querySelector('.egg-loading');
const eggImage = document.getElementById('egg-image');
const form = document.getElementById('submission-form');
const generateSection = document.querySelector('.generate');


const eggImages = [
    'images/full-egg.png',
    'images/crackedegg.png',
    'images/brokenegg.png'
];
let currentIndex = 0;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Change body width to 400vw
    document.body.style.width = '400vw';

    // Unlock scroll and set scroll position
    scrollUnlocked = true;
    setScrollPosition(window.scrollX);

    const dateTime = document.getElementById('datetime').value;
    const colorInputs = Array.from(document.querySelectorAll('.color-input'));
    const colorValues = colorInputs.map(input => input.value);
    const patternSelects = Array.from(document.querySelectorAll('.patterns select'));
    const patternValues = patternSelects.map(select => select.value);

    const userData = {
        timestamp: dateTime,
        colors: colorValues,
        patterns: patternValues
    };

    sessionStorage.setItem('userSubmission', JSON.stringify(userData));

    // Show egg overlay
    eggLoading.style.display = 'flex';
    eggImage.src = eggImages[0];
    currentIndex = 0;
    document.body.style.overflow = 'hidden';
});

eggImage.addEventListener('click', () => {
    currentIndex++;

    if (currentIndex < eggImages.length) {
        eggImage.src = eggImages[currentIndex];
    }

    if (currentIndex === eggImages.length - 1) {
        document.body.classList.add('fade-out');

        setTimeout(() => {
            eggLoading.style.display = 'none';
            document.body.classList.remove('fade-out');
            document.body.style.overflow = 'auto';

            scrollUnlocked = true;
            window.removeEventListener('scroll', handleScrollLock);

            const generateSection = document.getElementById('generate');
            generateSection.scrollIntoView({ behavior: 'instant' }); // Smooth scroll to #generate
        }, 0);

    }
});




form.addEventListener('submit', (e) => {
    e.preventDefault();

    generateSection.style.display = 'block';
    eggLoading.style.display = 'flex';

    const dateTime = document.getElementById('datetime').value;

    console.log("Submitted date and time:", dateTime);

    new p5(createCanvasSketch);

});


window.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const egg = document.querySelector(".inside-menu-egg");
  
    // Show the sidebar on page load
    sidebar.classList.add("visible");
  
    // Hide the sidebar when the egg image is clicked
    egg.addEventListener("click", () => {
      sidebar.classList.remove("visible");
    });
  });
  

  document.querySelector('.outside-menu-egg').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('sidebar-open');
  });
  document.querySelector('.inside-menu-egg').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('sidebar-open');
  });