import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

import {
  CalendarDays,
  DollarSign,
  User,
  Edit,
  Bell,
  Plane,
  Hotel,
  Calendar,
  Car,
  X,
  Camera,
} from "lucide-react";
import { HiOutlineBell, HiOutlineCurrencyDollar } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
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
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    profilePic:
      "https://i.pinimg.com/280x280_RS/8d/35/e0/8d35e05e1a89c8a252452d03b8adff24.jpg",
    coverPhoto:
      "https://images.pexels.com/photos/2399254/pexels-photo-2399254.jpeg",
  });
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Ensure reset on unmount
    };
  }, [showEditModal]);

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
      const res = await fetch(`${BASE_URL}/api/user/getbooking/${id}`);
      const data = await res.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log("No bookings found or the data is not an array.");
      } else {
        setCabs(data); // Only set if it's an array with data
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  console.log(cabs);
  useEffect(() => {
    // Dummy Booking Data
    setFlights([
      {
        id: 1,
        from: "Delhi",
        to: "Mumbai",
        date: "2025-02-15",
        price: 4500,
        status: "Pending",
      },
      {
        id: 2,
        from: "Bangalore",
        to: "Goa",
        date: "2025-01-28",
        price: 3200,
        status: "Completed",
      },
    ]);

    setHotels([
      {
        id: 3,
        name: "Taj Palace",
        city: "Delhi",
        date: "2025-02-20",
        price: 7500,
        status: "Pending",
      },
      {
        id: 4,
        name: "The Oberoi",
        city: "Mumbai",
        date: "2025-01-30",
        price: 5800,
        status: "Completed",
      },
    ]);

    setTransactions([
      { id: 1, amount: 4500, date: "2025-02-10", status: "Paid" },
      { id: 2, amount: 7500, date: "2025-01-25", status: "Refunded" },
    ]);

    setNotifications([
      {
        id: 1,
        message: "Your flight to Mumbai is confirmed!",
        type: "success",
      },
      {
        id: 2,
        message: "Your hotel check-in at Taj Palace is tomorrow!",
        type: "info",
      },
    ]);
  }, []);

  const handleProfileUpdate = () => {
    setUser(editedUser);
    setShowEditModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCloseModal = () => {
    setEditedUser(user); // Reset to original user data
    setShowEditModal(false);
    document.body.style.overflow = "auto";
  };

  const [shadow, setShadow] = useState("0px 0px 10px rgba(255, 255, 255, 0.3)");

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    // Calculate shadow position based on cursor
    const x = (offsetX / clientWidth - 0.5) * 20; // Adjust intensity
    const y = (offsetY / clientHeight - 0.5) * 20;

    setShadow(`${x}px ${y}px 20px rgba(255, 255, 255, 0.3)`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      {/* Cover Photo and Avatar */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={user.profilePic}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white hover:border-red-600 transition-all duration-300"
          />
        </div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col items-center text-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white ">{user.name}</h1>
            <p className="text-gray-400 text-lg mt-2">{user.email}</p>
          </div>
          <div className="flex gap-4 mt-5 md:mt-4">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>
            <button
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition duration-200"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="box-border w-120 p-5 relative bg-gray-900 rounded-lg 
            shadow-xl  transition-shadow duration-300 max-h-screen overflow-y-auto
            "
            style={{ boxShadow: shadow }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() =>
              setShadow("0px 0px 10px rgba(255, 255, 255, 0.3)")
            }
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-red-500 mb-5 text-center">
              Edit Profile
            </h2>
            <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden mx-auto mb-4 group cursor-pointer">
              {editedUser.profilePic ? (
                <img
                  src={editedUser.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-red-500" />
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-gray-800 cursor-pointer text-white focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-500"
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
              placeholder="Enter Name"
            />
            <input
              type="email"
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
              placeholder="Enter Email"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleProfileUpdate}
                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications */}
      <div className="flex items-center gap-2 mb-4 mx-2">
        <HiOutlineBell className="w-6 h-6 text-red-600 cursor-pointer hover:" />
        <h2 className="text-3xl font-bold text-red-500">Notifications</h2>
      </div>
      <div className="mb-6 p-2">
        {notifications.length === 0 ? (
          <p className="text-gray-400 mt-2">No new notifications.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-[#1a1a1a] p-4 mb-2 rounded-lg flex items-center gap-3"
            >
              <Bell className="text-yellow-400" />
              <p>{notif.message}</p>
            </div>
          ))
        )}
      </div>

      <div key="Cabs" className="mt-10">
        <h2 className="text-3xl font-bold text-red-600 mb-4 flex items-center gap-2 mx-2">
          <Car /> 
          <h2 className="text-3xl font-bold text-red-500">Cab Bookings</h2>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(cabs) && cabs.length === 0 ? (
            <p className="text-2xl text-gray-400 mx-10">No cab bookings.</p>
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
                  {booking.source_location?.address} →{" "}
                  {booking.destination_location?.address}
                </h3>

                <p className="text-yellow-400 font-semibold mt-2">
                  Status: {booking.status}
                </p>

                <div className="mt-3 text-gray-300 text-sm">
                  <p className="text-gray-300 mt-1">
                    <Calendar size={16} className="inline-block" /> Pick Time:{" "}
                    {booking.pickup_time
                      ? new Date(booking.pickup_time).toLocaleString()
                      : "Not Available"}
                  </p>

                  <p className="flex items-center gap-2">
                    <DollarSign size={18} className="text-red-500" /> Payment:{" "}
                    {booking.payment_status}
                  </p>

                  <p className="mt-1">Rider Mobile: {booking.Rider_id.phone}</p>
                  <p className="mt-1">
                    <Car size={16} className="inline-block" /> Vehicle:{" "}
                    {booking.vehicle_id.vehicle_number} (
                    {booking.vehicle_id.vehicle_type})
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-7">
      <div className="flex items-center gap-2 mb-4 mx-2">
        <FaRupeeSign className="w-6 h-6 text-red-600 cursor-pointer hover:" />
        <h2 className="text-3xl font-bold text-red-500">Payment History</h2>
      </div>
      <div className="mt-4 p-2">
        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions.</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="bg-[#1a1a1a] p-4 mt-2 rounded-lg flex justify-between"
            >
              <p>₹{t.amount}</p>
              <p>{t.date}</p>
              <p
                className={
                  t.status === "Paid" ? "text-green-400" : "text-red-400"
                }
              >
                {t.status}
              </p>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
