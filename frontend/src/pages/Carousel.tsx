// import { useEffect } from 'react';
// import Background from '../components/Background';
// import Album from '../assets/Album.png';
// import '../pages/Index/style.css';

// function CarouselPage() {
//   useEffect(() => {
//     const galleryContainer = document.querySelector(
//       '.gallery-container',
//     ) as HTMLElement;
//     const galleryControlsContainer = document.querySelector(
//       '.gallery-controls',
//     ) as HTMLElement;
//     const galleryControls = ['이전', '다음'];
//     const galleryItems = document.querySelectorAll(
//       '.gallery-item',
//     ) as NodeListOf<HTMLElement>;

//     class Carousel {
//       private carouselContainer: HTMLElement;
//       private carouselControls: string[];
//       private carouselArray: HTMLElement[];
//       private currentItem: number;

//       constructor(
//         container: HTMLElement,
//         items: NodeListOf<HTMLElement>,
//         controls: string[],
//       ) {
//         this.carouselContainer = container;
//         this.carouselControls = controls;
//         this.carouselArray = [...items];
//         this.currentItem = 0;
//       }

//       private updateGallery(): void {
//         this.carouselArray.forEach((el, i) => {
//           el.style.order =
//             ((i - this.currentItem + this.carouselArray.length) %
//               this.carouselArray.length) +
//             '';
//           el.className = el.className.replace(
//             /gallery-item-\d/,
//             `gallery-item-${((i - this.currentItem + this.carouselArray.length) % this.carouselArray.length) + 1}`,
//           );
//         });
//       }

//       private setCurrentState(direction: HTMLElement): void {
//         if (direction.className.includes('gallery-controls-previous')) {
//           this.currentItem =
//             (this.currentItem - 1 + this.carouselArray.length) %
//             this.carouselArray.length;
//         } else if (direction.className.includes('gallery-controls-next')) {
//           this.currentItem = (this.currentItem + 1) % this.carouselArray.length;
//         }
//         this.updateGallery();
//       }

//       public setControls(): void {
//         this.carouselControls.forEach((control) => {
//           const button = document.createElement('button');
//           button.className = `gallery-controls-${control === '이전' ? 'previous' : 'next'}`;
//           button.innerText = control;
//           galleryControlsContainer.appendChild(button);
//         });
//       }

//       public useControls(): void {
//         const triggers = [...galleryControlsContainer.children];
//         triggers.forEach((control) => {
//           control.addEventListener('click', (e) => {
//             e.preventDefault();
//             this.setCurrentState(control as HTMLElement);
//           });
//         });
//       }
//     }

//     const exampleCarousel = new Carousel(
//       galleryContainer,
//       galleryItems,
//       galleryControls,
//     );

//     exampleCarousel.setControls();
//     exampleCarousel.useControls();
//   }, []);

//   return (
//     <>
//       <Background>
//         <div className="gallery">
//           <div className="gallery-container">
//             <img
//               className="gallery-item gallery-item-1"
//               src={Album}
//               alt="gallery image"
//               data-index="1"
//             />
//             <img
//               className="gallery-item gallery-item-2"
//               src={Album}
//               alt="gallery image"
//               data-index="2"
//             />
//             <img
//               className="gallery-item gallery-item-3"
//               src={Album}
//               alt="gallery image"
//               data-index="3"
//             />
//             <img
//               className="gallery-item gallery-item-4"
//               src={Album}
//               alt="gallery image"
//               data-index="4"
//             />
//             <img
//               className="gallery-item gallery-item-5"
//               src={Album}
//               alt="gallery image"
//               data-index="5"
//             />
//           </div>
//           <div className="gallery-controls"></div>
//         </div>
//       </Background>
//     </>
//   );
// }

// export default CarouselPage;
