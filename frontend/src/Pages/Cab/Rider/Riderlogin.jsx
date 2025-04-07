import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, X, CheckCircle, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../../config";

const Login = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("signin");
    
      if (!email || !password) {
        setErrorMessage("Both email and password are required.");
        return;
      }
    
      
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
          alert("Enter Valid Detail")
          setErrorMessage(response.message || "Login failed");
        }
      }

    return (
        <div className="h-screen w-full overflow-hidden bg-cover bg-center flex items-center justify-center relative" 
            style={{ backgroundImage: "url('https://cdn.vectorstock.com/i/1000v/79/88/taxi-car-front-view-in-dark-background-vector-43697988.avif')" }}>
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Centered Popup Notifications */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
                            <div className="flex flex-col items-center text-center">
                                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Login Successful!</h3>
                                <p className="text-gray-300 mb-4">You're being redirected to your dashboard</p>
                                <motion.div
                                    className="h-1 bg-green-500 rounded-full w-full overflow-hidden"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "linear" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
                            <div className="flex flex-col items-center text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Login Failed</h3>
                                <p className="text-gray-300 mb-4">{errorMessage}</p>
                                <button
                                    onClick={() => setShowError(false)}
                                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glass-morphism login container */}
            <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 shadow-2xl transition-all hover:shadow-3xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Welcome Back
                </h2>

                <form className="space-y-6">
                    {/* Email Input */}
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

                    {/* Password Input */}
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

                    {/* Submit Button */}
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
            </div>
        </div>
    );
};

export default Login;