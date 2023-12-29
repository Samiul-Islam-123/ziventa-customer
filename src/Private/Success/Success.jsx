import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiURL from '../../apiURL';
import AtomicSpinner from 'atomic-spinner'
import { Container, Icon, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Success(props) {

    const navigate = useNavigate();
    var CartData;

    useEffect(() => {
        //fetching data from localstorage
        const data = localStorage.getItem('cart');
        const jsonData = JSON.parse(data);//converting it to JSON format
        CartData = jsonData;
        placeOrder(CartData)
    }, []);

    const placeOrder = async (CartData) => {
        // setLoading(true);
        console.log("PLacing Order...")
        if (CartData) {

            const res = await axios.post(`${apiURL}/app/client/place-order`, {
                token: CartData.token,
                OrderPrice: CartData.OrderPrice,
                products: CartData.Cartproducts
            });

            if(res.data.message === "OK")
            navigate('/profile')

            else{
                alert("error occured :(");
                console.log(res)
            }

        }

        else {
            console.log("Cart Data not found")
        }


        //setLoading(false);
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
            <div style={{
                textAlign : "center"
            }}>
            <AtomicSpinner
                atomSize={800}
                electronPathCount={5}
            />

            </div>
        </Container>


        </>
    )
}

export default Success