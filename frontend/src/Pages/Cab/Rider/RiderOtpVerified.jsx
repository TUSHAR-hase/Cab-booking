import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { KeyRound } from 'lucide-react';
import { BASE_URL } from '../../../../config';

const OtpVerified = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [otp, setOtp] = useState(['', '', '', '']);

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
    if (otpValue.length === 4) {
      otpValue = parseInt(otpValue);
      try {
        const response = await axios.post(`${BASE_URL}/api/Rv/Rider/verify-otp`,
          { email, otp: otpValue },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.message === "User verified successfully") {
          Cookies.set('token', response.data.data);
          navigate("/booking/riderdashboard")
        }
        alert(response.data.message);
      } catch (error) {
        console.error('Error occurred:', error.response || error);
        alert(error.response.data.message);
      }
    } else {
      alert('Please enter a 4-digit OTP');
    }
  };
  return (
    <div className="h-screen w-full overflow-hidden bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('https://cdn.vectorstock.com/i/1000v/79/88/taxi-car-front-view-in-dark-background-vector-43697988.avif')" }}>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glass-morphism OTP verified container */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 shadow-2xl transition-all hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          OTP Verified
        </h2>

        <p className="text-white/70 text-center mb-6">Your OTP has been successfully verified. You can now proceed.</p>

        {/* Proceed Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-semibold
                    transform transition-all hover:scale-[1.02] hover:from-green-600 hover:to-green-700
                    active:scale-95 shadow-lg hover:shadow-green-500/20"
        >
          Proceed
        </button>

        {/* Back to Home */}
        <div className="mt-6 flex justify-center text-sm">
          <button
            onClick={handleSubmit}
            className="text-white/70 hover:text-green-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerified;

