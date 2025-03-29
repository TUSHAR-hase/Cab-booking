import React, { useState, useEffect } from "react";
import { Search, Calendar, User, Package, BarChart2, Filter, Plane, Clock } from "lucide-react";

const FlightBooking = () => {
  // Sample data for flight bookings
  const [bookings, setBookings] = useState([
    {
      id: 1,
      flightNumber: "AI-101",
      passengerName: "Rahul Sharma",
      bookingDate: "2025-03-25",
      seatNumber: "14A",
      fare: 7850,
      status: "Confirmed",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "10:30 AM"
    },
    {
      id: 2,
      flightNumber: "AI-101",
      passengerName: "Priya Patel",
      bookingDate: "2025-03-24",
      seatNumber: "15B",
      fare: 7850,
      status: "Confirmed",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "10:30 AM"
    },
    {
      id: 3,
      flightNumber: "SG-202",
      passengerName: "Amit Kumar",
      bookingDate: "2025-03-25",
      seatNumber: "4C",
      fare: 16500,
      status: "Confirmed",
      from: "Bangalore",
      to: "Kolkata",
      departureTime: "2:45 PM"
    },
    {
      id: 4,
      flightNumber: "6E-303",
      passengerName: "Neha Singh",
      bookingDate: "2025-03-26",
      seatNumber: "8D",
      fare: 9200,
      status: "Waiting",
      from: "Chennai",
      to: "Hyderabad",
      departureTime: "6:15 PM"
    },
    {
      id: 5,
      flightNumber: "SG-202",
      passengerName: "Vikram Mehta",
      bookingDate: "2025-03-25",
      seatNumber: "5A",
      fare: 16500,
      status: "Confirmed",
      from: "Bangalore",
      to: "Kolkata",
      departureTime: "2:45 PM"
    },
    {
      id: 6,
      flightNumber: "AI-101",
      passengerName: "Sneha Reddy",
      bookingDate: "2025-03-26",
      seatNumber: "16F",
      fare: 7850,
      status: "Confirmed",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "10:30 AM"
    },
    {
      id: 7,
      flightNumber: "6E-303",
      passengerName: "Rajesh Khanna",
      bookingDate: "2025-03-27",
      seatNumber: "10E",
      fare: 9200,
      status: "Confirmed",
      from: "Chennai",
      to: "Hyderabad",
      departureTime: "6:15 PM"
    }
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [flightStats, setFlightStats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchFocus, setSearchFocus] = useState(false);

  // Effect to handle search and filtering
  useEffect(() => {
    // Filter bookings based on search term
    const results = bookings.filter(booking => 
      booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply status filter if not "all"
    const statusFiltered = activeFilter === "all" 
      ? results 
      : results.filter(booking => booking.status.toLowerCase() === activeFilter.toLowerCase());
    
    setFilteredBookings(statusFiltered);
    
    // Calculate flight statistics
    const stats = [];
    const flights = {};
    
    bookings.forEach(booking => {
      if (!flights[booking.flightNumber]) {
        flights[booking.flightNumber] = {
          flightNumber: booking.flightNumber,
          from: booking.from,
          to: booking.to,
          departureTime: booking.departureTime,
          totalBookings: 0,
          totalRevenue: 0,
          confirmedBookings: 0,
          waitingBookings: 0
        };
      }
      
      flights[booking.flightNumber].totalBookings += 1;
      flights[booking.flightNumber].totalRevenue += booking.fare;
      
      if (booking.status === "Confirmed") {
        flights[booking.flightNumber].confirmedBookings += 1;
      } else if (booking.status === "Waiting") {
        flights[booking.flightNumber].waitingBookings += 1;
      }
    });
    
    Object.values(flights).forEach(flight => {
      stats.push(flight);
    });
    
    setFlightStats(stats);
  }, [bookings, searchTerm, activeFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Main container with additional bottom padding to prevent footer overlap */}
      <div className="max-w-full mx-auto pt-6 px-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-red-800 pb-6">
          <div className="flex items-center">
            <Plane className="text-red-600 mr-3" size={30} />
            <h2 className="text-4xl font-extrabold text-red-600 tracking-tight">
              Flight Booking Dashboard
            </h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search flight, passenger, route..."
              className={`bg-gray-900 w-96 py-3 px-12 rounded-xl text-white border transition-all duration-300 ${
                searchFocus 
                  ? "border-red-500 shadow-lg shadow-red-900/20" 
                  : "border-gray-800 shadow-none"
              } focus:outline-none`}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            <Search className="absolute left-4 top-3.5 text-red-500" size={20} />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Status Filter Buttons */}
        <div className="flex mb-8 space-x-4">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
              activeFilter === "all" 
                ? "bg-red-700 text-white shadow-lg shadow-red-900/30" 
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            <Package className="mr-2" size={18} /> All Bookings
          </button>
          <button
            onClick={() => handleFilterChange("confirmed")}
            className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
              activeFilter === "confirmed" 
                ? "bg-green-800 text-white shadow-lg shadow-green-900/30" 
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            <User className="mr-2" size={18} /> Confirmed
          </button>
          <button
            onClick={() => handleFilterChange("waiting")}
            className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
              activeFilter === "waiting" 
                ? "bg-yellow-800 text-white shadow-lg shadow-yellow-900/30" 
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            <Clock className="mr-2" size={18} /> Waiting
          </button>
        </div>

        {/* Flight Stats Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-red-500 mb-4 flex items-center">
            <BarChart2 className="mr-2" size={24} /> Flight Registration Summary
          </h3>
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-x-auto border border-gray-800">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-red-900 text-white">
                  <th className="p-4 font-semibold">Flight No.</th>
                  <th className="p-4 font-semibold">Route</th>
                  <th className="p-4 font-semibold">Departure</th>
                  <th className="p-4 font-semibold">Total Bookings</th>
                  <th className="p-4 font-semibold">Confirmed</th>
                  <th className="p-4 font-semibold">Waiting</th>
                  <th className="p-4 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {flightStats.map((stat, index) => (
                  <tr 
                    key={stat.flightNumber} 
                    className={`${
                      index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                    } hover:bg-red-900/10 transition duration-200`}
                  >
                    <td className="p-4 font-mono font-medium text-red-400">{stat.flightNumber}</td>
                    <td className="p-4">{stat.from} 
                      <span className="mx-2 text-red-500">→</span> 
                      {stat.to}
                    </td>
                    <td className="p-4">{stat.departureTime}</td>
                    <td className="p-4">{stat.totalBookings}</td>
                    <td className="p-4 text-green-400">{stat.confirmedBookings}</td>
                    <td className="p-4 text-yellow-400">{stat.waitingBookings}</td>
                    <td className="p-4 font-medium">₹ {stat.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-red-950 font-semibold">
                <tr>
                  <td className="p-4" colSpan={3}>Total</td>
                  <td className="p-4">{flightStats.reduce((acc, stat) => acc + stat.totalBookings, 0)}</td>
                  <td className="p-4 text-green-400">{flightStats.reduce((acc, stat) => acc + stat.confirmedBookings, 0)}</td>
                  <td className="p-4 text-yellow-400">{flightStats.reduce((acc, stat) => acc + stat.waitingBookings, 0)}</td>
                  <td className="p-4 text-red-300">₹ {flightStats.reduce((acc, stat) => acc + stat.totalRevenue, 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Booking List Section */}
        <div>
          <h3 className="text-2xl font-bold text-red-500 mb-4 flex items-center">
            <Filter className="mr-2" size={24} /> Booking Details
            <span className="ml-4 text-base text-gray-400 font-normal">
              {filteredBookings.length} bookings found
            </span>
          </h3>
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-x-auto border border-gray-800">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-red-900 text-white">
                  <th className="p-4 font-semibold">Booking ID</th>
                  <th className="p-4 font-semibold">Flight</th>
                  <th className="p-4 font-semibold">Passenger</th>
                  <th className="p-4 font-semibold">Route</th>
                  <th className="p-4 font-semibold">Booking Date</th>
                  <th className="p-4 font-semibold">Seat</th>
                  <th className="p-4 font-semibold">Fare</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                    } hover:bg-red-900/10 transition duration-200`}
                  >
                    <td className="p-4 font-medium">BK-{booking.id.toString().padStart(4, '0')}</td>
                    <td className="p-4 font-mono text-red-400">{booking.flightNumber}</td>
                    <td className="p-4">{booking.passengerName}</td>
                    <td className="p-4">{booking.from} 
                      <span className="mx-2 text-red-500">→</span> 
                      {booking.to}
                    </td>
                    <td className="p-4">{new Date(booking.bookingDate).toLocaleDateString('en-IN')}</td>
                    <td className="p-4 font-mono">{booking.seatNumber}</td>
                    <td className="p-4">₹ {booking.fare.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                        booking.status === 'Confirmed' ? 'bg-green-900/50 text-green-400 border border-green-700' : 
                        booking.status === 'Waiting' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' : 
                        'bg-red-900/50 text-red-400 border border-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Search className="text-red-500 mb-3" size={32} />
                <p>No bookings found matching your search criteria.</p>
                <button 
                  onClick={clearSearch}
                  className="mt-3 text-red-500 hover:text-red-400 underline text-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;