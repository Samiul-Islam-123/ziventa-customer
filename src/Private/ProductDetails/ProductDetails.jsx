import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiURL from "../../apiURL";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Card, Container, Divider, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { autoPlay } from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
function ProductDetails(props) {
  const [open, setOpen] = React.useState(false);

  const { ProductID } = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();

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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
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

    //const maxSteps = productDetails.ProductImages.length;

    setLoading(false);
  };

  useEffect(() => {
    if(props.checkAuthentication())
    fetchProductData();

    else{
      navigate('/login')
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
                <AutoPlaySwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={activeStep}
                  onChangeIndex={handleStepChange}
                  enableMouseEvents
                >
                  {productDetails.ProductImages.map((step, index) => (
                    <div key={step.label}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <Box
                          component="img"
                          sx={{
                            height: 255,
                            display: "block",
                            maxWidth: 400,
                            overflow: "hidden",
                            width: "100%",
                            height: "auto",
                          }}
                          src={step}
                        />
                      ) : null}
                    </div>
                  ))}
                </AutoPlaySwipeableViews>
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Details Container */}
                <Typography variant="h4">
                  {productDetails.ProductTitle}
                </Typography>
                <Typography variant="h7">
                  {productDetails.ProductDescription}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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

                      console.log(res.data.message === "OK")

                      if (res.data.message === "OK") setSnackBarMessage("Item Added to Cart")

                      if(res.data.message == "error"){
                        alert(res.data.message);
                        console.error(res);

                      }

                      else {
                        setOpen(true)
                        setSnackBarMessage(res.data.message)
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

            <Typography variant="h3" align="center">
              Product Reviews
            </Typography>

            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message={snackBarMessage}
            />
          </>
        )}
      </Container>
    </>
  );
}

export default ProductDetails;
