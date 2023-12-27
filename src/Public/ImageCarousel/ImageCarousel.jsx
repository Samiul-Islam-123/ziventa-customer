import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";


const ImageCarousel = (props) => {
  const { images } = props;



  return (
      <AliceCarousel
        autoPlay
        infinite
        autoPlayInterval={2000} // Set the interval for automatic playback in milliseconds
        buttonsDisabled={true} // Hide the default navigation buttons
        dotsDisabled={true} // Hide the pagination dots
      >
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`carousel-${index}`}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "80vh",
            }}
          />
        ))}
      </AliceCarousel>

     
  );
};

export default ImageCarousel;
