import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function SuperHotelAdmin() {
  const [approvedOwners, setApprovedOwners] = useState([]);
  const [unapprovedOwners, setUnapprovedOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('unapproved');
  const [ownerHotels, setOwnerHotels] = useState([]);
  const [showHotelsModal, setShowHotelsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentAction, setCurrentAction] = useState({ type: '', ownerId: null });
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  // Fetch all approved hotel owners
  const fetchApprovedOwners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/owner/admin/get-approved-hotel-owner`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',

      });

      const data = await response.json();

      if (response.ok) {
        setApprovedOwners(data.data);
      } else {
        setError(data.message || 'Failed to fetch approved hotel owners.');
      }
    } catch (err) {
      setError('An error occurred while fetching approved hotel owners.');
    }
  };

  // Fetch all unapproved hotel owners
  const fetchUnapprovedOwners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/owner/admin/get-unapproved-hotel-owner`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',

      });

      const data = await response.json();

      if (response.ok) {
        setUnapprovedOwners(data.data);
      } else {
        setError(data.message || 'Failed to fetch unapproved hotel owners.');
      }
    } catch (err) {
      setError('An error occurred while fetching unapproved hotel owners.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels for a specific owner
  const fetchOwnerHotels = async (ownerId) => {
    try {

      // Option 2: Using query parameters(alternative)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/admin/get-owner-hotels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ownerId }),
      });

      const data = await response.json();

      if (response.ok) {
        setOwnerHotels(data.data);
        setShowHotelsModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to fetch owner hotels',
          confirmButtonColor: '#dc2626',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching owner hotels',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  // Handle confirmation modal actions
  const handleConfirmation = async (confirmed) => {
    setShowConfirmationModal(false);

    if (!confirmed) return;

    const { type, ownerId } = currentAction;
    setLoading(true);

    try {
      if (type === 'approve') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/owner/admin/approve-owner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',

          body: JSON.stringify({ hotelId: ownerId }),
        });

        const data = await response.json();

        if (response.ok) {
          // Refetch both lists to ensure data is fresh
          await Promise.all([fetchApprovedOwners(), fetchUnapprovedOwners()]);

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message || 'Owner approved successfully',
            confirmButtonColor: '#10b981',
          });
        } else {
          throw new Error(data.message || 'Failed to approve hotel owner');
        }
      } else if (type === 'reject') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/owner/admin/reject-owner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',

          body: JSON.stringify({ hotelId: ownerId }),
        });

        const data = await response.json();

        if (response.ok) {
          // Refetch the unapproved list
          await fetchUnapprovedOwners();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message || 'Owner rejected successfully',
            confirmButtonColor: '#10b981',
          });
        } else {
          throw new Error(data.message || 'Failed to reject hotel owner');
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An error occurred while processing your request',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  const viewOwnerDetails = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerModal(true);
  };
  // Open confirmation modal
  const openConfirmationModal = (type, ownerId) => {
    setCurrentAction({ type, ownerId });
    setShowConfirmationModal(true);
  };

  // Fetch owners on initial load
  useEffect(() => {
    fetchApprovedOwners();
    fetchUnapprovedOwners();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 uppercase tracking-wider mb-2">
          Hotel Admin Dashboard
        </h1>
        <p className="text-gray-300 mb-8">Oversee hotel management here</p>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'unapproved' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('unapproved')}
          >
            Pending Approval ({unapprovedOwners.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'approved' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved Owners ({approvedOwners.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-2xl shadow-red-500/20 overflow-hidden">
            {/* Unapproved Owners Table */}
            {activeTab === 'unapproved' && (
              <div>
                <h2 className="text-xl font-bold text-red-600 p-4">Owners Pending Approval</h2>
                {unapprovedOwners.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No owners pending approval
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-red-600 text-white">
                        <th className="p-4 text-left font-semibold">Business Name</th>
                        <th className="p-4 text-left font-semibold">Business Reg. No.</th>
                        <th className="p-4 text-left font-semibold">Owner Name</th>
                        <th className="p-4 text-left font-semibold">Email</th>
                        <th className="p-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unapprovedOwners.map((owner) => (
                        <tr
                          key={owner._id}
                          className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200"
                        >
                          <td className="p-4">{owner.bussinessName}</td>
                          <td className="p-4">{owner.bussinessRegNo}</td>
                          <td className="p-4">{owner.name}</td>
                          <td className="p-4">{owner.email}</td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => openConfirmationModal('approve', owner._id)}
                              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirmationModal('reject', owner._id)}
                              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Approved Owners Table */}
            {activeTab === 'approved' && (
              <div>
                <h2 className="text-xl font-bold text-red-600 p-4">Approved Owners</h2>
                {approvedOwners.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No approved owners yet
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-red-600 text-white">
                        <th className="p-4 text-left font-semibold">Business Name</th>
                        <th className="p-4 text-left font-semibold">Business Reg. No.</th>
                        <th className="p-4 text-left font-semibold">Owner Name</th>
                        <th className="p-4 text-left font-semibold">Email</th>
                        <th className="p-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedOwners.map((owner) => (
                        <tr
                          key={owner._id}
                          className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200"
                        >
                          <td className="p-4">{owner.bussinessName}</td>
                          <td className="p-4">{owner.bussinessRegNo}</td>
                          <td className="p-4">{owner.name}</td>
                          <td className="p-4">{owner.email}</td>
                          <td className="p-4">
                            <button
                              onClick={() => viewOwnerDetails(owner)}
                              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showOwnerModal && selectedOwner && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold text-red-500">Owner Details</h3>
              <button
                onClick={() => setShowOwnerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-red-500 mb-2">Personal Information</h4>
                  <p className="text-gray-300"><span className="font-medium">Name:</span> {selectedOwner.name}</p>
                  <p className="text-gray-300"><span className="font-medium">Email:</span> {selectedOwner.email}</p>
                  {/* <p className="text-gray-300"><span className="font-medium">Phone:</span> {selectedOwner.phone || 'N/A'}</p> */}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-500 mb-2">Business Information</h4>
                  <p className="text-gray-300"><span className="font-medium">Business Name:</span> {selectedOwner.bussinessName}</p>
                  <p className="text-gray-300"><span className="font-medium">Registration No:</span> {selectedOwner.bussinessRegNo}</p>
                  <p className="text-gray-300"><span className="font-medium">Address:</span> {selectedOwner.address || 'N/A'}</p>
                </div>
              </div>
              {activeTab === 'approved' && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowOwnerModal(false);
                      fetchOwnerHotels(selectedOwner._id);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                  >
                    View Hotels
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Hotels Modal */}
      {showHotelsModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-3xl w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-red-700 p-4">
              <h3 className="text-2xl font-bold text-red-500">
                <span className="text-white">Owner's</span> Hotels
              </h3>
              <button
                onClick={() => setShowHotelsModal(false)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {ownerHotels.length === 0 ? (
                <div className="text-center py-12 text-red-300 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  This owner has no hotels registered yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                        <th className="p-4 text-left font-bold text-lg">Hotel Name</th>
                        <th className="p-4 text-left font-bold text-lg">Location</th>
                        <th className="p-4 text-left font-bold text-lg">Rooms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerHotels.map((hotel) => (
                        <tr key={hotel.id} className="border-b border-red-900 hover:bg-gray-800 transition-colors">
                          <td className="p-4 text-white">{hotel.name}</td>
                          <td className="p-4 text-gray-300">
                            {hotel.address.area}, {hotel.address.district}, {hotel.address.pincode}
                          </td>
                          <td className="p-4 text-red-400 font-medium">{hotel.totalRooms || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-red-700 flex justify-end">
              <button
                onClick={() => setShowHotelsModal(false)}
                className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-md text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {currentAction.type === 'approve' ? 'Approve Owner' : 'Reject Owner'}
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Are you sure you want to {currentAction.type} this owner?
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className={`${currentAction.type === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  } text-white px-4 py-2 rounded font-semibold transition-colors`}
              >
                {currentAction.type === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperHotelAdmin;