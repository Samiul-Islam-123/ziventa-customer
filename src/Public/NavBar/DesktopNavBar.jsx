import React, { useEffect, useState } from 'react';
import { Toolbar, Typography, Button, IconButton, Icon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import apiURL from '../../apiURL';

function DesktopNavBar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiURL}/app/client/products-categories`);
        if (response.data.message === "OK") {
          // Remove duplicates by creating a Set and converting it back to an array
          const uniqueCategories = [...new Set(response.data.categories)];
          setCategories(uniqueCategories);
        } else {
          console.error(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Toolbar>
        <Typography variant="h4" style={{ flexGrow: "0.5", cursor: "pointer" }} onClick={() => { navigate('/') }}>
          ZIVENTA
        </Typography>

        <div style={{ display: "flex", alignItems: "center" }}>
          {categories.map((category, index) => (
            <Button key={index} color="inherit" onClick={() => navigate(`/products/${category.toLowerCase()}`)}>
              {category}
            </Button>
          ))}
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
  );
}

export default DesktopNavBar;
