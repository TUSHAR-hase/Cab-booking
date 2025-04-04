import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import FlightSearch from "./Pages/Flight/FlightSearch.jsx";
import FlightDetails from "./Pages/Flight/FlightDetails.jsx";
import FlightReviewPage from "./Pages/Flight/FlightReview.jsx";
import HotelSearch from "./Pages/Hotel/HotelSearch.jsx";
import HotelDetails from "./Pages/Hotel/HotelDetails.jsx";
import HotelReviewPage from "./Pages/Hotel/HotelReviews.jsx";
import Register from "./Pages/Main/Register.jsx";
import OtpPage from "./Pages/Main/Otp.jsx";
import Login from "./Pages/Main/Login.jsx";
import AirlineOwnerRegistration from "./Pages/Flight/AirLineRegistartion.jsx";
import OtpVerified from "./Pages/Cab/Rider/RiderOtpVerified.jsx";
import HotelOwnerRegister from "./Pages/Hotel/Owner/HotelOwnerRegister.jsx";
import HotelOwnerVerify from "./Pages/Hotel/Owner/HotelOwnerVerify.jsx";
import HotelOwnerLogin from "./Pages/Hotel/Owner/HotelOwnerLogin.jsx";
import HotelAdd from "./Pages/Hotel/Owner/Dashboard/HotelAdd.jsx";
import RoomAdd from "./Pages/Hotel/Owner//Dashboard/RoomAdd.jsx";
import HotelAdminPanel from "./Pages/Hotel/Owner/Dashboard/AdminPanel.jsx";
import HotelDashboard from "./Pages/Hotel/Owner/Dashboard/HotelDashboard.jsx";
import RoomDashboard from "./Pages/Hotel/Owner/Dashboard/RoomDashboard.jsx";

import CabDetails from "./Pages/Cab/CabDetails.jsx";
import CabReviewPage from "./Pages/Cab/CabReview.jsx";
import BookingSuccess from "./Pages/Cab/BookingSuccess.jsx";
import AddingCab from "./Pages/Cab/AddingCab.jsx";
import UserDashboard from "./Pages/Cab/UserDashboard.jsx";
import RiderDashboard from "./Pages/Cab/Rider/RiderDashbord.jsx";
import Riderlogin from "./Pages/Cab/Rider/Riderlogin.jsx";
import ConfirmBooking from "./Pages/Cab/ConfrimBooking";
import RiderSignup from "./Pages/Cab/Rider/RiderSignup.jsx";
import ForgotPassword from "./Pages/Cab/ForgetPassword.jsx";
import FLightOtpPage from "./Pages/Flight/Otp.jsx";
import RiderProfile from "./Pages/Cab/Rider/RiderProfile.jsx";
import FlightAdminPanel from "./Pages/Flight/Owner/Dashboard/FlightAdminPanel.jsx";
import FlightDashboard from "./Pages/Flight/Owner/Dashboard/FlightDashboard.jsx";
import FlightBooking from "./Pages/Flight/Owner/Dashboard/Flightbooking.jsx";
import FlightOwnerLogin from "./Pages/Flight/Owner/FlightOwnerLogin.jsx";
import FlightRegister from "./Pages/Flight/Owner/Dashboard/FlightRegister.jsx";
import SuperLayout from "./Pages/Super/SuperLayout.jsx";
import FlightAdmin from "./Pages/Super/FlightAdmin.jsx";
import SuperHotelAdmin from "./Pages/Super/SuperHotelAdmin.jsx";
import About from "./Pages/Main/About.jsx";
import Contact from "./Pages/Main/contact.jsx";
import RateStay from "./Pages/Hotel/RateStay.jsx";
import RatingThankYou from "./Pages/Hotel/RatingThankYou.jsx";
import HotelBookingManagement from "./Pages/Hotel/Owner/Dashboard/HotelBooking.jsx";
import HotelRatingManagement from "./Pages/Hotel/Owner/Dashboard/HotelRatings.jsx";
function App() {
  const [isHotelOwner, setIsHotelOwner] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token") || localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsHotelOwner(!!decoded.hotel_owner);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  const HotelOwnerRoute = ({ children }) => {
    useEffect(() => {
      if (authChecked && !isHotelOwner) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only hotel owners can access this dashboard",
          confirmButtonColor: "#ef4444",
        });
        navigate("/");
      }
    }, [authChecked, isHotelOwner, navigate]);

    if (!authChecked) return null; // Or loading spinner
    return isHotelOwner ? children ? children : <Outlet /> : null;
  };
  const location = useLocation();

  // Check if the current route is under "admin" to conditionally render Navbar and Footer
  const isAdminRoute =
    location.pathname.startsWith("/hotelowner") ||
    location.pathname.startsWith("/airline-owner");

  return (
    <>
      {/* Show Navbar only if not on admin routes */}
      {!isAdminRoute && (
        <header className="w-full">
          <Navbar />
        </header>
      )}
      <Routes>
        {/* Flight */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/otp/:email" element={<OtpPage />} />
        <Route path="/flight/otp/:email" element={<FLightOtpPage />} />
        <Route path="/booking/flight" element={<FlightSearch />} />
        <Route path="/booking/flightdetails" element={<FlightDetails />} />
        <Route path="/booking/flightreview" element={<FlightReviewPage />} />

        {/* Hotel */}
        <Route path="/booking/hotel" element={<HotelSearch />} />
        <Route path="/booking/hotel/:id" element={<HotelDetails />} />
        <Route path="/booking/hotelreview" element={<HotelReviewPage />} />
        <Route path="/rate/:bookingId" element={<RateStay />} />
        <Route path="/rating-thank-you" element={<RatingThankYou />} />
        <Route path="/register/hotel/owner" element={<HotelOwnerRegister />} />
        <Route path="/login/hotel" element={<HotelOwnerLogin />} />
        <Route path="/verify/:email" element={<HotelOwnerVerify />} />
        <Route path="addhotel" element={<HotelAdd />} />
        <Route path="addroom" element={<RoomAdd />} />

        <Route
          path="/register/airline"
          element={<AirlineOwnerRegistration />}
        />
        <Route path="/login/airline" element={<FlightOwnerLogin />} />

        <Route path="/add-flight" element={<FlightRegister />} />
        <Route path="/airline-owner/dashboard" element={<FlightAdminPanel />}>
          <Route path="flights" element={<FlightDashboard />} />
          <Route path="booked" element={<FlightBooking />} />
        </Route>
        {/* Hotel Owner */}
        <Route
          path="/hotelowner/dashboard"
          element={
            <HotelOwnerRoute>
              <HotelAdminPanel />
            </HotelOwnerRoute>
          }
        >
          <Route
            path="hotel"
            element={
              <HotelOwnerRoute>
                <HotelDashboard />
              </HotelOwnerRoute>
            }
          />
          <Route
            path="room"
            element={
              <HotelOwnerRoute>
                <RoomDashboard />
              </HotelOwnerRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <HotelOwnerRoute>
                <HotelBookingManagement />
              </HotelOwnerRoute>
            }
          />
          <Route
            path="ratings"
            element={
              <HotelOwnerRoute>
                <HotelRatingManagement />
              </HotelOwnerRoute>
            }
          />
        </Route>

        {/* Cab */}
        <Route path="/booking/cab" element={<CabDetails />} />
        <Route path="/booking/cabreview" element={<CabReviewPage />} />
        <Route path="/booking/addingcab" element={<AddingCab />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/booking/riderdashboard" element={<RiderDashboard />} />
        <Route
          path="/booking/confirmbooking/:id"
          element={<ConfirmBooking />}
        />
        <Route path="/booking/ridersignup" element={<RiderSignup />} />
        <Route path="/booking/riderlogin" element={<Riderlogin />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/otprider/:email" element={<OtpVerified />} />
        <Route path="/riderprofile" element={<RiderProfile />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        <Route path="/super/dashboard" element={<SuperLayout />}>
          <Route
            index
            element={<div>Select an admin panel from the sidebar</div>}
          />
          <Route path="flight" element={<FlightAdmin />} />
          <Route path="hotel" element={<SuperHotelAdmin />} />{" "}
          {/* Assuming HotelAdmin, adjust if SuperHotelAdmin */}
        </Route>
      </Routes>
      {/* Show Footer only if not on admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
