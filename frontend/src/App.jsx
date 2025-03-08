import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './index.css';
import Home from './Pages/Home.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
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
import HotelOwnerRegister from "./Pages/Hotel/HotelOwnerRegister.jsx";

function App() {

  return (
    <>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/otp/:email" element={<OtpPage/>} />
        <Route path="/booking/flight" element={<FlightSearch />} />
        <Route path="/booking/flightdetails" element={<FlightDetails />} />
        <Route path="/booking/flightreview" element={<FlightReviewPage />} />
        <Route path="/booking/hotel" element={<HotelSearch />} />
        <Route path="/booking/hoteldetails" element={<HotelDetails />} />
        <Route path="/booking/hotelreview" element={<HotelReviewPage />} />
        <Route path="/register/airline" element={<AirlineOwnerRegistration/>} />
        <Route path="/register/hotel" element={<HotelOwnerRegister/>} />
      </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
