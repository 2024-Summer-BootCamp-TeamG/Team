useEffect(() => {
  if (!showDetail) {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryControlsContainer =
      document.querySelector('.gallery-controls');
    const galleryControls = ['이전', '다음'];
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryContainer && galleryControlsContainer) {
      class Carousel {
        carouselContainer: Element;
        carouselControls: string[];
        carouselArray: HTMLElement[];
        currentItem: number;

        constructor(
          container: Element,
          items: NodeListOf<Element>,
          controls: string[],
        ) {
          this.carouselContainer = container;
          this.carouselControls = controls;
          this.carouselArray = Array.from(items) as HTMLElement[];
          this.currentItem = 0;
        }

        updateGallery() {
          this.carouselArray.forEach((el, i) => {
            el.style.order =
              ((i - this.currentItem + this.carouselArray.length) %
                this.carouselArray.length) +
              '';
            el.className = el.className.replace(
              /gallery-item-\d/,
              `gallery-item-${((i - this.currentItem + this.carouselArray.length) % this.carouselArray.length) + 1}`,
            );
          });
        }

        setCurrentState(direction: Element) {
          if (direction.className.includes('gallery-controls-previous')) {
            this.currentItem =
              (this.currentItem - 1 + this.carouselArray.length) %
              this.carouselArray.length;
          } else if (direction.className.includes('gallery-controls-next')) {
            this.currentItem =
              (this.currentItem + 1) % this.carouselArray.length;
          }
          this.updateGallery();
        }

        setControls() {
          // 클린업 함수
          galleryControlsContainer.innerHTML = '';

          this.carouselControls.forEach((control) => {
            const button = document.createElement('button');
            button.className = `gallery-controls-${control === '이전' ? 'previous' : 'next'}`;
            button.innerText = control;
            galleryControlsContainer.appendChild(button);
          });
        }

        useControls() {
          const triggers = Array.from(galleryControlsContainer?.children || []);
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
    }
  }
}, [showDetail, selectedItem]);
