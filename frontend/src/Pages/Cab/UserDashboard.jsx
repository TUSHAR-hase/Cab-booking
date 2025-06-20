import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
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
  Star,
  X,
} from "lucide-react";
import { BASE_URL } from "../../../config";

// Hardcoded dummy flight data based on FlightBookingSchema
// const dummyFlights = [
//   {
//     _id: "flightBooking1",
//     user_id: "user123",
//     flight_id: {
//       _id: "flight1",
//       airline: "Air India",
//       flight_number: "AI-202",
//     },
//     class: "Economy",
//     schedule_id: {
//       _id: "schedule1",
//       departure: {
//         city: "Delhi",
//         airport: "Indira Gandhi International",
//         time: new Date("2025-04-15T08:00:00Z"),
//       },
//       arrival: {
//         city: "Mumbai",
//         airport: "Chhatrapati Shivaji Maharaj International",
//         time: new Date("2025-04-15T10:30:00Z"),
//       },
//     },
//     date: new Date("2025-04-15T00:00:00Z"),
//     booking_status: "Confirmed",
//     luggage_details: "1 Checked Bag (23kg), 1 Carry-on (7kg)",
//     passenger_detail: "John Doe, Adult",
//     seat_number: "12A",
//     price: 7500,
//     payment_id: "pay123",
//   },
//   {
//     _id: "flightBooking2",
//     user_id: "user123",
//     flight_id: {
//       _id: "flight2",
//       airline: "IndiGo",
//       flight_number: "6E-456",
//     },
//     class: "Business",
//     schedule_id: {
//       _id: "schedule2",
//       departure: {
//         city: "Bangalore",
//         airport: "Kempegowda International",
//         time: new Date("2025-04-16T14:00:00Z"),
//       },
//       arrival: {
//         city: "Chennai",
//         airport: "Chennai International",
//         time: new Date("2025-04-16T15:30:00Z"),
//       },
//     },
//     date: new Date("2025-04-16T00:00:00Z"),
//     booking_status: "Pending",
//     luggage_details: "2 Checked Bags (30kg each), 1 Carry-on (7kg)",
//     passenger_detail: "Jane Smith, Adult",
//     seat_number: "3C",
//     price: 12000,
//     payment_id: "pay124",
//   },
//   {
//     _id: "flightBooking3",
//     user_id: "user123",
//     flight_id: {
//       _id: "flight3",
//       airline: "SpiceJet",
//       flight_number: "SG-789",
//     },
//     class: "Economy",
//     schedule_id: {
//       _id: "schedule3",
//       departure: {
//         city: "Kolkata",
//         airport: "Netaji Subhas Chandra Bose International",
//         time: new Date("2025-04-17T06:00:00Z"),
//       },
//       arrival: {
//         city: "Hyderabad",
//         airport: "Rajiv Gandhi International",
//         time: new Date("2025-04-17T09:00:00Z"),
//       },
//     },
//     date: new Date("2025-04-17T00:00:00Z"),
//     booking_status: "Cancelled",
//     luggage_details: "1 Checked Bag (15kg)",
//     passenger_detail: "Alice Brown, Adult",
//     seat_number: "15B",
//     price: 6000,
//     payment_id: "pay125",
//   },
// ];

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [id, setuserId] = useState(null);
  const [cabs, setCabs] = useState([]);
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
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [key, setkey] = useState();
  const [selectedHotelBooking, setSelectedHotelBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("cabs");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "",
  });

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/flight/get-bookings`,{
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        console.log(response.data.data);
        setFlights(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    fetchBookings();

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
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeUser();
  }, []);

  const [editedUser, setEditedUser] = useState(user);

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

  const handlePayment = async (id, price, from, to) => {
    try {
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) throw new Error("Razorpay SDK failed to load");

      const orderResponse = await axios.post(`${BASE_URL}/create-order`, {
        amount: price * 100,
      });

      if (!orderResponse.data.success) throw new Error("Order creation failed");

      const options = {
        key: "rzp_test_Y8cefy5g53d5Se",
        amount: orderResponse.data.order.amount,
        currency: "INR",
        order_id: orderResponse.data.order.id,
        name: "Booking Hub",
        description: `Booking for ${from} to ${to}`,
        prefill: userDetails,
        theme: { color: "#3399cc" },
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${BASE_URL}/verify-payment`,
              response
            );

            if (verificationResponse.data.success) {
              await axios.patch(`${BASE_URL}/update-payment-status/${id}`);

              try {
                await fetch(`${BASE_URL}/api/Rv/booking/paidbooking/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ payment_status: "paid" }),
                });
              } catch (error) {
                console.error("Error updating booking:", error);
              }

              navigate(`/userdashboard`, {
                state: { booking: bookingData },
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
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
    }
  };

  const dummyNotifications = [
    {
      id: 1,
      message: "Your cab booking has been confirmed",
      type: "success",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 2,
      message: "Special discount on hotel bookings this weekend",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 3,
      message: "Payment failed for your recent booking",
      type: "error",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 4,
      message: "Your hotel booking is pending confirmation",
      type: "warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  ];

  const dummyTransactions = [
    {
      id: 1,
      amount: 1250,
      status: "Paid",
      paymentMethod: "Credit Card",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 2,
      amount: 3200,
      status: "Paid",
      paymentMethod: "UPI",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 3,
      amount: 1800,
      status: "Failed",
      paymentMethod: "Debit Card",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      id: 4,
      amount: 2750,
      status: "Pending",
      paymentMethod: "Net Banking",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setkey(decoded.user.key);
        setuserId(decoded.user._id);
        setUser({
          name: decoded.user.name || "User",
          email: decoded.user.email || "",
          profilePic: decoded.user.profilePic || "",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    setNotifications(dummyNotifications);
    setTransactions(dummyTransactions);
    // Set hardcoded dummy flights for UI testing
    //setFlights(dummyFlights);
  }, []);

  useEffect(() => {
    if (id) {
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
        credentials: "include",
      });
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setHotels(data.data);
      }
    } catch (error) {
      console.error("Error fetching hotel bookings:", error);
    }
  };

  const handleProfileUpdate = () => {
    setUser(editedUser);
    setShowEditModal(false);
  };

  const handleViewHotelBooking = (booking) => {
    setSelectedHotelBooking(booking);
    setShowHotelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedHotelBooking) return;

    try {
      const res = await fetch(`${BASE_URL}/api/booking/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: selectedHotelBooking._id }),
      });

      if (res.ok) {
        setHotels(
          hotels.map((booking) =>
            booking._id === selectedHotelBooking._id
              ? { ...booking, bookingStatus: "Cancelled" }
              : booking
          )
        );
        setShowHotelModal(false);
        setNotifications([
          {
            id: Date.now(),
            message: "Hotel booking cancelled successfully",
            type: "success",
            createdAt: new Date(),
          },
          ...notifications,
        ]);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "confirmed":
      case "paid":
        return <CheckCircle2 className="text-green-500" size={14} />;
      case "pending":
        return <Clock className="text-yellow-500" size={14} />;
      case "cancelled":
      case "failed":
        return <XCircle className="text-red-500" size={14} />;
      default:
        return <ShieldCheck className="text-blue-500" size={14} />;
    }
  };

  const NotificationCard = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg flex items-start gap-3 border ${
        notification.type === "success"
          ? "border-green-900 bg-green-900/20"
          : notification.type === "warning"
          ? "border-yellow-900 bg-yellow-900/20"
          : notification.type === "error"
          ? "border-red-900 bg-red-900/20"
          : "border-blue-900 bg-blue-900/20"
      }`}
    >
      <Bell
        className={`mt-0.5 flex-shrink-0 ${
          notification.type === "success"
            ? "text-green-400"
            : notification.type === "warning"
            ? "text-yellow-400"
            : notification.type === "error"
            ? "text-red-400"
            : "text-blue-400"
        }`}
        size={14}
      />
      <div>
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );

  const TransactionCard = ({ transaction }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:bg-gray-800/50 transition"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getStatusIcon(transaction.status)}
          <span className="font-medium text-sm">₹{transaction.amount}</span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(transaction.date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span
          className={`${
            transaction.status === "Paid"
              ? "text-green-400"
              : transaction.status === "Failed"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {transaction.status}
        </span>
        <span className="text-gray-400">{transaction.paymentMethod}</span>
      </div>
    </motion.div>
  );

  const CompactCabCard = ({ booking, onViewDetails }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-800 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Car className="text-red-500" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-white line-clamp-1">
                {booking.vehicle_id?.vehicle_type || "Premium Cab"}
              </h3>
              <p className="text-xs text-gray-400">
                {booking.source_location?.address || "Unknown"} →{" "}
                {booking.destination_location?.address || "Unknown"}
              </p>
            </div>
          </div>
          <div className="ml-8 mr-8 text-sm flex item-center text-gray-500">
            {booking.status === "accepted" &&
            booking.payment_status === "unpaid" ? (
              <button
                className="bg-red-500 text-white px-4 rounded hover:bg-gray-600 transition"
                onClick={() =>
                  handlePayment(
                    booking._id,
                    booking.vehicle_id.perKm_price,
                    booking.source_location.address,
                    booking.destination_location.address
                  )
                }
              >
                Complete Payment
              </button>
            ) : booking.payment_status === "paid" ? (
              <span className="text-green-600 font-semibold">
                Payment Completed
              </span>
            ) : (
              <span className="text-gray-600">-</span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
            {getStatusIcon(booking.status)}
            <span className="text-xs capitalize">
              {booking.status || "Pending"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-300">
              {booking.pickup_time
                ? new Date(booking.pickup_time).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-green-400" />
            <span className="font-medium">
              ₹{booking.vehicle_id?.perKm_price * 8 || "0"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CompactHotelCard = ({ booking, onViewDetails }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-800 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Hotel className="text-red-500" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-white line-clamp-1">
                {booking.hotel?.name || "Premium Hotel"}
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${
                      i < (booking.hotel?.rating || 3)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
            {getStatusIcon(booking.bookingStatus)}
            <span className="text-xs capitalize">
              {booking.bookingStatus || "Pending"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Bed size={14} className="text-gray-400" />
            <span className="text-gray-300">
              {booking.room?.room_type || "Deluxe"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">₹{booking.totalAmount || "0"}</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar size={12} />
            <span>
              {new Date(booking.bookingStartDate).toLocaleDateString()} -{" "}
              {new Date(booking.bookingEndDate).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={onViewDetails}
            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
          >
            Details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const CompactFlightCard = ({ booking, onViewDetails }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-800 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Plane className="text-red-500" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-white line-clamp-1">
                {booking.flight_id?.airline || "Airline"} -{" "}
                {booking.flight_id?.flight_number || "FL123"}
              </h3>
              <p className="text-xs text-gray-400">
                {booking.schedule_id?.departure?.city || "Unknown"} →{" "}
                {booking.schedule_id?.arrival?.city || "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
            {getStatusIcon(booking.booking_status)}
            <span className="text-xs capitalize">
              {booking.booking_status || "Pending"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-300">
              {booking.date
                ? new Date(booking.date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-green-400" />
            <span className="font-medium">₹{booking.price || "0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <span className="text-gray-300">
              {booking.passenger_detail.map((p) => p.name+" ("+p.age+"Years) ").join(", ") || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-300">
              Seat: {booking.passenger_detail.map((p) => p.seat_number).join(", ") || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Clock size={12} />
            <span>
              {booking.schedule_id?.departure?.time
                ? new Date(
                    booking.schedule_id.departure.time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}{" "}
              -{" "}
              {booking.schedule_id?.arrival?.time
                ? new Date(booking.schedule_id.arrival.time).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )
                : "N/A"}
            </span>
          </div>
          {/* <button
            onClick={onViewDetails}
            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
          >
            Details <ChevronRight size={14} />
          </button> */}
        </div>
      </div>
    </motion.div>
  );

  const EmptyState = ({ icon, message, actionText, action }) => (
    <div className="text-center py-8">
      <div className="mx-auto text-gray-600 mb-3">{icon}</div>
      <p className="text-gray-500 mb-4">{message}</p>
      <button
        onClick={action}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
      >
        {actionText}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8 font-[Poppins]">
      <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
        Key: {key}
      </h2>
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center mb-10 bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800"
      >
        <div className="relative w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
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
        {/* Left Column - Notifications and Transactions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <Bell className="text-red-500" /> Notifications
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {notifications.slice(0, 4).map((notif) => (
                <NotificationCard key={notif.id} notification={notif} />
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <CreditCard className="text-red-500" /> Payment History
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {transactions.slice(0, 4).map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex border-b border-gray-800 mb-6">
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-all ${
                  activeTab === "cabs"
                    ? "text-red-500 border-b-2 border-red-500 bg-gray-800/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                }`}
                onClick={() => setActiveTab("cabs")}
              >
                <Car size={18} /> Cab Bookings
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-all ${
                  activeTab === "hotels"
                    ? "text-red-500 border-b-2 border-red-500 bg-gray-800/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                }`}
                onClick={() => setActiveTab("hotels")}
              >
                <Hotel size={18} /> Hotel Bookings
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-all ${
                  activeTab === "flights"
                    ? "text-red-500 border-b-2 border-red-500 bg-gray-800/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                }`}
                onClick={() => setActiveTab("flights")}
              >
                <Plane size={18} /> Flight Bookings
              </button>
            </div>

            {activeTab === "cabs" ? (
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Car className="text-red-500" /> Your Cab Bookings
                </h2>
                {cabs.length === 0 ? (
                  <EmptyState
                    icon={<Car size={48} />}
                    message="No cab bookings yet"
                    actionText="Book a Cab Now"
                    action={() => (window.location.href = "/booking/cab")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cabs.map((booking) => (
                      <CompactCabCard
                        key={booking._id}
                        booking={booking}
                        onViewDetails={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "hotels" ? (
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Hotel className="text-red-500" /> Your Hotel Bookings
                </h2>
                {hotels.length === 0 ? (
                  <EmptyState
                    icon={<Hotel size={48} />}
                    message="No hotel bookings yet"
                    actionText="Book a Hotel Now"
                    action={() => (window.location.href = "/booking/hotel")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotels.map((booking) => (
                      <CompactHotelCard
                        key={booking._id}
                        booking={booking}
                        onViewDetails={() => handleViewHotelBooking(booking)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Plane className="text-red-500" /> Your Flight Bookings
                </h2>
                {flights.length === 0 ? (
                  <EmptyState
                    icon={<Plane size={48} />}
                    message="No flight bookings yet"
                    actionText="Book a Flight Now"
                    action={() => (window.location.href = "/booking/flight")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flights.map((booking) => (
                      <CompactFlightCard
                        key={booking._id}
                        booking={booking}
                        onViewDetails={() => {}}
                      />
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
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  value={editedUser.profilePic}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, profilePic: e.target.value })
                  }
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

      {/* Hotel Booking Details Modal */}
      {showHotelModal && selectedHotelBooking && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50 p-4">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-4xl w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-red-500">
                Booking Details
              </h2>
              <button
                onClick={() => setShowHotelModal(false)}
                className="text-white hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Information */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <Hotel size={20} /> Hotel Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-red-400">Hotel Name</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.hotel?.name || "Premium Hotel"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Location</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.hotel?.address?.area ||
                        "City Center"}
                      ,{" "}
                      {selectedHotelBooking.hotel?.address?.city || "City"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < (selectedHotelBooking.hotel?.rating || 3)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <CalendarDays size={20} /> Booking Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-red-400">Booking ID</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking._id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedHotelBooking.bookingStatus)}
                      <span className="text-white font-medium capitalize">
                        {selectedHotelBooking.bookingStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Booking Date</p>
                    <p className="text-white font-medium">
                      {new Date(
                        selectedHotelBooking.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <Bed size={20} /> Room Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-red-400">Room Type</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.room?.room_type || "Deluxe Room"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Guests</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.personDetails?.length || 1}{" "}
                      {selectedHotelBooking.personDetails?.length === 1
                        ? "Guest"
                        : "Guests"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Check-in/Check-out</p>
                    <p className="text-white font-medium">
                      {new Date(
                        selectedHotelBooking.bookingStartDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        selectedHotelBooking.bookingEndDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Timings</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.room?.check_in || "12:00 PM"} -{" "}
                      {selectedHotelBooking.room?.check_out || "11:00 AM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <CreditCard size={20} /> Payment Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-red-400">Total Amount</p>
                    <p className="text-white font-medium text-xl">
                      ₹{selectedHotelBooking.totalAmount || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Payment Method</p>
                    <p className="text-white font-medium">
                      {selectedHotelBooking.paymentMethod || "Credit Card"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-400">Payment Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(
                        selectedHotelBooking.paymentStatus || "Paid"
                      )}
                      <span className="text-white font-medium capitalize">
                        {selectedHotelBooking.paymentStatus || "Paid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            {selectedHotelBooking.personDetails?.length > 0 && (
              <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <Users size={20} /> Guest Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-red-400 text-sm border-b border-gray-700">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Age</th>
                        <th className="pb-2">Aadhar No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHotelBooking.personDetails.map((guest, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 last:border-0"
                        >
                          <td className="py-3 text-white">
                            {guest.name || "N/A"}
                          </td>
                          <td className="py-3 text-white">
                            {guest.age || "N/A"}
                          </td>
                          <td className="py-3 text-white capitalize">
                            {guest.aadhar || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setShowHotelModal(false)}
                className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
              {selectedHotelBooking.bookingStatus?.toLowerCase() !==
                "cancelled" &&
                selectedHotelBooking.bookingStatus?.toLowerCase() !==
                  "completed" && (
                  <button
                    onClick={handleCancelBooking}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <XCircle size={18} /> Cancel Booking
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;