import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

import {
  CalendarDays,
  DollarSign,
  User,
  Edit,
  Bell,
  Plane,
  Hotel,Calendar,
  Car,
} from "lucide-react";
import { BASE_URL } from "../../../config";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
    const [user_id, setuserId] = useState(null);
  
  const [cabs, setCabs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "",
  });
  const [editedUser, setEditedUser] = useState(user);
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("Decoded Token:", decoded);
          setuserId(decoded.user._id);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }, []);
  
    useEffect(() => {
      if (user_id) {
        console.log("Fetching vehicles for user ID:", user_id);

        getalluserrequest();
      }
    }, [user_id]);
  const getalluserrequest = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/getbooking/${user_id}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        console.log("No bookings found");

      } else {
        console.log("Fetched requests:", data);
        setCabs(data)
        console.log(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  useEffect(() => {
    // Dummy Booking Data
    setFlights([
      { id: 1, from: "Delhi", to: "Mumbai", date: "2025-02-15", price: 4500, status: "Pending" },
      { id: 2, from: "Bangalore", to: "Goa", date: "2025-01-28", price: 3200, status: "Completed" },
    ]);

    setHotels([
      { id: 3, name: "Taj Palace", city: "Delhi", date: "2025-02-20", price: 7500, status: "Pending" },
      { id: 4, name: "The Oberoi", city: "Mumbai", date: "2025-01-30", price: 5800, status: "Completed" },
    ]);


    setTransactions([
      { id: 1, amount: 4500, date: "2025-02-10", status: "Paid" },
      { id: 2, amount: 7500, date: "2025-01-25", status: "Refunded" },
    ]);

    setNotifications([
      { id: 1, message: "Your flight to Mumbai is confirmed!", type: "success" },
      { id: 2, message: "Your hotel check-in at Taj Palace is tomorrow!", type: "info" },
    ]);
  }, []);

  const handleProfileUpdate = () => {
    setUser(editedUser);
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-[Poppins]">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center mb-10"
      >
        <div className="relative w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={50} className="text-red-500" />
          )}
        </div>
        <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-400 text-lg">{user.email}</p>

        <button
          onClick={() => setShowEditModal(true)}
          className="mt-4 px-4 py-2 bg-red-500 text-black font-semibold rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
        >
          <Edit size={18} /> Edit Profile
        </button>
      </motion.div>

      {/* Notifications */}
      <h2 className="text-3xl font-bold text-red-500 mb-4">Notifications</h2>
      <div className="mb-6">
        {notifications.length === 0 ? (
          <p className="text-gray-400">No new notifications.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="bg-[#1a1a1a] p-4 mb-2 rounded-lg flex items-center gap-3">
              <Bell className="text-yellow-400" />
              <p>{notif.message}</p>
            </div>
          ))
        )}
      </div>

      <div key="Cabs" className="mt-10">
  <h2 className="text-3xl font-bold text-red-500 mb-4 flex items-center gap-2">
    <Car /> Cab Bookings
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {cabs.length === 0 ? (
      <p className="text-gray-400">No cab bookings.</p>
    ) : (
      cabs.map((booking) => (
        <motion.div
          key={booking._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg border border-gray-800"
        >
          <h3 className="text-xl font-bold">
            {booking.source_location.address} → {booking.destination_location.address}
          </h3>

          <p className="text-yellow-400 font-semibold mt-2">Status: {booking.status}</p>

          <div className="mt-3 text-gray-300 text-sm">
            <p className="text-gray-300 mt-1">
              <Calendar size={16} className="inline-block" /> Pick Time:{" "}
              {booking.pickup_time ? new Date(booking.pickup_time).toLocaleString() : "Not Available"}
            </p>

            <p className="flex items-center gap-2">
              <DollarSign size={18} className="text-red-500" /> Payment: {booking.payment_status}
            </p>

            <p className="mt-1">Rider Mobile: {booking.Rider_id.phone}</p>
            <p className="mt-1">
              <Car size={16} className="inline-block" /> Vehicle: {booking.vehicle_id.vehicle_number} ({booking.vehicle_id.vehicle_type})
            </p>
          </div>
        </motion.div>
      ))
    )}
  </div>
</div>


      {/* Transactions */}
      <h2 className="text-3xl font-bold text-red-500 mt-10 mb-4">Payment History</h2>
      <div className="mb-6">
        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions.</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="bg-[#1a1a1a] p-4 mb-2 rounded-lg flex justify-between">
              <p>₹{t.amount}</p>
              <p>{t.date}</p>
              <p className={t.status === "Paid" ? "text-green-400" : "text-red-400"}>{t.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
