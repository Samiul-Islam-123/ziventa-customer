import { CardContent, CardMedia, Card, Typography, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard(props) {

  const navigate = useNavigate();
    const {imageURL, _id, imageHeight, imageWidth, ProductTitle, ProductPrice} = props;

  return (
    <>
      <Card>
        <CardContent>
          <CardMedia
            component={'img'}
            image={imageURL}
            alt="Product Image"
            width={imageWidth}
            height={imageHeight}
            style={{ objectFit: "cover" }}
          />

          <Typography variant='h6'>
           {ProductTitle}
          </Typography>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <Typography variant='h6'>
            ₹ {ProductPrice}
            </Typography>
            <Button variant="contained" onClick={()=>{
              navigate(`/products/details/${_id}`)
            }}>
              Buy now
            </Button>
          </div>

        </CardContent>
      </Card>
    </>
  );
}

export default ProductCard;
