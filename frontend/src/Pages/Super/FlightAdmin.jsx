// FlightAdmin.jsx
import React, { useState } from 'react';

function FlightAdmin() {
  const [airlines, setAirlines] = useState([
    { 
      id: 'A001', 
      name: 'SkyHigh Airlines', 
      phone: '+1-555-0101', 
      email: 'contact@skyhigh.com',
      status: 'pending' 
    },
    { 
      id: 'A002', 
      name: 'CloudNine Airways', 
      phone: '+44-555-0202', 
      email: 'info@cloudnine.com',
      status: 'pending' 
    },
    { 
      id: 'A003', 
      name: 'Eagle Flights', 
      phone: '+1-555-0303', 
      email: 'support@eagleflights.com',
      status: 'pending' 
    },
  ]);

  const handleAccept = (id) => {
    if (window.confirm('Are you sure you want to accept this airline?')) {
      setAirlines(airlines.map(airline => 
        airline.id === id ? { ...airline, status: 'accepted' } : airline
      ));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this airline?')) {
      setAirlines(airlines.map(airline => 
        airline.id === id ? { ...airline, status: 'rejected' } : airline
      ));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 uppercase tracking-wider mb-2">
          Flight Admin Dashboard
        </h1>
        <p className="text-gray-300 mb-8">Manage airline operations efficiently</p>

        <div className="bg-gray-900 rounded-xl shadow-2xl shadow-red-500/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-4 text-left font-semibold">Airline ID</th>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr 
                  key={airline.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="p-4">{airline.id}</td>
                  <td className="p-4">{airline.name}</td>
                  <td className="p-4">{airline.phone}</td>
                  <td className="p-4">{airline.email}</td>
                  <td className="p-4">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
                        airline.status === 'accepted' 
                          ? 'bg-red-500 text-white' 
                          : airline.status === 'rejected' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-black'
                      }`}
                    >
                      {airline.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleAccept(airline.id)}
                      disabled={airline.status !== 'pending'}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        airline.status === 'pending'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(airline.id)}
                      disabled={airline.status !== 'pending'}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        airline.status === 'pending'
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

export default FlightAdmin;