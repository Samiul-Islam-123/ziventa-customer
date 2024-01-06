import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiURL from "../../../apiURL";
import axios from "axios";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Toolbar,
  Container,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";

function OrderHistory(props) {
  const [orderhistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [Review, setReview] = useState("");
  const [currentItem_id, setCurrentItem_id] = useState("");
  const [myData, setMyData] = useState(null);

  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    setLoading(true);
    const localData = localStorage.getItem("address");
    if (localData) {
      const JSONLocalData = JSON.parse(localData);
      setMyData(JSONLocalData);
    }
    const token = Cookies.get("access_token");
    const res = await axios.get(`${apiURL}/app/client/order-history/${token}`);
    if (res.data.message === "OK") setOrderHistory(res.data.OrderData);
    else {
      alert(res.data.message);
      console.log(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props.checkAuthentication()) fetchOrderHistory();
    else {
      navigate("/login");
    }
  }, []);

  function formatDate(inputDate) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const formattedDate = `${day}${getDaySuffix(day)} ${months[monthIndex]
      }, ${year}`;

    return formattedDate;
  }

  // Helper function to get the suffix for the day (e.g., 1st, 2nd, 3rd)
  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
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

      {orderhistory ? (
        <>
          {myData ? (
            <>
              <Toolbar>
                <div
                  style={{
                    flexGrow: "1",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Typography variant="h4">
                    {orderhistory[0].customer.username}
                  </Typography>

                  <Typography variant="h7">{myData.address}</Typography>

                  <Typography variant="h6">{myData.phone}</Typography>
                </div>

                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/review");
                  }}
                >
                  Reviews
                </Button>
              </Toolbar>
            </>
          ) : (
            <>
              <Typography variant="h6" align="center">
                Personal Data not found :(
              </Typography>
            </>
          )}

          <div style={{ padding: "5px" }}>
            {orderhistory.map((item) => {
              return (
                <div key={item._id}>
                  {item.products.map((pitem) => {
                    return (
                      <div key={pitem.product._id}>
                        <Card>
                          <CardContent>
                            <Grid container>
                              <Grid
                                item
                                xs={6}
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                <img
                                  src={pitem.product.ProductImages[0]}
                                  width={"180px"}
                                  height={"180px"}
                                  style={{ objectFit: "contain" }}
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                style={{
                                  textAlign: "right",
                                }}
                              >
                                <Typography variant="h6">
                                  {pitem.product.ProductTitle}
                                </Typography>
                                <Typography variant="h5">
                                  ₹ {pitem.product.ProductPrice}
                                </Typography>
                                <Typography variant="h5">
                                  Qty : {pitem.Qty}
                                </Typography>

                                <Typography variant="h5">
                                  Payment Status : {item.paid ? (<>Paid</>) : (<>Cash on Delivery</>)}
                                </Typography>

                                <div
                                  style={{
                                    marginTop: "10px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => {
                                      navigate(
                                        `/products/details/${pitem.product._id}`
                                      );
                                    }}
                                  >
                                    <ReadMoreIcon />
                                  </IconButton>
                                  {!item.OrderStatus === "Order Delivered" ? (
                                    <>
                                      <IconButton
                                        onClick={async () => {
                                          setLoading(true);
                                          const token = Cookies.get(
                                            "access_token"
                                          );
                                          const orderID = item._id;
                                          const productID =
                                            pitem.product._id;
                                          const res = await axios.post(
                                            `${apiURL}/app/client/remove-order-item`,
                                            {
                                              orderID: orderID,
                                              productID: productID,
                                              token: token,
                                            }
                                          );
                                          setLoading(false);
                                          if (res.data.message === "OK") {
                                            alert(
                                              "Order Cancelled Successfully"
                                            );
                                            fetchOrderHistory();
                                          } else alert(res.data.message);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        onClick={async () => {
                                          setopenDialog(true);
                                          setCurrentItem_id(
                                            pitem.product._id
                                          );
                                        }}
                                      >
                                        <ThumbsUpDownIcon />
                                      </IconButton>
                                    </>
                                  )}
                                </div>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        <Dialog
                          open={openDialog}
                          onClose={() => {
                            setopenDialog(false);
                          }}
                        >
                          <DialogTitle>Subscribe</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Write a Review for this Order
                            </DialogContentText>
                            <TextField
                              onChange={(e) => {
                                setReview(e.target.value);
                              }}
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Your review goes here"
                              type="email"
                              fullWidth
                              variant="standard"
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              color="secondary"
                              onClick={async () => {
                                setLoading(true);
                                const token = Cookies.get(
                                  "access_token"
                                );
                                const ReviewRes = await axios.post(
                                  `${apiURL}/app/client/add-review`,
                                  {
                                    token: token,
                                    OrderID: currentItem_id,
                                    review: Review,
                                  }
                                );
                                if (ReviewRes.data.message === "OK")
                                  setopenDialog(false);
                                else {
                                  alert("ERROR :(");
                                  console.log(ReviewRes.data);
                                }

                                setLoading(false);
                                setCurrentItem_id("");
                              }}
                            >
                              Done
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Divider />
                      </div>
                    );
                  })}
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <Typography variant="h6">
                      Total Order Price : ₹ {item.OrderPrice}
                    </Typography>
                    <Typography variant="h6">
                      Order Status : {item.OrderStatus}
                    </Typography>
                    {item.ExpectedDeliveryDate ? (
                      <>
                        <Typography variant="h6">
                          Delivery expected on{" "}
                          {formatDate(item.ExpectedDeliveryDate)}
                        </Typography>
                      </>
                    ) : null}
                  </div>
                  <Divider />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Typography variant="h6" align="center">
            No Orders yet
          </Typography>
        </>
      )}
    </Container>
  );
}

export default OrderHistory;
