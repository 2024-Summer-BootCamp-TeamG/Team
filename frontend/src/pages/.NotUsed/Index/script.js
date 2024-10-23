const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');

class Carousel {
  constructor(container, items, controls) {
    this.carouselContainer = container;
    this.carouselControls = controls;
    this.carouselArray = [...items];
    this.currentItem = 0; // 현재 항목을 추적하기 위해 추가
  }

  updateGallery() {
    this.carouselArray.forEach((el, i) => {
      el.style.order =
        this.currentItem === i
          ? 0
          : i > this.currentItem
            ? i - this.currentItem
            : i - this.currentItem + this.carouselArray.length;
      el.className = el.className.replace(
        /gallery-item-\d/,
        `gallery-item-${((i + 1) % this.carouselArray.length) + 1}`,
      );
    });
  }

  setCurrentState(direction) {
    if (direction.className.includes('gallery-controls-previous')) {
      this.carouselArray.unshift(this.carouselArray.pop());
    } else {
      this.carouselArray.push(this.carouselArray.shift());
    }
    this.updateGallery();
  }

  setControls() {
    this.carouselControls.forEach((control) => {
      const button = document.createElement('button');
      button.className = `gallery-controls-${control}`;
      button.innerText = control;
      galleryControlsContainer.appendChild(button);
    });
  }

  useControls() {
    const triggers = [...galleryControlsContainer.children];
    triggers.forEach((control) => {
      control.addEventListener('click', (e) => {
        e.preventDefault();
        this.setCurrentState(control);
      });
    });
  }
}

const exampleCarousel = new Carousel(
  galleryContainer,
  galleryItems,
  galleryControls,
);

exampleCarousel.setControls();
exampleCarousel.useControls();
