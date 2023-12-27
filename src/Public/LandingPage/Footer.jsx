import { IconButton, Paper, Typography, Icon } from "@mui/material";
import React from "react";
import logo from "../../Assets/logo2.jpg";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer() {
  return (
    <>
      <Paper
        color="#333333"
        style={{
          backgroundColor: "#333333",
          height: "40vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color={"white"}>ZIVENTA</Typography>

        {/*Logo */}

        <div>
          <img src={logo} width={"100px"} style={{ borderRadius: "10%" }} />
        </div>

        <div >
          <IconButton>
            <Icon style={{
              color :"white"
            }}>
              <FacebookIcon />
            </Icon>
          </IconButton>

          <IconButton>
            <Icon style={{
              color :"white"
            }}>
              <InstagramIcon />
            </Icon>
          </IconButton>

          <IconButton>
            <Icon style={{
              color :"white"
            }}>
              <YouTubeIcon />
            </Icon>
          </IconButton>
        </div>
      </Paper>
    </>
  );
}

export default Footer;
