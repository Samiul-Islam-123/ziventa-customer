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
  const [allProducts, setAllProducts] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");
    const response = await axios.get(`${apiURL}/app/client/products`);
    if (response.data.message === "OK") {
      setAllProducts(response.data.products);
    } else {
      console.error(response.data);
    }
    setLoading(false);
  };

  const arrangeData = () => {
    setLoading(true);
    const categorizedProducts = {};

    allProducts.forEach((item) => {
      console.log(item)
      const category = item.ProductMetaData.Category; // Assuming each product has a 'category' property
      if (!categorizedProducts[category]) {
        categorizedProducts[category] = [];
      }

      categorizedProducts[category].push({
        imageURL: item.ProductImages[0],
        _id: item._id,
        ProductTitle: item.ProductTitle,
        ProductPrice: item.ProductPrice,
      });
    });

    setCategories(Object.entries(categorizedProducts));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (allProducts) {
      arrangeData();
    }
  }, [allProducts]);

  const images = [
    'https://storage.googleapis.com/staging.ultra-bearing-331411.appspot.com/Banner/8041031.jpg',
    'https://storage.googleapis.com/staging.ultra-bearing-331411.appspot.com/Banner/8915375_4021588.jpg',
    'https://storage.googleapis.com/staging.ultra-bearing-331411.appspot.com/Banner/8915380_4028484.jpg',
  ];

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

        {categories.map(([category, products], index) => (
          <React.Fragment key={index}>
            <Typography variant="h3" style={{ marginTop: '40px', marginBottom: '40px' }}>
              {category}
            </Typography>
            <Grid container spacing={2}>
              {products.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ProductCard
                    imageURL={item.imageURL}
                    ProductTitle={item.ProductTitle}
                    ProductPrice={item.ProductPrice}
                    _id={item._id}
                    imagwWidth="300px"
                    imageHeight="500px"
                  />
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        ))}
      </Container>

      <Footer />
    </>
  );
}

export default LandingPage;
