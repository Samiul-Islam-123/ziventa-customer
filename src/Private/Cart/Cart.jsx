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

function Cart(props) {
  const navigate = useNavigate();


  const [CartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [totalProductPrice, setTotalProductPrice] = useState(0);

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

  useEffect(() => {
    if (props.checkAuthentication()) fetchCartData();
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

  const placeOrder = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");

    const products = [];
    CartData.forEach((item) => {
      products.push({
        productID: item._id,
        Qty: productQuantities[item._id],
      });
    });

    const res = await axios.post(`${apiURL}/app/client/place-order`, {
      token: token,
      OrderPrice: totalProductPrice,
      products: products,
    });
    //if (res.data.message == "OK") navigate("/profile");


    setLoading(false);
  };

  const checkoutPayment = async () => {
    const products = [];
    CartData.map((item) => {
      products.push({
        name: item.ProductTitle,
        price: item.ProductPrice,
        Qty: productQuantities[item._id],
      });
    });

    const stripe = await loadStripe(
      "pk_test_51OBBNrSCHCgq5ZNZQz3zYz3T6j0wuG66LrcQec0pvMVn9s424fCbv9vS2sxf4B5nBhuole6eWUv10uWBdSaScv3e00h2ZYeRfk"
    );

    const res = await axios.post(`${apiURL}/app/client/checkout-payment`, {
      products: products,
    });
    const session = res.data;

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    await placeOrder();

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">My Cart</Typography>

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

      {CartData &&
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
                      <Typography variant="h4">{item.ProductTitle} </Typography>

                      <Typography>{item.ProductDescription}</Typography>
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
                    <div style={{ textAlign: "center" }}>
                      <Typography variant="h6">
                        Price : ₹{" "}
                        {productQuantities[item._id] * item.ProductPrice}
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
        ))}

      <Card
        style={{
          marginBottom: "300px",
        }}
      >
        <CardContent>
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h4" align="center">
                Total Price :
              </Typography>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button onClick={checkoutPayment} variant="contained">
                  {" "}
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
                {CartData && (
                  <>
                    {CartData.map((item) => {
                      return (
                        <Typography variant="h6" key={item._id}>
                          {productQuantities[item._id] * item.ProductPrice}
                        </Typography>
                      );
                    })}
                  </>
                )}
                <Divider />
                <Typography variant="h5">
                  Total: ₹ {totalProductPrice}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Cart;
