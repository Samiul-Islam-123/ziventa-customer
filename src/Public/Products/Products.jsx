import React, { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import apiURL from "../../apiURL";
import Cookies from "js-cookie";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { ConnectingAirportsOutlined, ConstructionOutlined } from "@mui/icons-material";
import ProductCard from "../ProductCard";

function Products() {
  const { category } = useParams();
  const [productsData, setProducts] = useState([]);
  const [listView, SetListView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [selectedAge, setSelectedAge] = useState(null); // or set an initial value if needed
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  const handleAgeChange = (event, value) => {
    setSelectedAge(value);
  };

  const handlePriceChange = (event, value) => {
    setSelectedPriceRange(value);
  };

  const { filterValue } = useParams();

  const Categories = ["All", "Men", "Women", "Kids"];
  const ageRange = [
    "2-4 years (Toddlers)",
    "5-12 years (Kids)",
    "13-19 years (Teenagers)",
    "20-64 years (Adults)",
    "65-100 years (Seniors)",
  ];
  const priceRange = [
    { label: "Under ₹500", value: "0-500" },
    { label: "₹500 - ₹1,000", value: "500-1000" },
    { label: "₹1,000 - ₹2,000", value: "1000-2000" },
    { label: "₹2,000 - ₹5,000", value: "2000-5000" },
    { label: "Over ₹5,000", value: "5000+" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true)
    //console.log(category)
    const token = Cookies.get("access_token");
    const response = await axios.get(
      `${apiURL}/app/client/products/${category}`
    );
    //console.log(`Request URL : ${apiURL}/app/client/products/${category}`)
    //console.log(response);
    if (response.data.message == "OK") setProducts(response.data.products);
    else {
      alert(response.data.message);
      console.log(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (filterValue) SearchProducts();
  }, [filterValue]);

  const SearchProducts = () => {
    var output = [];
    productsData.forEach((item) => {
      if (
        item.ProductTitle.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.ProductDescription.toLowerCase().includes(
          filterValue.toLowerCase()
        ) ||
        (item.Category && item.Category.includes(filterValue))
      ) {
        output.push(item);
      }
    });
    setFilteredProducts(output);
  };

  useEffect(() => {
    filterProducts(selectedAge, selectedPriceRange);
  }, [selectedAge, selectedPriceRange]);

  const isPriceInRange = (selectedValue, productPrice) => {
    switch (selectedValue) {
      case "0-500":
        return productPrice <= 500;
      case "500-1000":
        return productPrice > 500 && productPrice <= 1000;
      case "1000-2000":
        return productPrice > 1000 && productPrice <= 2000;
      case "2000-5000":
        return productPrice > 2000 && productPrice <= 5000;
      case "5000+":
        return productPrice > 5000;
      default:
        return false;
    }
  };

  const filterProducts = (selectedAge, selectedPriceRange) => {
    const filteredProducts = productsData.filter((item) => {
      const metaData = item.ProductMetaData;
      const productPrice = item.ProductPrice;

      // Check if the AgeRange matches the selected age
      const isAgeMatch = selectedAge ? metaData.AgeRange === selectedAge : true;

      // Check if the PriceRange matches the selected price range
      // Check if the PriceRange matches the selected price range
      const isPriceMatch = selectedPriceRange
        ? isPriceInRange(selectedPriceRange.value, productPrice)
        : true;

      // Return true only if both AgeRange and PriceRange match the selected values
      return isAgeMatch && isPriceMatch;
    });

    setFilteredProducts(filteredProducts);
  };

  const FilterOptions = [
    {label : "Price : High > Low", option : 1},
    {label : "Price : Low < High", option : 2},
    {label : "High Rating First", option : 3},
    {label : "Recent", option : 4},
  ];

  const handlefilterChange = async(event, selectedFilter)=>{
    if(selectedFilter){
      setLoading(true)
      var filterResponse = null;
      console.log(selectedFilter.option);
      switch(selectedFilter.option){
      case 1 :
        filterResponse = await axios.get(
          `${apiURL}/app/client/${category}/filter/price/high-low`
          );
          break;

          case 2 :
            //console.log(`${apiURL}/app/client/filter/price/hight-low`)
            filterResponse = await axios.get(
            `${apiURL}/app/client/${category}/filter/price/low-high`
          );
          break;
          
          case 3 :
            filterResponse = await axios.get(
              `${apiURL}/app/client/${category}/filter/rating-first`
              );
        break;
        
        case 4 :
          filterResponse = await axios.get(
          `${apiURL}/app/client/${category}/filter/recent-first`
          );
          break;
          
          default :
          alert("invalid filter selected :(");
          break;
          
        }
        
        console.log(filterResponse)
        if(filterResponse.data.message === "OK")
        setProducts(filterResponse.data.products);

      else
      {
        console.log(filterResponse);
        alert(filterResponse.data.message)
      }
      setLoading(false);
    }
    }

    const handleSearchQuery = async(e)=>{
      const query = e.target.value;
      setStatus("")
      if(query){
        setLoading(true);
        const SearchResponse = await axios.get(`${apiURL}/app/client/search/${query}`);
        if(SearchResponse.data.message === "OK")
        setProducts(SearchResponse.data.products);
        if(SearchResponse.data.message === "error")
        {
          alert("ERROR :(")
        }
        if(SearchResponse.data.message === "No products found :(")
        {
          setStatus(SearchResponse.data.message)
        }

      setLoading(false)
      }
      else{
       await fetchProducts();
      }
    }
    
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

        <div
          style={{
            display: "flex",
          }}
        >
          <TextField onChange={handleSearchQuery} variant="outlined" label="Search Title, Category or Description" fullWidth />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={FilterOptions}
            onChange={handlefilterChange}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Filter" />}
          />
        </div>

        {status!="" ? (<>
          {status}
        </>) : null}

        <Typography
          variant="h3"
          style={{
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          {category}s 
        </Typography>

        <Grid container spacing={2}>
          {productsData.map((item) => {
            return (
              <>
                <Grid item xs={12} md={4}>
                  <ProductCard
                    imageURL={item.ProductImages[0]}
                    imagwWidth="300px"
                    imageHeight="400px"
                    ProductTitle={item.ProductTitle}
                    ProductPrice={item.ProductPrice}
                    _id = {item._id}
                  />
                </Grid>
              </>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}

export default Products;
