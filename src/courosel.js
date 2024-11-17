import React, { useState } from 'react';

const Carousel = () => {
  // State to track the current slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of images for the carousel
  const images = [
    'https://via.placeholder.com/600x300/FF5733/FFFFFF?text=Image+1',
    'https://via.placeholder.com/600x300/33FF57/FFFFFF?text=Image+2',
    'https://via.placeholder.com/600x300/5733FF/FFFFFF?text=Image+3',
  ];

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop back to first image after last
  };

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length // Loop back to last image
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
      </div>
      <button className="prev" onClick={prevSlide}>❮</button>
      <button className="next" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Carousel;
