import React, { useState, useEffect } from 'react';
import { Card, CardActionArea, Dialog, DialogTitle, DialogContent, TextField, DialogContentText, CardContent, Divider, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiURL from '../../../apiURL';
import axios from 'axios';

function ReviewProducts(props) {
  const [orderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [review, setReview] = useState('');
  const [currentItem_id, setCurrentItem_id] = useState('');

  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    setLoading(true);

    const token = Cookies.get('access_token');
    const res = await axios.get(`${apiURL}/app/client/order-history/${token}`);
    console.log(res);

    if (res.data.message === 'OK') {
      setOrderHistory(res.data.OrderData);
    } else {
      alert(res.data.message);
      console.log(res.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (props.checkAuthentication()) fetchOrderHistory();
    else {
      navigate('/login');
    }
  }, []);

  const handleOpenDialog = (itemId) => {
    setOpenDialog(true);
    setCurrentItem_id(itemId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem_id('');
    setReview('');
  };

  const handleReviewSubmit = () => {
    // Submit the review for the current item
    // You can send the review data to the server here
    console.log('Review submitted:', review);

    // Close the dialog after submission
    handleCloseDialog();
  };

  return (
    <>
    <Container>
<Typography variant='h4'>
    Product Reviews : 
</Typography>
      {orderHistory &&
        orderHistory.map((order) => (
            <div key={order._id}>
            <Card>
              <CardContent>
               
                <h4>Products:</h4>
                {order.products.map((product) => (
                    <div key={product._id}>
                    <h5>{product.product.ProductTitle}</h5>
                    <p>Product Price: {product.product.ProductPrice}</p>
                    <p>Reviews:</p>
                    <ul>
                      {product.product.Reviews.map((review) => (
                          <li key={review._id}>
                          <p>Customer: {review.customer}</p>
                          <p>Date: {review.Date}</p>
                          <p>Review: {review.review}</p>
                        </li>
                      ))}
                    </ul>
                   
                  </div>
                ))}
              </CardContent>
            </Card>
            <Divider />
          </div>
        ))}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Review Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Write a review about your product</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Write review here"
            type="text"
            fullWidth
            variant="standard"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            />
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </DialogContent>
      </Dialog>
            </Container>
    </>
  );
}

export default ReviewProducts;
