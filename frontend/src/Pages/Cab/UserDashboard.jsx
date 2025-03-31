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
  Hotel,
  Calendar,
  Car,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  ChevronRight,
  Navigation,
  Users,
  Bed,
  Star
} from "lucide-react";
import { BASE_URL } from "../../../config";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [id, setuserId] = useState(null);
  const [cabs, setCabs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("cabs");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "",
  });
  const [editedUser, setEditedUser] = useState(user);

  // Dummy notifications data
  const dummyNotifications = [
    {
      id: 1,
      message: "Your cab booking has been confirmed",
      type: "success",
      createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: 2,
      message: "Special discount on hotel bookings this weekend",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 3,
      message: "Payment failed for your recent booking",
      type: "error",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 4,
      message: "Your hotel booking is pending confirmation",
      type: "warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    }
  ];

  // Dummy transactions data
  const dummyTransactions = [
    {
      id: 1,
      amount: 1250,
      status: "Paid",
      paymentMethod: "Credit Card",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 2,
      amount: 3200,
      status: "Paid",
      paymentMethod: "UPI",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 3,
      amount: 1800,
      status: "Failed",
      paymentMethod: "Debit Card",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    },
    {
      id: 4,
      amount: 2750,
      status: "Pending",
      paymentMethod: "Net Banking",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setuserId(decoded.user._id);
        setUser({
          name: decoded.user.name || "User",
          email: decoded.user.email || "",
          profilePic: decoded.user.profilePic || ""
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Set dummy data
    setNotifications(dummyNotifications);
    setTransactions(dummyTransactions);
  }, []);

  useEffect(() => {
    if (id) {
      console.log("Fetching bookings for user ID:", id);
      getCabBookings();
      getHotelBookings();
    }
  }, [id]);

  const getCabBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/getbooking/${id}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setCabs(data);
      }
    } catch (error) {
      console.error("Error fetching cab bookings:", error);
    }
  };

  const getHotelBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/booking/hotel`, {
        credentials: 'include'  // This will include credentials in the request
      });
      const data = await res.json();
      console.log(data)
      if (data.bookings && data.bookings.length > 0) {
        setHotels(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching hotel bookings:", error);
    }
  };

  const handleProfileUpdate = () => {
    setUser(editedUser);
    setShowEditModal(false);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'paid':
        return <CheckCircle2 className="text-green-500" size={18} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <ShieldCheck className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8 font-[Poppins]">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center mb-10 bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800"
      >
        <div className="relative w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={50} className="text-red-500" />
          )}
        </div>
        <h1 className="text-3xl font-bold mt-4 text-white">{user.name}</h1>
        <p className="text-gray-400 text-lg">{user.email}</p>

        <button
          onClick={() => setShowEditModal(true)}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
        >
          <Edit size={18} /> Edit Profile
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <Bell className="text-red-500" /> Notifications
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500 italic">No new notifications</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif._id || notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg flex items-start gap-3 border ${notif.type === 'success' ? 'border-green-900 bg-green-900/20' :
                      notif.type === 'warning' ? 'border-yellow-900 bg-yellow-900/20' :
                        notif.type === 'error' ? 'border-red-900 bg-red-900/20' : 'border-blue-900 bg-blue-900/20'
                      }`}
                  >
                    <Bell className={`mt-1 flex-shrink-0 ${notif.type === 'success' ? 'text-green-400' :
                      notif.type === 'warning' ? 'text-yellow-400' :
                        notif.type === 'error' ? 'text-red-400' : 'text-blue-400'
                      }`} />
                    <div>
                      <p className="font-medium">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg mt-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <CreditCard className="text-red-500" /> Payment History
            </h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500 italic">No transactions yet</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {transactions.map((t) => (
                  <motion.div
                    key={t._id || t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(t.status)}
                        <span className="font-medium">₹{t.amount}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(t.date || t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className={`${t.status === "Paid" ? "text-green-400" :
                        t.status === "Failed" ? "text-red-400" : "text-yellow-400"
                        }`}>
                        {t.status}
                      </span>
                      <span className="text-gray-400">{t.paymentMethod || "Credit Card"}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-all ${activeTab === "cabs"
                  ? "text-red-500 border-b-2 border-red-500 bg-gray-800/50"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"}`}
                onClick={() => setActiveTab("cabs")}
              >
                <Car size={18} /> Cab Bookings
                {cabs.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cabs.length}
                  </span>
                )}
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-all ${activeTab === "hotels"
                  ? "text-red-500 border-b-2 border-red-500 bg-gray-800/50"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"}`}
                onClick={() => setActiveTab("hotels")}
              >
                <Hotel size={18} /> Hotel Bookings
                {hotels.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {hotels.length}
                  </span>
                )}
              </button>
            </div>

            {activeTab === "cabs" ? (
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Car className="text-red-500" /> Your Cab Bookings
                </h2>
                {cabs.length === 0 ? (
                  <div className="text-center py-10">
                    <Car className="mx-auto text-gray-600" size={48} />
                    <p className="text-gray-500 mt-2">No cab bookings yet</p>
                    <button
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => window.location.href = '/book-cab'}
                    >
                      Book a Cab Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cabs.map((booking) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-800 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:shadow-lg transition-all hover:border-gray-700"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              <div className="bg-red-500/20 p-3 rounded-lg">
                                <Car className="text-red-500" size={24} />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {booking.vehicle_id?.vehicle_type || "Premium Cab"}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                  {booking.vehicle_id?.vehicle_number || "DL 01 AB 1234"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                              {getStatusIcon(booking.status)}
                              <span className="text-xs font-medium capitalize text-gray-200">
                                {booking.status || "Pending"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <MapPin className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Route</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.source_location?.address || "Unknown"} → {booking.destination_location?.address || "Unknown"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <Calendar className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Pickup</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.pickup_time ? new Date(booking.pickup_time).toLocaleString() : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <User className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Driver</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.Rider_id?.name || "Not assigned"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-800 px-5 py-3 bg-gray-900/50 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-green-400" size={16} />
                            <span className="font-medium text-white">
                              ₹{booking.fare || "0"}
                            </span>
                          </div>
                          <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
                            View Details <ChevronRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Hotel className="text-red-500" /> Your Hotel Bookings
                </h2>
                {hotels.length === 0 ? (
                  <div className="text-center py-10">
                    <Hotel className="mx-auto text-gray-600" size={48} />
                    <p className="text-gray-500 mt-2">No hotel bookings yet</p>
                    <button
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => window.location.href = '/hotels'}
                    >
                      Book a Hotel Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {hotels.map((booking) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-800 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:shadow-lg transition-all hover:border-gray-700"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              <div className="bg-red-500/20 p-3 rounded-lg">
                                <Hotel className="text-red-500" size={24} />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {booking.hotel?.name || "Premium Hotel"}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={`${i < (booking.hotel?.rating || 3) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                              {getStatusIcon(booking.bookingStatus)}
                              <span className="text-xs font-medium capitalize text-gray-200">
                                {booking.bookingStatus || "Pending"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <MapPin className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Location</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.hotel?.address?.area || "City Center"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <Bed className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Room Type</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.room?.room_type || "Deluxe Room"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 p-2 rounded-full">
                                <Users className="text-red-500" size={16} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Guests</p>
                                <p className="text-sm font-medium text-white">
                                  {booking.personDetails?.length || 1} {booking.personDetails?.length === 1 ? "Guest" : "Guests"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <div className="bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-xs text-white">
                                {new Date(booking.bookingStartDate).toLocaleDateString()} - {new Date(booking.bookingEndDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-2">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-xs text-white">
                                {booking.room?.check_in || "12:00 PM"} - {booking.room?.check_out || "11:00 AM"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-800 px-5 py-3 bg-gray-900/50 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {/* <DollarSign className="text-green-400" size={16} /> */}
                            <span className="font-medium text-white">
                              ₹{booking.totalAmount || "0"}
                            </span>
                          </div>
                          <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
                            View Details <ChevronRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Profile Picture URL</label>
                <input
                  type="text"
                  value={editedUser.profilePic}
                  onChange={(e) => setEditedUser({ ...editedUser, profilePic: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;