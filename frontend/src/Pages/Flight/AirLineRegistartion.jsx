import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlane, FaUserTie, FaTicketAlt, FaChair } from "react-icons/fa";

const AirlineOwnerRegistration = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [formData, setFormData] = useState({
    flightName: "",
    airlineName: "",
    seats: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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
            {/* Flight Name */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Flight Name
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaTicketAlt className="text-red-500 text-xl mr-3" />
                <input
                  type="text"
                  name="flightName"
                  value={formData.flightName}
                  onChange={handleChange}
                  placeholder="Enter Flight Name"
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

            {/* Seats */}
            <div>
              <label className="block text-white text-lg font-semibold mb-1">
                Number of Seats
              </label>
              <div className="flex items-center bg-black border-2 border-red-500 rounded-lg px-4 py-3">
                <FaChair className="text-red-500 text-xl mr-3" />
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="Enter Number of Seats"
                  min="1"
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
