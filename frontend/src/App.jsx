import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
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
import AddingCab from "./Pages/Cab/AddingCab.jsx";
import UserDashboard from "./Pages/Cab/UserDashboard.jsx";
import RiderDashboard from "./Pages/Cab/Rider/RiderDashbord.jsx";
import Riderlogin from "./Pages/Cab/Rider/Riderlogin.jsx";
import ConfirmBooking from "./Pages/Cab/ConfrimBooking";
import RiderSignup from "./Pages/Cab/Rider/RiderSignup.jsx";
import ForgotPassword from "./Pages/Cab/ForgetPassword.jsx";
import FLightOtpPage from "./Pages/Flight/Otp.jsx";

function App() {
  const location = useLocation();

  // Check if the current route is under "admin" to conditionally render Navbar and Footer
  const isAdminRoute = location.pathname.startsWith("/hotelowner");

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
        <Route path="/otp/:email" element={<OtpPage />} />
        <Route path="/flight/otp/:email" element={<FLightOtpPage />} />
        <Route path="/booking/flight" element={<FlightSearch />} />
        <Route path="/booking/flightdetails" element={<FlightDetails />} />
        <Route path="/booking/flightreview" element={<FlightReviewPage />} />

        {/* Hotel */}
        <Route path="/booking/hotel" element={<HotelSearch />} />
        <Route path="/booking/hoteldetails" element={<HotelDetails />} />
        <Route path="/booking/hotelreview" element={<HotelReviewPage />} />
        <Route path="/register/airline" element={<AirlineOwnerRegistration />} />
        <Route path="/register/hotel/owner" element={<HotelOwnerRegister />} />
        <Route path="/login/hotel" element={<HotelOwnerLogin />} />
        <Route path="/verify/:email" element={<HotelOwnerVerify />} />
        <Route path="addhotel" element={<HotelAdd />} />
        <Route path="addroom" element={<RoomAdd />} />

        {/* Hotel Owner */}
        <Route path="/hotelowner/dashboard" element={<HotelAdminPanel />}>
          <Route path="hotel" element={<HotelDashboard />} />
          <Route path="room" element={<RoomDashboard />} />
        </Route>

        {/* Cab */}
        <Route path="/booking/cab" element={<CabDetails />} />
          <Route path="/booking/cabreview" element={<CabReviewPage />} />
          <Route path="/booking/addingcab" element={<AddingCab />} />
          <Route path="/booking/userdashboard" element={<UserDashboard />} />
          <Route path="/booking/riderdashboard" element={<RiderDashboard />} />
          <Route path="/booking/confirmbooking" element={<ConfirmBooking />} />
          <Route path="/booking/ridersignup" element={<RiderSignup />} />
          <Route path="/booking/riderlogin/:email/:id" element={<Riderlogin />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/otp/:email" element={<OtpVerified/>} />
      </Routes>
      {/* Show Footer only if not on admin routes */}
      {!isAdminRoute && (
        <Footer />
      )}
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