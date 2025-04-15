import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, Lock, LogIn } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Both email and password are required!',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, { email, password });
      if (response.data.message === "Login successful") {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You have been logged in successfully.',
          confirmButtonColor: '#ef4444',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          Cookies.set("token", response.data.data);
          localStorage.setItem("token", response.data.data);
          window.location.href = "http://localhost:5173/";
        });
      }
    } catch (error) {
      if (error.response.data.message === "User not verified") {
        Swal.fire({
          icon: 'info',
          title: 'Account Not Verified',
          text: 'Redirecting to verification page...',
          confirmButtonColor: '#ef4444',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate("/otp/" + email);
        });
      } else {
        setErrorMessage("Enter valid credentials");
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Please check your email and password and try again.',
          confirmButtonColor: '#ef4444',
        });
      }
    }
    setErrorMessage("");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white font-[Poppins] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-red-500"
      >
        <h1 className="text-4xl font-bold text-red-500 mb-6 text-center uppercase tracking-wider">
          Login
        </h1>
        <div className="space-y-6">
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-500 hover:shadow-lg hover:shadow-red-500 transition duration-300">
            <Mail size={24} className="text-red-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-500 hover:shadow-lg hover:shadow-red-500 transition duration-300">
            <Lock size={24} className="text-red-500 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
          >
            <LogIn size={24} />
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 