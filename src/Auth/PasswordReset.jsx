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
import Cookies from "js-cookie"

export default function PasswordReset() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        //checking for all fields
        if (confirmPassword != '' && password != '') {
            //proceed further

            if (confirmPassword === password) {

                const email = localStorage.getItem('email');
                const res = await axios.post(`${apiURL}/authentication/password-reset`, {
                    newPassword: password,
                    email: email
                })

                if (res.data.message == "OK") {
                    alert("Your Password has been changed successfully");
                    navigate("/login");

                }

                else {
                    console.log(res.data);
                    alert(res.data.message)
                }

            }
            else {
                alert("Password not Confimed :(");
            }

        }


        else {
            //show error
            alert('please fill all fields')
        }

        setLoading(false)
    };

    return (

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
                <Typography component="h1" variant="h5">
                    Enter new Password
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>


                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                }}
                                required
                                fullWidth
                                name="password"
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>

                    </Grid>
                    <Button

                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {
                            !loading ? (<>Done</>) : (<CircularProgress size={30} color='inherit' />)
                        }
                    </Button>





                </Box>
            </Box>
        </Container>
    );
}