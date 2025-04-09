import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { KeyRound } from 'lucide-react';
import { BASE_URL } from '../../../../config';

const ComplateVerified = () => {
  const { email } = useParams();
  const { id } = useParams();
  console.log(id)

  console.log("ok")
  console.log(email)
  useEffect(() => {
    console.log(email)

  }, [])
  const [otp, setOtp] = useState(['', '', '', '']);
  const nevigate = useNavigate()
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
        const response = await fetch(`${BASE_URL}/api/Rv/Rider/complate-veriyfy`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp: otpValue })
          }
        )
        const data = await response.json();
        console.log(data)
        if (data.message === "Rider verified successfully") {
          try {
            await fetch(`${BASE_URL}/api/Rv/booking/completedbooking/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "completed" }),
            });
            nevigate("/booking/riderdashboard")
          
          } catch (error) {
            console.error("Error completing ride:", error);
          }
        }
     else{
      alert("Enter valid otp Please...")
     }
      } catch (error) {
        console.error('Error occurred:', error.response || error);
        alert(error.response.data.message);
      }
    } else {
      alert('Please enter a 4-digit OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className=" border-2 border-red-500 rounded-xl p-6 max-w-sm w-full text-center shadow-red-500 shadow-md">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-red-500 mb-4">Enter OTP</h2>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength={1}
              className="w-12 h-12  text-white text-center text-2xl border border-red-500 rounded-lg focus:outline-none focus:border-red-600 transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-white-600 text-white font-bold text-lg py-2 rounded-lg transition-all"
        >
          <KeyRound size={22} />
          Submit OTP
        </button>
      </div>
    </div>
  );
};

export default ComplateVerified;

