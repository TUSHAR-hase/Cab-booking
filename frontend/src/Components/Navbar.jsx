import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, Info, PhoneCall, CalendarCheck, Hotel, Car, Plane, User, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-lg relative z-50">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <Home size={28} className="text-red-500" />
        <Link to="/" className="text-2xl font-bold text-red-500 hover:scale-110 transition-transform duration-300">BrandLogo</Link>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className={`lg:flex flex-col lg:flex-row lg:space-x-8 text-lg absolute lg:static top-0 left-0 w-full lg:w-auto bg-black lg:bg-transparent transition-transform duration-300 ${isMenuOpen ? 'h-screen flex flex-col items-center pt-20' : 'hidden lg:flex'}`}>
        <Link to="/" className="flex items-center space-x-1 p-4 hover:text-red-500 transition-all duration-300">
          <Home size={20} /> <span>Home</span>
        </Link>
        
        <div className="relative group">
          <button className="flex items-center space-x-1 p-4 hover:text-red-500 transition-all duration-300">
            <CalendarCheck size={20} /> <span>Booking</span>
          </button>
          <div className="absolute hidden group-hover:block bg-black text-white mt-2 rounded-lg shadow-lg w-40 border border-red-500">
            <Link to="/booking/hotel" className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500 transition-all duration-300">
              <Hotel size={18} /> <span>Hotel</span>
            </Link>
            <Link to="/booking/cab" className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500 transition-all duration-300">
              <Car size={18} /> <span>Cab</span>
            </Link>
            <Link to="/booking/flight" className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500 transition-all duration-300">
              <Plane size={18} /> <span>Flight</span>
            </Link>
          </div>
        </div>
        
        <Link to="/about" className="flex items-center space-x-1 p-4 hover:text-red-500 transition-all duration-300">
          <Info size={20} /> <span>About Us</span>
        </Link>
        <Link to="/contact" className="flex items-center space-x-1 p-4 hover:text-red-500 transition-all duration-300">
          <PhoneCall size={20} /> <span>Contact Us</span>
        </Link>

        {/* Authentication Links */}
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center">
          {isLoggedIn ? (
            <Link to="/profile" className="flex items-center space-x-1 p-4 hover:text-red-500 transition-all duration-300">
              <User size={20} /> <span>Profile</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <LogIn size={20} /> <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg">
                <UserPlus size={20} /> <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
