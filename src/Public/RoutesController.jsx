import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import PasswordResetVerification from "../Auth/PasswordResetVerification";
import PasswordReset from "../Auth/PasswordReset";
import OTPVerification from "../Auth/OTPVerification"
import LandingPage from './LandingPage/LandingPage';


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
        

        
      </Routes>
    </>
  )
}

export default RoutesController