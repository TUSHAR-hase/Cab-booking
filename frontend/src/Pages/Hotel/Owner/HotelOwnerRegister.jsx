import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHotel, FaUser, FaEnvelope, FaLock, FaBuilding, FaClipboardList } from "react-icons/fa";

const HotelOwnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessRegNo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, businessName, businessRegNo } = formData;

    if (!name || !email || !password || !businessName || !businessRegNo) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/hotel/owner/register`,
        formData
      );

      if (response.data.statusCode === 201) {
        navigate(`/verify/${email}`); // Redirect to OTP verification page
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error occurred during registration");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-black border-2 border-red-500 rounded-xl p-8 max-w-md w-full text-center shadow-red-500 shadow-lg">

        {/* Hotel Icon */}
        <FaHotel className="text-red-500 text-7xl mx-auto mb-4" />

        <h2 className="text-3xl font-bold uppercase tracking-wide text-red-500 mb-2">
          Hotel Owner <span className="text-white">Registration</span>
        </h2>
        <p className="text-gray-400 mb-6">Register your hotel & manage bookings effortlessly.</p>

        {error && <p className="text-red-500 text-md mb-4">{error}</p>}

        <div className="space-y-5 text-left">
          {/* Full Name */}
          <label className="text-sm font-semibold">Full Name</label>
          <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
            <FaUser className="text-red-500 mr-3" />
            <input
              type="text"
              name="name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black text-white focus:outline-none"
            />
          </div>

          {/* Email */}
          <label className="text-sm font-semibold">Email</label>
          <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
            <FaEnvelope className="text-red-500 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black text-white focus:outline-none"
            />
          </div>

          {/* Password */}
          <label className="text-sm font-semibold">Password</label>
          <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
            <FaLock className="text-red-500 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black text-white focus:outline-none"
            />
          </div>

          {/* Business Name */}
          <label className="text-sm font-semibold">Business Name</label>
          <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
            <FaBuilding className="text-red-500 mr-3" />
            <input
              type="text"
              name="businessName"
              placeholder="Enter Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-black text-white focus:outline-none"
            />
          </div>

          {/* Business Registration Number */}
          <label className="text-sm font-semibold">Business Reg. No.</label>
          <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
            <FaClipboardList className="text-red-500 mr-3" />
            <input
              type="text"
              name="businessRegNo"
              placeholder="Enter Business Reg. No."
              value={formData.businessRegNo}
              onChange={handleChange}
              className="w-full bg-black text-white focus:outline-none"
            />
          </div>
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <a
              href="http://localhost:5173/login/hotel"
              className="text-red-500 hover:underline"
            >
              Login here
            </a>
          </p>
          {/* Register Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 text-lg rounded-lg flex items-center justify-center space-x-2"
          >
            <FaHotel /> <span>Register Hotel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerRegister;