import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { User, Mail, Lock, Phone, Users, UserPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("customer");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender || !contact || !email || !password || !type) {
      setError("All fields are required");
      return;
    }

    const userData = { name, gender, contact, email, type, password };
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, userData);
      if (response.data.statusCode === 201) {
        navigate("/otp/" + email);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error occurred during registration");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-[Poppins] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg border border-red-500"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-6 text-center uppercase tracking-wider">
          Register
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4 sm:space-y-6">
          {/* Name */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <User size={22} className="text-red-500 mr-3" />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-white focus:outline-none text-base sm:text-lg" />
          </div>

          {/* Gender */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <Users size={22} className="text-red-500 mr-3" />
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-black text-gray-400 focus:outline-none text-base sm:text-lg">
              <option value="" disabled className="bg-black text-white">Select Gender</option>
              <option value="male" className="bg-black text-white">Male</option>
              <option value="female" className="bg-black text-white">Female</option>
              <option value="other" className="bg-black text-white">Other</option>
            </select>
          </div>

          {/* Contact */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <Phone size={22} className="text-red-500 mr-3" />
            <input 
              type="number" 
              placeholder="Contact" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              className="w-full bg-transparent text-white focus:outline-none text-base sm:text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <Mail size={22} className="text-red-500 mr-3" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-white focus:outline-none text-base sm:text-lg" />
          </div>

          {/* User Type */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <User size={22} className="text-red-500 mr-3" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-black text-gray-400 focus:outline-none text-base sm:text-lg">
              <option value="customer" className="bg-black text-white">Customer</option>
              <option value="hotelOwner" className="bg-black text-white">Hotel Owner</option>
              <option value="cabOwner" className="bg-black text-white">Cab Owner</option>
              <option value="flightOwner" className="bg-black text-white">Flight Owner</option>
            </select>
          </div>

          {/* Password */}
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-2 sm:py-3">
            <Lock size={22} className="text-red-500 mr-3" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-white focus:outline-none text-base sm:text-lg" />
          </div>

          {/* Register Button */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg"
          >
            <UserPlus size={22} />
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
