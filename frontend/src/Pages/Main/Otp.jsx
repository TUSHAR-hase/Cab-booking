import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const OtpPage = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const [otp, setOtp] = useState(['', '', '', '']); // Changed to hold 4 digits

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Allow only numeric input
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus on next input field automatically
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    // Submit OTP
    const handleSubmit = async () => {
        let otpValue = otp.join('');
        if (otpValue.length === 4) {
          otpValue=parseInt(otpValue);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/user/verify-otp`,
                    { email, otp: otpValue },  // Send OTP as a string
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if(response.data.message === "User verified successfully"){
                    Cookies.set('token', response.data.data);
                    window.location.href = "http://localhost:5173/";
                }
                alert(response.data.message);
            } catch (error) {
                console.error('Error occurred:', error.response || error);
                alert(error.response.data.message);
            }
        } else {
            alert('Please enter a 4-digit OTP');  // Updated message
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
            <h2>Enter OTP</h2>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {otp.map((digit, index) => (
                    <TextField
                        key={index}
                        id={`otp-input-${index}`}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', width: '40px' },
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ margin: '0 4px' }}
                    />
                ))}
            </Box>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleSubmit}
            >
                Submit OTP
            </Button>
        </Box>
    );
};

export default OtpPage;
