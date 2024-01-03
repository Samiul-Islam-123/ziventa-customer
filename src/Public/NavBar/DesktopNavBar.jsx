import React from 'react';
import { Routes, Route } from "react-router-dom"
import { Toolbar, Typography, Button, IconButton, Icon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function DesktopNavBar() {

    const navigate = useNavigate();

    return (
        <>
            <Toolbar style={{

            }}>
                <Typography variant="h4" style={{ flexGrow: "0.5", cursor: "pointer" }} onClick={() => { navigate('/') }}>
                    ZIVENTA
                </Typography>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button color="inherit" onClick={() => navigate("/products/shirt")}>
                        Shirts
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/products/t-shirt")}>
                        T-Shirts
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/products/pant")}>
                        Pants
                    </Button>
                </div>

                <div style={{ marginLeft: "auto" }}>

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
                </div>

            </Toolbar>
        </>
    )
}

export default DesktopNavBar