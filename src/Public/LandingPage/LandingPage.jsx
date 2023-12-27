import { Container } from '@mui/material';
import React from 'react';
import ImageCarousel from '../ImageCarousel/ImageCarousel';

function LandingPage() {

  const images = [
    'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1600716051809-e997e11a5d52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FtcGxlfGVufDB8fDB8fHww',
    'https://plus.unsplash.com/premium_photo-1670279525913-b791001762f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNhbXBsZXxlbnwwfHwwfHx8MA%3D%3D',
  ];
  

  return (
    <>
      This is Landing Page
      <Container>

      <ImageCarousel images = {images} />
      
      </Container>
     
    </>
  )
}

export default LandingPage