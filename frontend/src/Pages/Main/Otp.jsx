import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';

const OtpPage = () => {
    const { email } = useParams();
    const [otp, setOtp] = useState(['', '', '', '']);

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            confirmButtonColor: "#ef4444",
            background: "#000",
            color: "#fff",
        });
    };

    const showSuccessAlert = (message) => {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            confirmButtonColor: "#ef4444",
            background: "#000",
            color: "#fff",
        });
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Allow only numeric input

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleSubmit = async () => {
        let otpValue = otp.join('');
        if (otpValue.length !== 4) {
            showErrorAlert('Please enter a 4-digit OTP');
            return;
        }

        otpValue = parseInt(otpValue);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/verify-otp`,
                { email, otp: otpValue },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.message === "User verified successfully") {
                Cookies.set('token', response.data.data);
                localStorage.setItem("token", response.data.data);

                await showSuccessAlert("OTP verified successfully! Redirecting to home page...");
                window.location.href = "http://localhost:5173/";
            } else {
                showErrorAlert(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error occurred during OTP verification";
            console.error('Error occurred:', error.response || error);
            showErrorAlert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="bg-black border-2 border-red-500 rounded-xl p-6 max-w-sm w-full text-center shadow-red-500 shadow-md">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-red-500 mb-4">Enter OTP</h2>
                <p className="text-gray-400 mb-6">We've sent a verification code to {email}</p>

                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => {
                                // Handle backspace to move to previous input
                                if (e.key === 'Backspace' && !digit && index > 0) {
                                    document.getElementById(`otp-input-${index - 1}`).focus();
                                }
                            }}
                            maxLength={1}
                            className="w-12 h-12 bg-black text-white text-center text-2xl border border-red-500 rounded-lg focus:outline-none focus:border-red-600 transition-all"
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-2 rounded-lg transition-all"
                >
                    <KeyRound size={22} />
                    Verify OTP
                </button>
            </div>
        </div>
    );
};

export default OtpPage;