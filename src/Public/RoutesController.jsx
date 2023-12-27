import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import PasswordResetVerification from "../Auth/PasswordResetVerification";
import PasswordReset from "../Auth/PasswordReset";
import OTPVerification from "../Auth/OTPVerification"
import LandingPage from './LandingPage/LandingPage';
import Products from './Products/Products';
import { checkAuthentication } from '../auth';
import Cart from "../Private/Cart/Cart"
import Profile from "./../Private/Profile/Profile"
import ProductDetails from "../Private/ProductDetails/ProductDetails"

function RoutesController() {
  return (
    <>
        <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route
          exact
          path="/password-reset/verification"
          element={<PasswordResetVerification />}
        />
        <Route exact path="/password-reset" element={<PasswordReset />} />
        <Route
          exact
          path="/otp-verification/:email"
          element={<OTPVerification />}
        />
        <Route exact path="/products/:category" element={<Products />} />

        <Route
          exact
          path="/products/details/:ProductID"
          element={<ProductDetails checkAuthentication={checkAuthentication} />}
        />
        
        <Route
          exact
          path="/cart"
          element={<Cart checkAuthentication={checkAuthentication} />}
        />

<Route
          exact
          path="/profile"
          element={<Profile checkAuthentication={checkAuthentication} />}
        />

      </Routes>
    </>
  )
}

export default RoutesController