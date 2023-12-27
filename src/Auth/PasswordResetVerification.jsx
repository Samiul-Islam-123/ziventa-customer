import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import axios from 'axios';
import apiURL from '../apiURL';
import { Divider } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

function PasswordResetVerification() {
    const [OTP, setOTP] = useState(null)
    const [email, setEmail] = useState(null);
    const [firstPart, activateFirstPart] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

                    <Box component="form" noValidate sx={{ mt: 3 }}>

                        {
                            firstPart ? (<>
                                <Typography variant="h7" >
                                    Please Enter your Email ID for verification
                                </Typography>
                                <TextField
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    style={{ 'marginTop': "20px" }}
                                    label="Enter your email ID"
                                    variant='outlined'
                                    fullWidth
                                    type='email'
                                />

                                <Button
                                    onClick={async () => {
                                        setIsLoading(true);
                                        //perform api request
                                        //save email to local storage
                                        localStorage.setItem('email', email)
                                        const res = await axios.post(`${apiURL}/authentication/request-password-reset`, {
                                            email: email
                                        })
                                        if (res.data.message == "OK")
                                            activateFirstPart(!firstPart);

                                        else {
                                            console.log(res.data);
                                            alert(res.data.message);
                                        }
                                        setIsLoading(false);
                                    }}
                                    style={{ "marginTop": "5px" }}
                                    fullWidth
                                    disabled={isLoading}
                                    variant='contained'
                                >
                                    {
                                        isLoading ? (<CircularProgress size={30} color='inherit' />) : (<>Send OTP</>)
                                    }
                                </Button>

                            </>) : (<>
                                <Typography variant="h7" >
                                    To reset your Password, please Enter the OTP that has been sent to your mail
                                </Typography>

                                <TextField
                                    style={{ 'marginTop': "50px" }}
                                    fullWidth
                                    type='Number'
                                    label="Enter OTP"
                                    variant='outlined'
                                />

                                <Button
                                    onClick={async () => {
                                        setIsLoading(true);
                                        //perform api request
                                        const res = await axios.post(`${apiURL}/authentication/verify`, {
                                            email: email,
                                            otp: OTP
                                        })
                                        if (res.data.message == "OK")
                                            navigate('/password-reset');

                                        else {
                                            console.log(res.data);
                                            alert(res.data.message);
                                        }
                                        setIsLoading(false);
                                    }}
                                    disabled={isLoading}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {
                                        isLoading ? (<CircularProgress size={30} color='inherit' />) : (<>Verify</>)
                                    }
                                </Button>

                            </>)
                        }





                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default PasswordResetVerification