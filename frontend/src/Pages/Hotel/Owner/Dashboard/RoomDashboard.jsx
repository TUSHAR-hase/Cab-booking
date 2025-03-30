import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaPen, FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight, FaEye, FaImage, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

function HotelRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [currentRoom, setCurrentRoom] = useState({
    _id: null,
    hotel: "",
    room_type: "",
    room_price_per_day: 0,
    room_images: [],
    newImages: [],
    status: "available",
    facilities: [],
    max_occupancy: 1,
    room_number: "",
    currentFacility: ""
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const statusOptions = ["available", "booked", "maintenance"];
  const roomTypeOptions = ["Standard", "Deluxe", "Suite", "Executive", "Family"];

  const getImageUrl = (imagePath) => {
    const cleanedPath = imagePath.replace(/^public[\\/]/, '');
    return `${import.meta.env.VITE_API_URL}/${cleanedPath.replace(/\\/g, '/')}`;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const truncateDescription = (text, length = 20) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  useEffect(() => {
    fetchHotels();
    fetchRooms();
    return () => {
      currentRoom.newImages?.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/room/get-owner-rooms`, {
        method: "GET",
        credentials: "include",
      });

      console.log("Rooms API Response:", response); // Debug log

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const data = await response.json();
      console.log("Rooms Data:", data.data); // Debug log

      setRooms(data.data || []);
    } catch (err) {
      console.error("Fetch Rooms Error:", err); // Debug log
      setError(err.message);
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  }; const fetchHotels = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/get-owner-hotels`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch hotels");
      const data = await response.json();

      setHotels(data.data || []);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setCurrentRoom(prev => ({
      ...prev,
      newImages: [...(prev.newImages || []), ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setCurrentRoom(prev => {
      const newImages = [...prev.newImages];
      const removed = newImages.splice(index, 1);
      if (removed[0]?.preview && removed[0]?.file) {
        URL.revokeObjectURL(removed[0].preview);
      }
      return { ...prev, newImages: newImages };
    });
  };

  const handleRemoveExistingImage = (index) => {
    setCurrentRoom(prev => {
      const newImages = [...prev.room_images];
      newImages.splice(index, 1);
      return { ...prev, room_images: newImages };
    });
  };

  const handleAddFacility = () => {
    if (currentRoom.currentFacility.trim() !== "") {
      setCurrentRoom(prev => ({
        ...prev,
        facilities: [...prev.facilities, prev.currentFacility.trim()],
        currentFacility: ""
      }));
    }
  };

  const handleRemoveFacility = (index) => {
    setCurrentRoom(prev => {
      const newFacilities = [...prev.facilities];
      newFacilities.splice(index, 1);
      return { ...prev, facilities: newFacilities };
    });
  };

  const handleAddOrUpdateRoom = async () => {
    try {
      const formData = new FormData();

      // Add all fields
      formData.append('hotel', currentRoom.hotel);
      formData.append('room_type', currentRoom.room_type);
      formData.append('room_price_per_day', currentRoom.room_price_per_day);
      formData.append('status', currentRoom.status);
      formData.append('max_occupancy', currentRoom.max_occupancy);
      formData.append('room_number', currentRoom.room_number);

      // Append each facility separately
      currentRoom.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      });


      if (showModal === "update" || showModal === "update-images") {
        formData.append('id', currentRoom._id);
        currentRoom.room_images?.forEach((img, index) => {
          formData.append('existingImages[]', img);
        });
      }

      // Add new images
      currentRoom.newImages.forEach((img, index) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      const endpoint = showModal === "update" ? "update" :
        showModal === "add" ? "create" : "update-images";

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/room/${endpoint}`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      const result = await response.json();
      fetchRooms();
      setShowModal(null);
      Swal.fire("Success!", `Room ${showModal === "add" ? "added" : "updated"} successfully.`, "success");

    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error!", err.message, "error");
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/room/delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentRoom._id }),
      });

      if (!response.ok) throw new Error("Failed to delete room");

      fetchRooms();
      setShowModal(null);
      Swal.fire("Deleted!", "Room has been deleted.", "success");
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowModal("image-viewer");
  };

  const navigateImage = (direction) => {
    const totalImages = currentRoom.room_images?.length || currentRoom.newImages?.length || 0;
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  const getHotelName = (hotelId) => {
    if (!hotelId) return "No Hotel Selected";

    // Check if hotels data is loaded
    if (hotels.length === 0) return "Loading hotels...";

    const hotel = hotels.find(h => h._id === hotelId);
    return hotel ? hotel.name : "Unknown Hotel";
  };
  return (
    <div className="h-full w-full py-8 px-4 md:px-6 font-poppins bg-black text-white">
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-4 md:mb-6 text-center">Hotel Room Management</h1>
      <p className="text-base md:text-lg text-red-400 mb-6 text-center">Manage and review all hotel rooms effectively.</p>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setCurrentRoom({
              _id: null,
              hotel: "",
              room_type: "",
              room_price_per_day: 0,
              room_images: [],
              newImages: [],
              status: "available",
              facilities: [],
              max_occupancy: 1,
              room_number: "",
              currentFacility: ""
            });
            setShowModal("add");
          }}
          className="bg-red-600 text-white p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-red-700 shadow-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus size={16} /> <span className="hidden md:inline">Add Room</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin border-t-4 border-red-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.length === 0 ? (
            <div className="w-full py-8 md:py-12 text-center bg-black rounded-lg shadow-lg border border-gray-700">
              <div className="mx-auto max-w-2xl p-4 md:p-6">
                <div className="text-5xl md:text-6xl mb-4 text-red-500">🛏️</div>
                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">
                  No Rooms Found
                </h2>
                <p className="text-base md:text-lg text-gray-300">
                  Add a new room to get started!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center mt-4">
                <label className="text-base text-red-400 font-semibold mr-3">Rows per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="p-2 border border-gray-600 rounded text-white text-base bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Table Headings */}
              <div className="hidden md:flex bg-red-600 text-white rounded-lg p-4">
                <div className="w-2/12 text-left font-semibold text-lg">Hotel</div>
                <div className="w-1/12 text-left font-semibold text-lg">Room #</div>
                <div className="w-2/12 text-left font-semibold text-lg">Type</div>
                <div className="w-1/12 text-left font-semibold text-lg">Price</div>
                <div className="w-1/12 text-left font-semibold text-lg">Occupancy</div>
                <div className="w-2/12 text-left font-semibold text-lg">Status</div>
                <div className="w-2/12 text-left font-semibold text-lg">Facilities</div>
                <div className="w-1/12 text-left font-semibold text-lg">Actions</div>
              </div>

              {/* Room Rows */}
              <div className="hidden md:block">
                {currentRooms.map((room) => (
                  <div
                    key={room._id}
                    className="flex flex-row items-center justify-between bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 mb-4"
                  >
                    <div className="w-2/12 text-left">
                      <p className="text-lg text-white">{getHotelName(room.hotel)}</p>
                    </div>
                    <div className="w-1/12 text-left">
                      <p className="text-gray-300">{room.room_number}</p>
                    </div>
                    <div className="w-2/12 text-left">
                      <p className="text-gray-300">{room.room_type}</p>
                    </div>
                    <div className="w-1/12 text-left">
                      <p className="text-gray-300">₹{room.room_price_per_day}</p>
                    </div>
                    <div className="w-1/12 text-left">
                      <p className="text-gray-300">{room.max_occupancy}</p>
                    </div>
                    <div className="w-2/12 text-left">
                      <span className={`px-2 py-1 rounded-full text-xs ${room.status === "available" ? "bg-green-500" :
                        room.status === "booked" ? "bg-red-500" :
                          "bg-yellow-500"
                        }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="w-2/12 text-left">
                      <p className="text-gray-300 truncate">{room.facilities.join(", ")}</p>
                    </div>
                    <div className="w-1/12 text-left">
                      <button
                        onClick={() => {
                          setCurrentRoom({
                            ...room,
                            newImages: [],
                            currentFacility: ""
                          });
                          setShowModal("view");
                        }}
                        className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 shadow-lg transition-colors"
                        title="View"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Room Cards (Mobile) */}
              <div className="md:hidden space-y-4">
                {currentRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-red-400 font-medium">Hotel</p>
                        <p className="text-lg text-white">{getHotelName(room.hotel)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-red-400 font-medium">Room #</p>
                          <p className="text-gray-300">{room.room_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-red-400 font-medium">Type</p>
                          <p className="text-gray-300">{room.room_type}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-red-400 font-medium">Price</p>
                          <p className="text-gray-300">₹{room.room_price_per_day}</p>
                        </div>
                        <div>
                          <p className="text-sm text-red-400 font-medium">Occupancy</p>
                          <p className="text-gray-300">{room.max_occupancy}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${room.status === "available" ? "bg-green-500" :
                          room.status === "booked" ? "bg-red-500" :
                            "bg-yellow-500"
                          }`}>
                          {room.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium">Facilities</p>
                        <p className="text-gray-300">{truncateDescription(room.facilities.join(", "), 30)}</p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setCurrentRoom({
                              ...room,
                              newImages: [],
                              currentFacility: ""
                            });
                            setShowModal("view");
                          }}
                          className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 shadow-lg transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 mb-12">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    {totalPages <= 7 ? (
                      Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === index + 1
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                            } transition-colors duration-200`}
                        >
                          {index + 1}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === 1
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                            } transition-colors duration-200`}
                        >
                          1
                        </button>

                        {currentPage > 3 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        {Array.from({ length: totalPages }, (_, index) => {
                          const page = index + 1;
                          if (
                            page > 1 &&
                            page < totalPages &&
                            Math.abs(page - currentPage) <= 1
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === page
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : "bg-gray-800 text-white hover:bg-gray-700"
                                  } transition-colors duration-200`}
                              >
                                {page}
                              </button>
                            );
                          }
                          return null;
                        })}

                        {currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === totalPages
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                            } transition-colors duration-200`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
      )}

      {/* View Modal */}
      {showModal === "view" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Room Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-400 font-medium">Hotel</p>
                <p className="text-lg text-white">{getHotelName(currentRoom.hotel)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-red-400 font-medium">Room Number</p>
                  <p className="text-white">{currentRoom.room_number}</p>
                </div>
                <div>
                  <p className="text-sm text-red-400 font-medium">Room Type</p>
                  <p className="text-white">{currentRoom.room_type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-red-400 font-medium">Price per Day</p>
                  <p className="text-white">₹{currentRoom.room_price_per_day}</p>
                </div>
                <div>
                  <p className="text-sm text-red-400 font-medium">Max Occupancy</p>
                  <p className="text-white">{currentRoom.max_occupancy}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${currentRoom.status === "available" ? "bg-green-500" :
                  currentRoom.status === "booked" ? "bg-red-500" :
                    "bg-yellow-500"
                  }`}>
                  {currentRoom.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Facilities</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRoom.facilities?.map((facility, index) => (
                    <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Images</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRoom.room_images?.map((img, index) => {
                    const imageUrl = getImageUrl(img);
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Room ${index}`}
                          className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setCurrentRoom(prev => ({
                              ...prev,
                              newImages: prev.room_images.map(img => ({ preview: getImageUrl(img) }))
                            }));
                            openImageModal(index);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowModal("delete")}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaTrashAlt /> Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal("update")}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaPen /> Update
                </button>
                <button
                  onClick={() => setShowModal("update-images")}
                  className="bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaImage /> Update Images
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(null)}
                className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showModal === "image-viewer" && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowModal("view")}
              className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-red-500 transition-colors"
            >
              <FaTimes />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 z-30"
              >
                <FaChevronLeft size={24} />
              </button>

              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={currentRoom.newImages[currentImageIndex]?.preview || getImageUrl(currentRoom.room_images[currentImageIndex])}
                  alt={`Room ${currentImageIndex}`}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 z-30"
              >
                <FaChevronRight size={24} />
              </button>
            </div>

            <div className="text-center mt-4 text-white">
              Image {currentImageIndex + 1} of {currentRoom.room_images?.length || currentRoom.newImages?.length}
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showModal === "add" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add New Room</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateRoom(); }}>
              <div className="mb-4">
                <label className="block text-red-400">Hotel</label>
                <select
                  name="hotel"
                  value={currentRoom.hotel || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Room Number</label>
                  <input
                    type="text"
                    name="room_number"
                    value={currentRoom.room_number || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter room number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">Room Type</label>
                  <select
                    name="room_type"
                    value={currentRoom.room_type || ""}
                    onChange={handleInputChange}
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {roomTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Price per Day (₹)</label>
                  <input
                    type="number"
                    name="room_price_per_day"
                    value={currentRoom.room_price_per_day || ""}
                    onChange={handleInputChange}
                    min="0"
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">Max Occupancy</label>
                  <input
                    type="number"
                    name="max_occupancy"
                    value={currentRoom.max_occupancy || ""}
                    onChange={handleInputChange}
                    min="1"
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter max occupancy"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Status</label>
                <select
                  name="status"
                  value={currentRoom.status || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Facilities</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentRoom.currentFacility || ""}
                    onChange={(e) => setCurrentRoom(prev => ({ ...prev, currentFacility: e.target.value }))}
                    className="flex-1 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Add facility"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="bg-green-600 text-white px-3 rounded hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRoom.facilities?.map((facility, index) => (
                    <div key={index} className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(index)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  accept="image/*"
                  required
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRoom.newImages?.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.preview}
                        alt={`Room preview ${index}`}
                        className="h-16 w-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImageModal(index)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowModal(null)}
                  className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal (without images) */}
      {showModal === "update" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Update Room</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateRoom(); }}>
              <div className="mb-4">
                <label className="block text-red-400">Hotel</label>
                <select
                  name="hotel"
                  value={currentRoom.hotel || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Room Number</label>
                  <input
                    type="text"
                    name="room_number"
                    value={currentRoom.room_number || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter room number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">Room Type</label>
                  <select
                    name="room_type"
                    value={currentRoom.room_type || ""}
                    onChange={handleInputChange}
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {roomTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Price per Day (₹)</label>
                  <input
                    type="number"
                    name="room_price_per_day"
                    value={currentRoom.room_price_per_day || ""}
                    onChange={handleInputChange}
                    min="0"
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">Max Occupancy</label>
                  <input
                    type="number"
                    name="max_occupancy"
                    value={currentRoom.max_occupancy || ""}
                    onChange={handleInputChange}
                    min="1"
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter max occupancy"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Status</label>
                <select
                  name="status"
                  value={currentRoom.status || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Facilities</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentRoom.currentFacility || ""}
                    onChange={(e) => setCurrentRoom(prev => ({ ...prev, currentFacility: e.target.value }))}
                    className="flex-1 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Add facility"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="bg-green-600 text-white px-3 rounded hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRoom.facilities?.map((facility, index) => (
                    <div key={index} className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(index)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowModal("view")}
                  className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Images Modal */}
      {showModal === "update-images" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Update Room Images</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateRoom(); }}>
              <div className="mb-4">
                <label className="block text-red-400">Add New Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  accept="image/*"
                />
                <p className="text-sm text-gray-400">Select new images to add</p>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Current Images (Click × to remove)</label>
                {currentRoom.room_images?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentRoom.room_images?.map((img, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={getImageUrl(img)}
                          alt={`Room ${index}`}
                          className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setCurrentRoom(prev => ({
                              ...prev,
                              newImages: prev.room_images.map(img => ({ preview: getImageUrl(img) }))
                            }));
                            openImageModal(index);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">No existing images</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-red-400">New Images to Upload</label>
                {currentRoom.newImages?.filter(img => img.file).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentRoom.newImages
                      ?.filter(img => img.file)
                      ?.map((img, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={img.preview}
                            alt={`New upload ${index}`}
                            className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(
                              (currentRoom.room_images?.length || 0) + index
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">No new images selected</p>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal("view")}
                  className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                >
                  Update Images
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showModal === "delete" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600">
            <h2 className="text-2xl font-semibold mb-4 text-white">Delete Room</h2>
            <p className="text-lg text-gray-300 mb-4">Are you sure you want to delete this room?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal("view")}
                className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelRoomManagement;