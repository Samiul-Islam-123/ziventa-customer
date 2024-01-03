import { Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import ProductCard from '../ProductCard';
import Footer from './Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import axios from 'axios';
import apiURL from '../../apiURL';
import Cookies from 'js-cookie';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [popularProducts, setPopularProducts] = useState(null);
  const [menProducts, setMenProducts] = useState(null);
  const [womenProducts, setWomenProducts] = useState(null);
  const [kidsProducts, setKidsProducts] = useState(null);

  const fetchProducts = async (category) => {
    setLoading(true);
    const token = Cookies.get("access_token");
    const response = await axios.get(
      `${apiURL}/app/client/products/${category}`
    );
    if (response.data.message === "OK") return response.data.products;
    else {
      return response.data;
    }
    setLoading(false);
  };

  const arrangeData = async () => {
    setLoading(true);
    const Mendata = await fetchProducts('t-shirt');
    const Womendata = await fetchProducts('shirt');
    const Kidsdata = await fetchProducts('pant');

    var finalMenData = [],
      finalWomenData = [],
      finalKidsData = [];

    Mendata.map((item) => {
      finalMenData.push({
        imageURL : item.ProductImages[0],
        _id : item._id,
        ProductTitle : item.ProductTitle,
        ProductPrice : item.ProductPrice
      });
    });

    Womendata.map((item) => {
      finalWomenData.push({
        imageURL : item.ProductImages[0],
        _id : item._id,
        ProductTitle : item.ProductTitle,
        ProductPrice : item.ProductPrice
      });
    });

    Kidsdata.map((item) => {
      finalKidsData.push({
        imageURL : item.ProductImages[0],
        _id : item._id,
        ProductTitle : item.ProductTitle,
        ProductPrice : item.ProductPrice
      })
    });

    setMenProducts(finalMenData);
    setWomenProducts(finalWomenData);
    setKidsProducts(finalKidsData);

    console.log(Mendata, Womendata, Kidsdata);
    setLoading(false);
  };

  useEffect(() => {
    arrangeData();
  }, []);

  const images = [
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
        {loading ? (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}

        <ImageCarousel images={images} />
        <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
          Shirts
        </Typography>

        <Grid container spacing={2}>
          {console.log(menProducts)}
          {menProducts
            ? menProducts.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ProductCard imageURL={item.imageURL} 
                  ProductTitle={item.ProductTitle}
                  ProductPrice={item.ProductPrice}
                  _id={item._id}
                  imagwWidth="300px" imageHeight="500px" />
                </Grid>
              ))
            : null}
        </Grid>

        <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
          T-Shirts
        </Typography>
        <Grid container spacing={2}>
          {womenProducts
            ? womenProducts.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ProductCard imageURL={item.imageURL} 
                  ProductTitle={item.ProductTitle}
                  ProductPrice={item.ProductPrice}
                  _id={item._id}
                  imagwWidth="300px" imageHeight="500px" />
                </Grid>
              ))
            : null}
        </Grid>

        <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
          Pants
        </Typography>
        <Grid container spacing={2}>
          {kidsProducts
            ? kidsProducts.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ProductCard imageURL={item.imageURL} 
                  ProductTitle={item.ProductTitle}
                  ProductPrice={item.ProductPrice}
                  _id={item._id}
                  imagwWidth="300px" imageHeight="500px" />
                </Grid>
              ))
            : null}
        </Grid>

       

      </Container>

      <Footer />
    </>
  );
}

export default LandingPage;
