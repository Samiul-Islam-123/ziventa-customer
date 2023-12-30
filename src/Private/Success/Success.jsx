import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiURL from '../../apiURL';
import AtomicSpinner from 'atomic-spinner';
import { Container, Typography } from '@mui/material';

function Success(props) {
  const navigate = useNavigate();
  var CartData;
  var addressJSON;

  useEffect(() => {
    //fetching data from localstorage
    const data = localStorage.getItem('cart');
    const address = localStorage.getItem('address');
    addressJSON = JSON.parse(address);
    const jsonData = JSON.parse(data); //converting it to JSON format
    CartData = jsonData;

    // Ensure placeOrder is called only once during the initial mount
    if (CartData) {
        
      placeOrder(CartData);
    }
  }, []); // Empty dependency array ensures useEffect runs only once

  const placeOrder = async (CartData) => {
    console.log('PLacing Order...');
    if (CartData) {
      const res = await axios.post(`${apiURL}/app/client/place-order`, {
        token: CartData.token,
        OrderPrice: CartData.OrderPrice,
        products: CartData.Cartproducts,
        address: addressJSON.address,
        Phone: addressJSON.phone,
      });

      if (res.data.message === 'OK') navigate('/profile');
      else {
        alert('Error occurred :(');
        console.log(res);
      }
    } else {
      console.log('Cart Data not found');
    }
  };

  return (
    <>
      <Container>
        <Typography variant='h3' align='center' marginTop={'10px'} marginBottom={'10px'}>
          Payment is successful
        </Typography>
        <Typography variant='h5' align='center'>
          We are Placing your Order ...
        </Typography>
        <div style={{ textAlign: 'center' }}>
          <AtomicSpinner atomSize={800} electronPathCount={5} />
        </div>
      </Container>
    </>
  );
}

export default Success;
