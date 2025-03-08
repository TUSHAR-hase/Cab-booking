import React from "react";
import { useNavigate } from "react-router-dom";

const OtpVerified = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate("/booking/dashboard")}
          className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-semibold
                    transform transition-all hover:scale-[1.02] hover:from-green-600 hover:to-green-700
                    active:scale-95 shadow-lg hover:shadow-green-500/20"
        >
          Proceed
        </button>

        {/* Back to Home */}
        <div className="mt-6 flex justify-center text-sm">
          <button 
            onClick={() => navigate("/ridersignup")}
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

