import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiURL from "../../apiURL";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Card, CardContent, Container, Divider, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import Footer from "../../Public/LandingPage/Footer"

function ProductDetails(props) {
  const [open, setOpen] = React.useState(false);

  const { ProductID } = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep(
      (prevActiveStep) =>
        (prevActiveStep + 1) % productDetails.ProductImages.length
    );
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) =>
        (prevActiveStep - 1 + productDetails.ProductImages.length) %
        productDetails.ProductImages.length
    );
  };

  const fetchProductData = async () => {
    setLoading(true);
    const res = await axios.get(
      `${apiURL}/app/client/product-details/${ProductID}`
    );

    console.log(res.data.productDetails);

    if (res.data.message === "OK") setProductDetails(res.data.productDetails);
    else {
      alert(res.data.message);
      console.log(res);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (props.checkAuthentication()) fetchProductData();
    else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Container>
        {loading ? (
          <>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        ) : null}

        {productDetails && (
          <>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  sx={{
                    width: "100%",     // Set width to 100%
                    height: "50vh",    // Set height to 50vh
                    display: "block",
                    overflow: "hidden",
                    objectFit: "contain",  // Set objectFit to contain
                  }}
                  src={productDetails.ProductImages[activeStep]}
                />
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    disabled={
                      activeStep === productDetails.ProductImages.length - 1
                    }
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Details Container */}
                <Typography variant="h4">
                  {productDetails.ProductTitle}
                </Typography>
                <Typography variant="h7">
                  {productDetails.ProductDescription}
                </Typography>
                <Typography variant="h4" marginTop={"20px"} marginBottom={"10px"}>
                  More Details : 
                </Typography>

                <Typography variant="h7">
  <strong>Product Category :</strong> {productDetails.ProductMetaData.Category}
  <br />
  <strong>Age Range:</strong> {productDetails.ProductMetaData.AgeRange}
</Typography>

                
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop : "20px"
                  }}
                >
                  <Typography variant="h4">
                    ₹{productDetails.ProductPrice}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      setLoading(true);
                      const token = Cookies.get("access_token");
                      const res = await axios.post(
                        `${apiURL}/app/client/add-to-cart`,
                        {
                          productID: { ProductID },
                          token: token,
                        }
                      );

                      console.log(res.data.message === "OK");

                      if (res.data.message === "OK")
                        setSnackBarMessage("Item Added to Cart");

                      if (res.data.message === "error") {
                        alert(res.data.message);
                        console.error(res);
                      } else {
                        setOpen(true);
                        setSnackBarMessage(res.data.message);
                      }

                      setLoading(false);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Grid>
            </Grid>

            <Divider
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />



            {console.log(productDetails.Reviews.length)}
            
             {
              productDetails.Reviews.length!=0 ? (<>
                  <Typography variant="h3" align="center">
                    Product Reviews
                  </Typography>
                <Card style={{
                  marginBottom : "50px"
            }}>
              <CardContent>

            <p>Reviews:</p>
                    <ul>
                      {productDetails.Reviews.map((review) => (
                        <li key={review._id}>
                          <p>Customer: {review.customer}</p>
                          <p>Date: {review.Date}</p>
                          <p style={{
                            fontSize : "24px",
                            fontWeight : "bold"
                          }}>Review: {review.review}</p>
                        </li>
                      ))}
                    </ul>
                      </CardContent>
            </Card>
              </>) : <Typography variant="h6" style={{
                  textAlign : "center",
                  margin : "20px"
              }}>
                This product Did'nt got any reviews yet
              </Typography>
             }

            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message={snackBarMessage}
            />
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default ProductDetails;
