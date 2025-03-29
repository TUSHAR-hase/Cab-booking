import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Clock, XCircle } from "lucide-react";

const FlightDashboard = () => {
  const navigate = useNavigate();

  // Updated flight data with status field
  const [flights, setFlights] = useState([
    { 
      id: 1, 
      flightNumber: "AI-101", 
      airline: "Air India", 
      classType: "Economy", 
      price: 7500,
      departureTime: "10:30 AM",
      arrivalTime: "12:45 PM",
      from: "Delhi",
      to: "Mumbai",
      status: "Active"
    },
    { 
      id: 2, 
      flightNumber: "SG-202", 
      airline: "SpiceJet", 
      classType: "Business", 
      price: 15000,
      departureTime: "2:45 PM",
      arrivalTime: "5:15 PM",
      from: "Bangalore",
      to: "Kolkata",
      status: "Active"
    },
    { 
      id: 3, 
      flightNumber: "6E-303", 
      airline: "IndiGo", 
      classType: "Premium Economy", 
      price: 9000,
      departureTime: "6:15 PM",
      arrivalTime: "8:45 PM",
      from: "Chennai",
      to: "Hyderabad",
      status: "Active"
    },
  ]);

  // State for dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'delete', 'updateTime', or 'cancel'
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // Form state for time update
  const [formData, setFormData] = useState({
    departureTime: '',
    arrivalTime: '',
    from: '',
    to: ''
  });

  // Open dialog for delete confirmation
  const openDeleteDialog = (flight) => {
    setSelectedFlight(flight);
    setDialogType('delete');
    setShowDialog(true);
  };

  // Open dialog for time update
  const openTimeUpdateDialog = (flight) => {
    setSelectedFlight(flight);
    setDialogType('updateTime');
    setFormData({
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      from: flight.from,
      to: flight.to
    });
    setShowDialog(true);
  };

  // Open dialog for flight cancellation
  const openCancelFlightDialog = (flight) => {
    setSelectedFlight(flight);
    setDialogType('cancel');
    setShowDialog(true);
  };

  // Handle delete
  const deleteFlight = () => {
    setFlights(flights.filter((flight) => flight.id !== selectedFlight.id));
    setShowDialog(false);
  };

  // Handle flight cancellation
  const cancelFlight = () => {
    setFlights(flights.map(flight => 
      flight.id === selectedFlight.id 
        ? { ...flight, status: "Cancelled" } 
        : flight
    ));
    setShowDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle time update
  const updateFlightTime = () => {
    setFlights(flights.map(flight => 
      flight.id === selectedFlight.id 
        ? { 
            ...flight, 
            departureTime: formData.departureTime,
            arrivalTime: formData.arrivalTime,
            from: formData.from,
            to: formData.to
          } 
        : flight
    ));
    setShowDialog(false);
  };

  // Close dialog
  const closeDialog = () => {
    setShowDialog(false);
    setSelectedFlight(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-red-600 pb-6">
        <h2 className="text-4xl font-extrabold text-red-500 tracking-tight">
          Flight Management Dashboard
        </h2>
        <button
          onClick={() => navigate("/add-flight")}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl flex items-center shadow-lg transition duration-300"
        >
          <Plus className="mr-2" size={22} /> Add New Flight
        </button>
      </div>

      {/* Flight List */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="p-4 font-semibold">Airline</th>
              <th className="p-4 font-semibold">Flight No.</th>
              <th className="p-4 font-semibold">Route</th>
              <th className="p-4 font-semibold">Class</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Departure</th>
              <th className="p-4 font-semibold">Arrival</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => (
              <tr 
                key={flight.id} 
                className={`${
                  flight.status === "Cancelled" 
                    ? 'bg-red-900/30' 
                    : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                } hover:bg-gray-700 transition duration-200`}
              >
                <td className="p-4">{flight.airline}</td>
                <td className="p-4 font-mono">{flight.flightNumber}</td>
                <td className="p-4">{flight.from} → {flight.to}</td>
                <td className="p-4">{flight.classType}</td>
                <td className="p-4">₹ {flight.price.toLocaleString()}</td>
                <td className="p-4">{flight.departureTime}</td>
                <td className="p-4">{flight.arrivalTime}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    flight.status === "Active" ? "bg-green-600" : "bg-red-600"
                  }`}>
                    {flight.status}
                  </span>
                </td>
                <td className="p-4 flex space-x-3">
                  <button
                    onClick={() => openTimeUpdateDialog(flight)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition duration-200"
                    title="Update Time"
                    disabled={flight.status === "Cancelled"}
                  >
                    <Clock size={18} />
                  </button>
                  {flight.status === "Active" && (
                    <button
                      onClick={() => openCancelFlightDialog(flight)}
                      className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition duration-200"
                      title="Cancel Flight"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => openDeleteDialog(flight)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200"
                    title="Delete Flight"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flights.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No flights available. Add a new flight to get started!
          </div>
        )}
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full">
            {dialogType === 'delete' && (
              <>
                <h3 className="text-xl font-bold text-red-500 mb-4">Confirm Deletion</h3>
                <p className="mb-6">
                  Are you sure you want to delete flight {selectedFlight.flightNumber} from {selectedFlight.from} to {selectedFlight.to}?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeDialog}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteFlight}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {dialogType === 'cancel' && (
              <>
                <h3 className="text-xl font-bold text-orange-500 mb-4">Cancel Flight</h3>
                <p className="mb-6">
                  Are you sure you want to cancel flight {selectedFlight.flightNumber} from {selectedFlight.from} to {selectedFlight.to}?
                </p>
                <p className="mb-6 text-yellow-400 text-sm">
                  <strong>Note:</strong> Cancelling a flight will notify all passengers who have booked tickets. This action cannot be easily reversed.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeDialog}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={cancelFlight}
                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Cancel Flight
                  </button>
                </div>
              </>
            )}

            {dialogType === 'updateTime' && (
              <>
                <h3 className="text-xl font-bold text-purple-500 mb-4">Update Flight Details</h3>
                <p className="mb-4 text-gray-400">
                  Flight: {selectedFlight.flightNumber} - {selectedFlight.airline}
                </p>
                <form onSubmit={(e) => { e.preventDefault(); updateFlightTime(); }}>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-400 mb-1">From</label>
                      <input
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">To</label>
                      <input
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Departure Time</label>
                      <input
                        type="text"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 rounded-lg p-2 text-white"
                        placeholder="e.g., 10:30 AM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Arrival Time</label>
                      <input
                        type="text"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 rounded-lg p-2 text-white"
                        placeholder="e.g., 12:45 PM"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeDialog}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition duration-200"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDashboard;