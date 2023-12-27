import { Container, Grid, Typography } from '@mui/material';
import React from 'react';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import ProductCard from '../ProductCard';
import Footer from './Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';


function LandingPage() {
  const images = [
    'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const swiperParams = {
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      600: {
        slidesPerView: 2,
      },
      960: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 1000, // Set the delay between slides in milliseconds
      
    },
  };

  return (
    <>
      <Container>
        <ImageCarousel images={images} />
        {/* Trending products */}
        <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
          Men
        </Typography>

        <Swiper {...swiperParams}>
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductCard imageURL={item} imagwWidth="300px" imageHeight="400px" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div style={{ marginTop: '50px' }}>
          <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
            Women
          </Typography>
        </div>

        <Swiper {...swiperParams}>
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductCard imageURL={item} imagwWidth="300px" imageHeight="500px" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div style={{ marginTop: '50px' }}>
          <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
            Kids
          </Typography>
        </div>

        <Swiper {...swiperParams}>
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductCard imageURL={item} imagwWidth="300px" imageHeight="500px" />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      <Footer />
    </>
  );
}

export default LandingPage;
