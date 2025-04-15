import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  PlaneLanding,
  Timer,
  BadgePercent,
  CalendarDays,
  Users,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const FlightDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "Mumbai";
  const to = searchParams.get("to") || "Delhi";
  const date = searchParams.get("date") || "2025-02-20";
  const [selectedClass, setSelectedClass] = useState(null);
  const [flights, setFlights] = useState([]);
  const [filter, setFilter] = useState("price-low");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [showPassengerDialog, setShowPassengerDialog] = useState(false);
  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/flight/search-flight?departure_station=${from}&destination_station=${to}&departure_time=${date}`
        );
        setFlights(response.data.data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
    fetchFlights();
  }, [from, to, date]);

  const parseDuration = (duration) => {
    const parts = duration.match(/(\d+)h\s*(\d*)m?/);
    const hours = parts ? parseInt(parts[1]) : 0;
    const minutes = parts && parts[2] ? parseInt(parts[2]) : 0;
    return hours * 60 + minutes;
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    setShowClassDialog(true);
  };

  const handleClassSelection = (classType) => {
    if (selectedFlight.seatsByClass[classType].available === 0) {
      alert(`Sorry, no seats available for ${classType} class!`);
      return;
    }
    setSelectedClass(classType);
    setShowClassDialog(false);
    setPassengers([{ name: "", age: "" }]);
    setShowPassengerDialog(true);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= selectedFlight.seatsByClass[selectedClass].available) {
      alert(
        `Cannot add more passengers. Only ${selectedFlight.seatsByClass[selectedClass].available} seats available.`
      );
      return;
    }
    setPassengers([...passengers, { name: "", age: "" }]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length <= 1) {
      alert("At least one passenger is required.");
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handlePassengerSubmit = async () => {
    for (const passenger of passengers) {
      if (!passenger.name.trim() || !passenger.age || passenger.age < 1) {
        alert("Please provide a valid name and age for all passengers.");
        return;
      }
    }

    if (Cookies.get("token")) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/flight/book-flight`,
          {
            schedule_id: selectedFlight.scheduleId,
            classType: selectedClass,
            date,
            passengers: passengers.map((p, index) => ({
              passengerNumber: index + 1,
              name: p.name,
              age: parseInt(p.age),
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const order = response.data.data.order;

        console.log(response.data);

        if (response.data.statusCode === 201) {
          const options = {
            key: "rzp_test_ChC1v5xGnKuucU",
            amount: order.amount,
            currency: order.currency,
            name: "Booking Hub",
            description: "Payment for flight booking",
            order_id: order.id,
            handler: function (response) {
              alert(`Booking successful! Payment ID: ${response.razorpay_payment_id}`);
              navigate("/userdashboard");
            },
            prefill: {
              name: "John Doe",
              email: "john@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#ef4444",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Booking error:", error);
        alert("An error occurred during booking.");
      }
    } else {
      navigate("/login");
    }

    setShowPassengerDialog(false);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-[Poppins]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-12 text-center"
      >
        <h1 className="text-5xl font-extrabold text-red-500">
          Flights from {from} to {to}
        </h1>
        <p className="text-gray-300 text-xl flex items-center justify-center gap-2 mt-2">
          <CalendarDays size={24} className="text-red-500" /> {date}
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
        {[
          { label: "Price (Low)", value: "price-low" },
          { label: "Price (High)", value: "price-high" },
          { label: "Duration (Short)", value: "duration-short" },
          { label: "Duration (Long)", value: "duration-long" },
          { label: "Seats (More)", value: "seats-more" },
          { label: "Seats (Less)", value: "seats-less" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === btn.value
                ? "bg-red-500 text-white border-red-600"
                : "bg-transparent text-gray-400 border-gray-600 hover:bg-gray-800"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Flight Cards */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 bg-black max-w-7xl mx-auto">
        <div className="grid gap-6 md:gap-8">
          {flights.map((flight) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all border border-gray-800 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {flight.airline}
                </h2>
                <div className="flex items-center gap-2 bg-red-600 bg-opacity-20 px-3 py-1 rounded-full">
                  <BadgePercent size={16} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-500">
                    {flight.discount}% Off
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-gray-300">
                <div className="flex items-center gap-3">
                  <PlaneTakeoff size={22} className="text-red-500 flex-shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400">Departure</span>
                    <strong className="text-base sm:text-lg text-white">
                      {flight.departureTime}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PlaneLanding size={22} className="text-red-500 flex-shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400">Arrival</span>
                    <strong className="text-base sm:text-lg text-white">
                      {flight.arrivalTime}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Timer size={22} className="text-red-500 flex-shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400">Duration</span>
                    <strong className="text-base sm:text-lg text-white">
                      {flight.duration}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Available Seats
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["economy", "business", "first"].map((classType) => (
                    <div
                      key={classType}
                      className="flex flex-col p-4 bg-gray-800 rounded-lg border border-gray-700 transition-all hover:bg-gray-700 hover:border-red-600"
                    >
                      <span className="capitalize text-base font-medium text-white">
                        {classType}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          flight.seatsByClass[classType].available > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {flight.seatsByClass[classType].available} seats available
                      </span>
                      <span className="text-base sm:text-lg font-semibold text-red-500 mt-1">
                        ₹{flight.seatsByClass[classType].price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => handleBookNow(flight)}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-full font-semibold text-base sm:text-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Class Selection Dialog */}
      {showClassDialog && selectedFlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
              Select a Class for Booking
            </h2>
            <div className="space-y-3">
              {["economy", "business", "first"].map((classType) => (
                <button
                  key={classType}
                  onClick={() => handleClassSelection(classType)}
                  className="w-full text-center bg-red-500 text-white py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={selectedFlight.seatsByClass[classType].available === 0}
                >
                  {classType.charAt(0).toUpperCase() + classType.slice(1)} - ₹
                  {selectedFlight.seatsByClass[classType].price}
                  {selectedFlight.seatsByClass[classType].available === 0 && (
                    <span className="ml-2 text-sm text-red-300">(Sold Out)</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowClassDialog(false)}
              className="mt-4 w-full text-center text-gray-400 py-2 rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-all text-base font-medium"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Passenger Details Dialog */}
      {showPassengerDialog && selectedFlight && selectedClass && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
              Add Passenger Details
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {passengers.map((passenger, index) => (
                <div key={index} className="space-y-2 bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm text-gray-400">
                      Passenger {index + 1}
                    </label>
                    {passengers.length > 1 && (
                      <button
                        onClick={() => handleRemovePassenger(index)}
                        className="text-red-500 hover:text-red-600 transition-all"
                        aria-label={`Remove passenger ${index + 1}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) =>
                        handlePassengerChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={passenger.age}
                      onChange={(e) =>
                        handlePassengerChange(index, "age", e.target.value)
                      }
                      className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddPassenger}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
            >
              <Users size={18} className="text-red-500" />
              <span>Add Passenger</span>
            </button>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handlePassengerSubmit}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPassengerDialog(false)}
                className="flex-1 text-gray-400 py-2 rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FlightDetails;