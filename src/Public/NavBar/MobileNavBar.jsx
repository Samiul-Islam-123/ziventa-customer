import React from 'react';
import {
    AppBar,
    Button,
    IconButton,
    Icon,
    Toolbar,
    Typography,
    Badge,
    TextField,
  } from "@mui/material";
  import { Search } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import SearchIcon from "@mui/icons-material/Search";
  import axios from "axios";
  import apiURL from "../../apiURL";
  import Cookies from "js-cookie";
  import TuneIcon from "@mui/icons-material/Tune";
  import MobileControllerDrawer from "./../Drawers/MobileControllerDrawer";

function MobileNavBar() {

    const navigate = useNavigate();

  return (
   <>
    <Toolbar style={{ justifyContent: "center" , position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1000,
          marginBottom: "100px",}}>
    <MobileControllerDrawer>
          <IconButton>
            <Icon>
              <TuneIcon />
            </Icon>
          </IconButton>
          </MobileControllerDrawer>

        <Typography variant="h4" style={{ flexGrow: 1, textAlign: "center" }} onClick={()=>{navigate('/')}}>
          ZIVENTA
        </Typography>

        <IconButton onClick={() => navigate("/cart")}>
                <Icon>
                  <ShoppingCartIcon />
                </Icon>
              </IconButton>
          

            <IconButton onClick={() => navigate("/profile")}>
              <Icon>
                <AccountCircleIcon />
              </Icon>
            </IconButton>
      </Toolbar>
      <div style={{ marginBottom: "60px" }}></div>
   </>
  )
}

export default MobileNavBar