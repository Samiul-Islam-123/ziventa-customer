import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Icon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Typography,
} from "@mui/material";
import apiURL from "../../apiURL";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';


import STRIPE_KEY from "../../KEY";

function Cart(props) {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const successParam = queryParams.get('success');
  const navigate = useNavigate();
  const { orderID } = useParams();

  //console.log(cart)

  const [CartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [totalProductPrice, setTotalProductPrice] = useState(0);

  const [OpenDialog, setOpenDialog] = useState(false);

  const [showCartData, setShowCartData] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [userPhone, setUserPhone] = useState(null)

  const fetchCartData = async () => {

    setLoading(true);
    const token = Cookies.get("access_token");
    const res = await axios.get(`${apiURL}/app/client/cart-products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.message === "OK") {
      setCartData(res.data.CartData.product);
      // Initialize quantities for each product to 1
      const initialQuantities = {};
      res.data.CartData.product.forEach((item) => {
        initialQuantities[item._id] = 1;
      });
      setProductQuantities(initialQuantities);
    } else {
      console.log(res.data);
    }
    setLoading(false);
  };

  const incrementProduct = (productId) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const decrementProduct = (productId) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] - 1,
    }));
  };

  const checkLocalData = () => {
    const localAddressData = JSON.parse(localStorage.getItem('address'))
    if (localAddressData != null) {
      setShowCartData(true);
    }

    else {
      setShowCartData(false);
    }
  }

  useEffect(() => {
    if (props.checkAuthentication()) {
      fetchCartData();
      checkLocalData();
    }
    else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (CartData) {
      // Calculate the total product price by iterating through the cart items
      const totalPrice = CartData.reduce((acc, item) => {
        const productPrice = item.ProductPrice;
        const quantity = productQuantities[item._id];
        return acc + productPrice * quantity;
      }, 0);

      setTotalProductPrice(totalPrice);
    }
  }, [CartData, productQuantities]);

  const placeOrder = async (CartData, paidStatus) => {
    console.log('PLacing Order...');
    console.log(Cart)
    if (CartData) {
      const address = localStorage.getItem('address');
      const addressJSON = JSON.parse(address);
      const res = await axios.post(`${apiURL}/app/client/place-order`, {
        token: CartData.token,
        OrderPrice: CartData.OrderPrice,
        products: CartData.Cartproducts,
        address: addressJSON.address,
        Phone: addressJSON.phone,
        paidStatus: paidStatus
      });

      if (res.data.message === 'OK')
        return res.data.placedOrderID;

      else {
        alert('Error occurred :(');
        console.log(res);
      }
    } else {
      console.log('Cart Data not found');
    }
  };


  const checkoutPayment = async () => {
    //const orderId = await placeOrder();

    const token = Cookies.get('access_token');


    //arrainging data for cartproducts

    const Cartproducts = [];
    CartData.forEach((item) => {
      Cartproducts.push({
        productID: item._id,
        Qty: productQuantities[item._id],
      });
    });

    //Storing Cart Data into Local Storage
    const DatatoBeStored = {
      Cartproducts: Cartproducts,
      token: token,
      OrderPrice: totalProductPrice

    };

    //const placedOrderID = placeOrder(DatatoBeStored)
    const placedOrderID = await placeOrder(DatatoBeStored, true)
    //console.log(placedOrderID)

    //processes for Stripe Payment
    const products = [];
    CartData.map((item) => {
      products.push({
        name: item.ProductTitle,
        price: item.ProductPrice,
        Qty: productQuantities[item._id],
      });
    });

    const stripe = await loadStripe(STRIPE_KEY);

    const res = await axios.post(`${apiURL}/app/client/checkout-payment`, {
      products: products,
      placedOrderID: placedOrderID
    });
    const session = res.data;

    console.log(session)

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };


  const amount = 500;
  const currency = "INR";
  const receiptId = "order_rcptid_11";

  const paymentHandler = async (e) => {
    const response = await fetch(`${apiURL}/payment/order`, {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: `${process.env.REACT_APP_RAZORPAY_KEY}`, // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          `${apiURL}/payment/order/validate`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Web Dev Matrix", //your customer's name
        email: "webdevmatrix@example.com",
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };


  return (
    <Container>
      <Typography variant="h4">My Cart</Typography>

      {
        showCartData ? (<>

          {CartData && CartData.length === 0 ? (
            <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
              No items in the cart.
            </Typography>
          ) : (
            CartData &&
            CartData.map((item, index) => (
              <div
                key={index}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Card>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={3}>
                        {/* Your existing code for rendering product image */}
                        <div style={{ textAlign: "center" }}>
                          <img
                            src={item.ProductImages[0]}
                            alt="Product image"
                            width={"50%"}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div>
                          {/* Your existing code for rendering product details */}
                          <Typography variant="h4">{item.ProductTitle}</Typography>

                          <Button
                            style={{
                              marginTop: "20px",
                            }}
                            variant="outlined"
                            onClick={() => {
                              navigate("/products/details/" + item._id);
                            }}
                          >
                            View Product Details
                          </Button>
                          <IconButton
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Do you really want to Remove this Product from Cart ?"
                                ) == true
                              ) {
                                const token = Cookies.get("access_token");
                                console.log(token);
                                const res = await axios.post(
                                  `${apiURL}/app/client/remove-item`,
                                  {
                                    token: token,
                                    productID: item._id,
                                  }
                                );

                                if (res.data.message == "OK") fetchCartData();
                              }
                            }}
                            style={{
                              marginTop: "20px",
                              marginLeft: "50px",
                            }}
                            variant="outlined"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        {/* Your existing code for rendering product price and quantity */}
                        <div style={{ textAlign: "center" }}>
                          <Typography variant="h6">
                            Price : ₹ {productQuantities[item._id] * item.ProductPrice}
                          </Typography>
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <IconButton
                              onClick={() => decrementProduct(item._id)}
                              style={{
                                marginLeft: "50px",
                              }}
                            >
                              <RemoveCircleIcon style={{ fontSize: 24 }} />
                            </IconButton>
                            <Typography variant="h5">
                              {productQuantities[item._id]}
                            </Typography>
                            <IconButton onClick={() => incrementProduct(item._id)}>
                              <AddCircleOutlineIcon style={{ fontSize: 24 }} />
                            </IconButton>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            ))
          )}

          {CartData && CartData.length > 0 && (
            <Card
              style={{
                marginBottom: "300px",
              }}
            >
              <CardContent>
                <Grid container>
                  <Grid item xs={10}>
                    {/* Your existing code for displaying total price and checkout button */}
                    <Typography variant="h4" align="center">
                      Total Price : {/* Add your logic for calculating total price */}
                    </Typography>

                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button onClick={() => {
                        setOpenDialog(true);
                      }} variant="contained">
                        Proceed to checkout
                      </Button>

                    </div>
                  </Grid>
                  <Grid item xs={2}>
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {CartData &&
                        CartData.map((item) => (
                          <Typography variant="h6" key={item._id}>
                            {/* Your logic for displaying individual item prices */}
                            {productQuantities[item._id] * item.ProductPrice}
                          </Typography>
                        ))}
                      <Divider />
                      <Typography variant="h5">
                        Total: ₹ {totalProductPrice} {/* Add your logic for total price */}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          <Dialog
            open={OpenDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          >
            <DialogTitle>Choose a Payment Methods</DialogTitle>
            <DialogContent align="center">

              <Grid item xs={6} margin={"10px"}>
                <Button fullWidth variant="contained" onClick={checkoutPayment}>
                  Pay with Card
                </Button>
              </Grid>

              <Grid item xs={6} margin={"10px"}>
                <Button fullWidth variant="contained" onClick={paymentHandler}>
                  UPI
                </Button>
              </Grid>

              <Grid item xs={6} margin={"10px"}>
                <Button fullWidth variant="contained" onClick={async () => {
                  const token = Cookies.get('access_token');


                  //arrainging data for cartproducts

                  const Cartproducts = [];
                  CartData.forEach((item) => {
                    Cartproducts.push({
                      productID: item._id,
                      Qty: productQuantities[item._id],
                    });
                  });

                  //Storing Cart Data into Local Storage
                  const DatatoBeStored = {
                    Cartproducts: Cartproducts,
                    token: token,
                    OrderPrice: totalProductPrice

                  };

                  //const placedOrderID = placeOrder(DatatoBeStored)
                  const placedOrderID = await placeOrder(DatatoBeStored, false)
                  if (placedOrderID) {
                    setOpenDialog(false)
                    navigate('/profile')
                  }

                  else {
                    alert("Some Error Occured :(")
                  }
                }}>
                  Cash on Delivery
                </Button>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                onClick={()=>{
                  setOpenDialog(false)
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

        </>) : (<>
          <Typography variant="h7" margin={"10px"}>
            Please Enter your Address and Phone number to view Cart Details and Place Order
          </Typography>
          <TextField margin={"10px"} onChange={(e) => {
            setUserAddress(e.target.value)
          }} variant="outlined" fullWidth label="Enter your Address" multiline rows={4} />
          <TextField margin={"10px"} onChange={(e) => {
            setUserPhone(e.target.value)
          }} variant="outlined" fullWidth label="Enter your Contact Number" />

          <Button
            variant="contained"
            onClick={() => {
              if (userAddress && userPhone) {
                // Check if userPhone contains only numeric characters
                const isNumeric = /^\d+$/.test(userPhone);

                if (isNumeric) {
                  localStorage.setItem('address', JSON.stringify({
                    address: userAddress,
                    phone: userPhone
                  }));
                  checkLocalData();
                } else {
                  alert("Phone number should contain only numeric characters");
                }
              } else {
                alert("Please enter both fields");
              }
            }}
          >
            Save Address
          </Button>


        </>)
      }


      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}


    </Container>
  );
}

export default Cart;