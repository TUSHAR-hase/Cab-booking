import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ConfirmBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    pickupTime: "",
  });
  const [vehicleDetails, setVehicleDetails] = useState({
    rider_id: "",
    perKm_price: 0,
  });
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    contact: "",
  });
  const [showValidationError, setShowValidationError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allFieldsValid = () => {
    return formData.from && formData.to && formData.pickupTime;
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        setUserDetails({
          id: decoded.user._id,
          name: decoded.user.name,
          email: decoded.user.email,
          contact: decoded.user.contact,
        });

        await fetchVehicleDetails();
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize page");
      }
    };

    initializeUser();
  }, []);

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Rv/vehicle/getvehicle/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch vehicle details");

      const data = await response.json();
      setVehicleDetails({
        rider_id: data.Rider_id,
        perKm_price: data.perKm_price,
      });
    } catch (error) {
      console.error("Vehicle details error:", error);
      setError("Failed to load vehicle details");
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!allFieldsValid()) {
      setShowValidationError(true);
      return;
    }
    try {
      setLoading(true);
      setError("");

      // Create booking first
      const bookingResponse = await fetch(
        `${BASE_URL}/api/Rv/booking/createbooking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            vehicalid: id,
            rider_id: vehicleDetails.rider_id,
            userId: userDetails.id,
          }),
        }
      );

      if (!bookingResponse.ok) throw new Error("Booking creation failed");
      const bookingData = await bookingResponse.json();

      // Initialize Razorpay
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) throw new Error("Razorpay SDK failed to load");

      // Create payment order
      const orderResponse = await axios.post(`${BASE_URL}/create-order`, {
        amount: vehicleDetails.perKm_price * 100, // Convert to paise
      });

      if (!orderResponse.data.success) throw new Error("Order creation failed");

      // Razorpay options
      const options = {
        key: "rzp_test_Y8cefy5g53d5Se",
        amount: orderResponse.data.order.amount,
        currency: "INR",
        order_id: orderResponse.data.order.id,
        name: "Booking Hub",
        description: `Booking for ${formData.from} to ${formData.to}`,
        prefill: userDetails,
        theme: { color: "#3399cc" },
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${BASE_URL}/verify-payment`,
              response
            );
            if (verificationResponse.data.success) {
              navigate(`/bookingsuccess/${userDetails.id}`, { state: { booking: bookingData } });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setError("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#1a1a1a] text-white shadow-xl rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
          Confirm Your Booking
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-800 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-red-500 mb-2">
              Pickup Time
            </label>
            <input
              type="datetime-local"
              name="pickupTime"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800"
              value={formData.pickupTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-red-500 mb-2">
              From Location
            </label>
            <input
              type="text"
              name="from"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800"
              placeholder="Enter pickup location"
              value={formData.from}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-red-500 mb-2">
              Destination
            </label>
            <input
              type="text"
              name="to"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800"
              placeholder="Enter destination"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 rounded-lg cursor-pointer font-semibold transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : allFieldsValid()
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-500/50"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showValidationError && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              key="modal-content"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
                rotate: -1.5,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              exit={{
                opacity: 0,
                y: 50,
                scale: 0.95,
                transition: { duration: 0.15 },
              }}
              className="bg-gray-800 p-6 rounded-2xl max-w-md w-full mx-4 border border-red-500/50 shadow-xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-red-500">
                    Missing Information
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowValidationError(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-300">
                  Please fill in all required fields before proceeding.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-4"
              >
                <button
                  onClick={() => setShowValidationError(false)}
                  className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  Okay, I'll check
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfirmBookingPage;
