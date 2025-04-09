
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, Lock, LogIn } from "lucide-react";
import { BASE_URL } from "../../../../config";
const Login = () => {
    const navigate = useNavigate();
    const {id}=useParams()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
   
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("signin");
    
      if (!email || !password) {
        setErrorMessage("Both email and password are required.");
        return;
      }
    
      try {
        const res = await fetch(`${BASE_URL}/api/Rv/Rider/loginRider`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
    
        const response = await res.json();
    
        console.log("API Response:", response);
    
        if (res.ok) {
          Cookies.set("ridertoken", response.token);
          localStorage.setItem("ridertoken",response.token)
          // localStorage.getItem()
          navigate("/booking/riderdashboard"); 
        } else {
          setErrorMessage(response.message || "Login failed");
        }
      } catch (error) {
        console.error("Login request error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
    };
    
  
  return (
    <div className="h-screen w-full overflow-hidden bg-cover bg-center flex items-center justify-center relative" 
         style={{ backgroundImage: "url('https://cdn.vectorstock.com/i/1000v/79/88/taxi-car-front-view-in-dark-background-vector-43697988.avif')" }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glass-morphism login container */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 shadow-2xl transition-all hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form className="space-y-6">
          {/* Email Input with floating label effect */}
          <div className="group relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent 
                       peer focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Email"
            />
            <label 
              htmlFor="email"
              
              className="absolute left-4 -top-2.5 px-1 text-white/80 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5
                         peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-300 bg-transparent"
            >
              Email
            </label>
          </div>

          {/* Password Input with floating label */}
          <div className="group relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent 
                       peer focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Password"
            />
            <label 
              htmlFor="password"
              className="absolute left-4 -top-2.5 px-1 text-white/80 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5
                         peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-300 bg-transparent"
            >
              Password
            </label>
          </div>

          {/* Animated Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-semibold
                      transform transition-all hover:scale-[1.02] hover:from-red-600 hover:to-red-700
                      active:scale-95 shadow-lg hover:shadow-red-500/20"
          >
            Sign In
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 flex justify-center text-sm">
          <a href="/forgetpassword" className="text-white/70 hover:text-red-300 transition-colors">
            Forgot Password?
          </a>
          <span className="text-white mx-2 opacity-50">|</span>
          <a href="/booking/ridersignup" className="text-white/70 hover:text-red-300 transition-colors">
            Create Account
          </a>
        </div>

        {/* Social Login Divider */}
     
      </div>
    </div>
  );
};

export default Login;