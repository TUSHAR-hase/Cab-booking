import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlane, FaUserTie, FaTicketAlt,FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AirlineOwnerRegistration = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
    airlineName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response= await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flightadmin/register`,
        formData
      );

      if (response.data.statusCode === 201) {
        navigate("/flight/otp/" + formData.email);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 font-[Poppins]">
      <div className="bg-black p-10 rounded-xl shadow-2xl border border-red-500 max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Icon & Title */}
          <FaPlane className="mx-auto h-16 w-16 text-red-500 mb-4 animate-bounce" />
          <h2 className="text-4xl font-extrabold text-white text-center uppercase tracking-wide">
            Airline <span className="text-red-500">Owner</span> Registration
          </h2>
          <p className="text-white text-center mt-2 mb-6 text-lg font-light">
            Register your airline & manage flights effortlessly.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Name
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaUser className="text-red-500 text-xl mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Email
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaUser className="text-red-500 text-xl mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* PAssword */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Password
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaTicketAlt className="text-red-500 text-xl mr-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Gender
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaUser className="text-red-500 text-xl mr-3" />
                <div className="flex space-x-4">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>


            {/* PAssword */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Mobile
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaTicketAlt className="text-red-500 text-xl mr-3" />
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter Mobile"
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Airline Name */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Airline Name
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaUserTie className="text-red-500 text-xl mr-3" />
                <input
                  type="text"
                  name="airlineName"
                  value={formData.airlineName}
                  onChange={handleChange}
                  placeholder="Enter Airline Name"
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold tracking-wide hover:bg-white hover:text-black transition-all duration-300 border-2 border-red-500 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlane className="text-xl" /> Register Airline
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AirlineOwnerRegistration;
