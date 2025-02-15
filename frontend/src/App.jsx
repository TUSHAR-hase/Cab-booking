import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './index.css';
import Home from './Pages/Home.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import FlightSearch from "./Pages/Flight/FlightSearch.jsx";
import FlightDetails from "./Pages/Flight/FlightDetails.jsx";
import FlightReviewPage from "./Pages/Flight/FlightReview.jsx";

function App() {

  return (
    <>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/flight" element={<FlightSearch />} />
        <Route path="/booking/flightdeatils" element={<FlightDetails />} />
        <Route path="/booking/flightreview" element={<FlightReviewPage />} />
      </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
