// HotelAdmin.jsx
import React, { useState } from 'react';

function SuperHotelAdmin() {
  const [hotels, setHotels] = useState([
    { 
      id: 'H001', 
      name: 'Grand Palace Hotel', 
      phone: '+1-555-1001', 
      email: 'info@grandpalace.com',
      status: 'pending' 
    },
    { 
      id: 'H002', 
      name: 'Ocean View Resort', 
      phone: '+1-555-1002', 
      email: 'contact@oceanview.com',
      status: 'pending' 
    },
    { 
      id: 'H003', 
      name: 'City Central Inn', 
      phone: '+1-555-1003', 
      email: 'bookings@citycentral.com',
      status: 'pending' 
    },
  ]);

  const handleAccept = (id) => {
    if (window.confirm('Are you sure you want to accept this hotel?')) {
      setHotels(hotels.map(hotel => 
        hotel.id === id ? { ...hotel, status: 'accepted' } : hotel
      ));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this hotel?')) {
      setHotels(hotels.map(hotel => 
        hotel.id === id ? { ...hotel, status: 'rejected' } : hotel
      ));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 uppercase tracking-wider mb-2">
          Hotel Admin Dashboard
        </h1>
        <p className="text-gray-300 mb-8">Oversee hotel management here</p>

        <div className="bg-gray-900 rounded-xl shadow-2xl shadow-red-500/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-4 text-left font-semibold">Hotel ID</th>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr 
                  key={hotel.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="p-4">{hotel.id}</td>
                  <td className="p-4">{hotel.name}</td>
                  <td className="p-4">{hotel.phone}</td>
                  <td className="p-4">{hotel.email}</td>
                  <td className="p-4">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
                        hotel.status === 'accepted' 
                          ? 'bg-red-500 text-white' 
                          : hotel.status === 'rejected' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-black'
                      }`}
                    >
                      {hotel.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleAccept(hotel.id)}
                      disabled={hotel.status !== 'pending'}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        hotel.status === 'pending'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(hotel.id)}
                      disabled={hotel.status !== 'pending'}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        hotel.status === 'pending'
                          ? 'bg-white text-red-600 hover:bg-gray-100'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperHotelAdmin;