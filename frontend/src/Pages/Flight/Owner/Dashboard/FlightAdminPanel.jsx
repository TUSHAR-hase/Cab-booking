import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plane, Users, LogOut, Menu } from "lucide-react";
import FlightDashboard from "./FlightDashboard.jsx";
import FlightBooking from "./Flightbooking.jsx";

const FlightAdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-red-500 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-40 h-full w-64 bg-black border-r border-red-500 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-red-500">
          <h2 className="text-2xl font-bold text-red-500">Flight Admin Panel</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  navigate("/airline-owner/dashboard/flights");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center py-3 px-4 rounded-lg ${
                  location.pathname === "/airline-owner/dashboard/flights"
                    ? "bg-red-500 text-black"
                    : "hover:bg-red-500 hover:text-black"
                } transition-all duration-200`}
              >
                <Plane className="mr-3" size={20} />
                <span>Flights</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/airline-owner/dashboard/booked");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center py-3 px-4 rounded-lg ${
                  location.pathname === "/airline-owner/dashboard/booked"
                    ? "bg-red-500 text-black"
                    : "hover:bg-red-500 hover:text-black"
                } transition-all duration-200`}
              >
                <Users className="mr-3" size={20} />
                <span>Booking</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-500">
          <button
            onClick={() => navigate("/login/flight")}
            className="w-full flex items-center justify-center py-3 px-4 text-center bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            <LogOut className="text-white mr-2" size={20} />
            <span className="text-white">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-4 lg:p-6 min-h-full">
          {location.pathname === "/airline-owner/dashboard/flights" ? (
            <FlightDashboard />
          ) : (
            <FlightBooking />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightAdminPanel;