import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../config";

export default function RiderSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    conformpassword: "",
    licence_number: "",
    
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.conformpassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("Signup submitted:", formData);

    try {
      const res = await fetch(`${BASE_URL}/api/Rv/Rider/createRider`, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    
      });
      console.log("Full Response:", res);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
    
      console.log("Response Data:", data);
      if (data) {
        // localStorage.setItem("")
        setTimeout(() => {
          alert("Otp sent on Email ");
      navigate("/otprider/"+formData.email); 

    // navigate("/booking/riderlogin"+"/"+formData.email+"/"+data.user._id);
         
        }, 2000);
      }
     } catch (e) {
      console.log(e)
     }finally {
     
    }
        
    
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black">
      <div className="m-5 flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-120 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-red-500">
            Create an Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div className="relative" key={key}>
                {/* Input with floating label effect */}
                <input
                  type={key.includes("password") ? "password" : "text"}
                  name={key}
                  id={key}
                  placeholder=" "
                  value={formData[key]}
                  onChange={handleChange}
                  className="peer w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-red-400 transition-colors"
                  required
                />
                <label
                  htmlFor={key}
                  className="absolute left-4 -top-2.5 px-1 text-white/80 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-300 bg-transparent"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3.5 bg-red-500 rounded-lg text-white font-semibold transform transition-all hover:scale-[1.02] hover:bg-red-600 active:scale-95 shadow-lg"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4 text-gray-300">
            Already have an account?{" "}
            <span
              className="text-red-400 cursor-pointer hover:underline"
              onClick={() => navigate("/riderlogin")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
