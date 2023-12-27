import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiURL from '../apiURL';
import Cookies from "js-cookie";
import OTPInput from './OTPInput';
import { useParams } from 'react-router-dom';

function OTPVerification(props) {

    const navigate = useNavigate();
    const { email } = useParams();

    const [otp, setOTP] = useState(null)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        //checking for all fields
        if (otp != null) {
            //verifying

            const res = await axios.post(apiURL + "/authentication/verify", {
                otp: otp,
                email: email
            })
            if (res.data.message == 'OK') {
                //navigate to login page
                navigate('/login')
            }
            else {
                console.log(res.data)
                alert(res.data.message)
            }
        }
        else
            alert('please enter otp')
        setLoading(false);
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        OTP Verification
                    </Typography>

                    <Typography component="h1" variant="h6">
                        An OTP has been sent to your mail
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 3 }}>


                        <TextField
                            label='Enter OTP'
                            variant='outlined'
                            fullWidth
                            type='Number'
                            onChange={(e) => {
                                setOTP(e.target.value);
                            }}
                        />



                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            Verify
                        </Button>




                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default OTPVerification