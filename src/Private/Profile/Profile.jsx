import {
  Container,
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HistoryIcon from "@mui/icons-material/History";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import SavedProducts from "./SavedProducts/SavedProducts";
import OrderHistory from "./OrderHistory/OrderHistory";
import ReviewProducts from "./ReviewProducts/ReviewProducts";
import axios from "axios";
import apiURL from "../../apiURL";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const [orderHistory, setOrderHistory] = useState(true);
  const [reviews, setReviews] = useState(false);
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");

  const fetchUserData = async () => {
    const token = Cookies.get("access_token");
    const res = await axios.post(`${apiURL}/app/decode`, {
      token: token,
    });
    if(res.data.message == "OK")
    setUsername(res.data.Details.username)
  };

  useEffect(() => {
    if(props.checkAuthentication())
    fetchUserData();

    else{
      navigate('/login')
    }
  }, []);

  return (
    <>
      <Container>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            style={{
              marginBottom: "20px",
            }}
          >
           Welcome {userName} !
          </Typography>
        </div>
        <Divider />
        <Toolbar>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4}>
              <ListItemButton
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setOrderHistory(true);
                  setReviews(false);
                }}
              >
                <HistoryIcon />
                <Typography
                  variant="h7"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Order History
                </Typography>
              </ListItemButton>
              {orderHistory ? <Divider color="white" /> : null}
            </Grid>
            <Grid item xs={4}>
              <ListItemButton
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setOrderHistory(false);
                  setReviews(true);
                }}
              >
                <ThumbsUpDownIcon />
                <Typography
                  variant="h7"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Reviews
                </Typography>
              </ListItemButton>
              {reviews ? <Divider color="white" /> : null}
            </Grid>
          </Grid>
        </Toolbar>

        {orderHistory && <OrderHistory />}
        {reviews && <ReviewProducts />}
      </Container>
    </>
  );
}

export default Profile;
