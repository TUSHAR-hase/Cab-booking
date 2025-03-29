import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plane, Route, DollarSign, Clock, Briefcase } from "lucide-react";

const FlightRegister = () => {
  const [formData, setFormData] = useState({
    flightNo: "",
    route: "",
    class: "",
    price: "",
    departure: "",
    arrival: "",
    flight_name: "",
    number_of_seats: "",
    status: "On-Time"
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const flightData = {
        flight_name: formData.flight_name,
        number_of_seats: parseInt(formData.number_of_seats),
        status: formData.status,
        flightNo: formData.flightNo,
        route: formData.route,
        class: formData.class,
        price: parseFloat(formData.price),
        departure: formData.departure,
        arrival: formData.arrival
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/flights`, flightData);
      
      // Reset form
      setFormData({
        flightNo: "",
        route: "",
        class: "",
        price: "",
        departure: "",
        arrival: "",
        flight_name: "",
        number_of_seats: "",
        status: "On-Time"
      });
      
      alert("Flight registered successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error registering flight!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black border-2 border-red-500 rounded-xl p-8 max-w-4xl w-full text-center shadow-red-500 shadow-lg"
      >
        <h1 className="text-4xl font-bold uppercase tracking-wide text-red-500 mb-2">
          Flight <span className="text-white">Registration</span>
        </h1>
        <p className="text-gray-400 mb-6">Register new flights with detailed information</p>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">Flight Number</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Briefcase className="text-red-500 mr-3" />
                <input
                  type="text"
                  name="flightNo"
                  placeholder="Flight Number"
                  value={formData.flightNo}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Flight Name</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Plane className="text-red-500 mr-3" />
                <input
                  type="text"
                  name="flight_name"
                  placeholder="Flight Name"
                  value={formData.flight_name}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Number of Seats</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Plane className="text-red-500 mr-3" />
                <input
                  type="number"
                  name="number_of_seats"
                  placeholder="Number of Seats"
                  value={formData.number_of_seats}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Route</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Route className="text-red-500 mr-3" />
                <input
                  type="text"
                  name="route"
                  placeholder="Origin - Destination"
                  value={formData.route}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Class</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Briefcase className="text-red-500 mr-3" />
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First Class</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Price</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <DollarSign className="text-red-500 mr-3" />
                <input
                  type="number"
                  name="price"
                  placeholder="Ticket Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Status</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Briefcase className="text-red-500 mr-3" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                >
                  <option value="On-Time">On-Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Departure</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Clock className="text-red-500 mr-3" />
                <input
                  type="datetime-local"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">Arrival</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                <Clock className="text-red-500 mr-3" />
                <input
                  type="datetime-local"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 text-lg rounded-lg flex items-center justify-center space-x-2 mt-6"
          >
            <Plane className="mr-2" />
            <span>Register Flight</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FlightRegister;