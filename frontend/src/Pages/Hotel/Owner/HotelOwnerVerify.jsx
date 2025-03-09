import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaKey } from "react-icons/fa";

const VerifyHotelOwnerOtp = () => {
  const { email } = useParams(); // Get email from URL params
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/hotel/owner/verify-otp`,
        { email, otp: parseInt(otpValue) }
      );

      if (response.data.message === "Hotel Owner verified successfully") {
        alert("OTP Verified Successfully!");
        navigate("/dashboard"); // Redirect to dashboard after success
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response || error);
      setError("Invalid OTP, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-black border-2 border-red-500 rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Verify OTP</h2>
        <p className="text-gray-400 mb-4">Enter the 4-digit OTP sent to your email.</p>

        {error && <p className="text-red-500 text-md mb-4">{error}</p>}

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              maxLength={1}
              className="w-12 h-12 bg-black text-white text-center text-2xl border border-red-500 rounded-lg focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleOtpSubmit}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-2 rounded-lg"
        >
          <FaKey /> Submit OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyHotelOwnerOtp;
