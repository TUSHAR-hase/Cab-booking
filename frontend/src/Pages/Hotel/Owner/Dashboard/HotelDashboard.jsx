import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaPen, FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight, FaEye, FaImage, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [currentHotel, setCurrentHotel] = useState({
    _id: null,
    name: "",
    description: "",
    images: [],
    hotelImages: [],
    area: "",
    district: "",
    pincode: "",
    longitude: "",
    latitude: ""
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    return () => {
      currentHotel.images?.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/get-owner-hotels`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch hotels");
      const data = await response.json();
      setHotels(data.data || []);
    } catch (err) {
      setError(err.message);
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHotel(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setCurrentHotel(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setCurrentHotel(prev => {
      const newImages = [...prev.images];
      const removed = newImages.splice(index, 1);
      if (removed[0]?.preview && removed[0]?.file) {
        URL.revokeObjectURL(removed[0].preview);
      }
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveExistingImage = (index) => {
    setCurrentHotel(prev => {
      const newImages = [...prev.hotelImages];
      newImages.splice(index, 1);
      return { ...prev, hotelImages: newImages };
    });
  };

  const handleAddOrUpdateHotel = async () => {
    try {
      const formData = new FormData();

      // Add all fields
      formData.append('name', currentHotel.name);
      formData.append('description', currentHotel.description);
      formData.append('area', currentHotel.area);
      formData.append('district', currentHotel.district);
      formData.append('pincode', currentHotel.pincode);
      formData.append('longitude', currentHotel.longitude);
      formData.append('latitude', currentHotel.latitude);

      if (showModal === "update" || showModal === "update-images") {
        formData.append('id', currentHotel._id);
        currentHotel.hotelImages?.forEach((img, index) => {
          formData.append('existingImages[]', img); // Send URLs of existing images
        });

        // Include new images if any were added
        currentHotel.images?.forEach((img, index) => {
          if (img.file) {
            formData.append('images', img.file); // Send new image files
          }
        });
      }

      // For update-images, send the remaining existing images
      if (showModal === "update-images") {
        currentHotel.hotelImages.forEach((img, index) => {
          formData.append('existingImages[]', img);
        });
      }

      // Add new images for add/update/update-images
      if (showModal === "add" || showModal === "update-images") {
        currentHotel.images.forEach((img, index) => {
          if (img.file) {
            formData.append('images', img.file);
          }
        });
      }

      const endpoint = showModal === "update" ? "update" :
        showModal === "add" ? "create" : "update-images";

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/${endpoint}`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      const result = await response.json();
      fetchHotels();
      setShowModal(null);
      Swal.fire("Success!", `Hotel ${showModal === "add" ? "added" : "updated"} successfully.`, "success");

    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error!", err.message, "error");
    }
  };

  const handleDeleteHotel = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentHotel._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }
      fetchHotels();
      setShowModal(null);
      Swal.fire("Deleted!", "Hotel has been deleted.", "success");
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowModal("image-viewer");
  };

  const navigateImage = (direction) => {
    const totalImages = currentHotel.hotelImages?.length || currentHotel.images?.length || 0;
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = hotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  return (
    <div className="h-full w-full py-8 px-4 md:px-6 font-poppins bg-black text-white">
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-4 md:mb-6 text-center">Hotel Management</h1>
      <p className="text-base md:text-lg text-red-400 mb-6 text-center">Manage and review all hotels effectively.</p>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setCurrentHotel({
              _id: null,
              name: "",
              description: "",
              images: [],
              hotelImages: [],
              area: "",
              district: "",
              pincode: "",
              longitude: "",
              latitude: ""
            });
            setShowModal("add");
          }}
          className="bg-red-600 text-white p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-red-700 shadow-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus size={16} /> <span className="hidden md:inline">Add Hotel</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin border-t-4 border-red-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.length === 0 ? (
            <div className="w-full py-8 md:py-12 text-center bg-black rounded-lg shadow-lg border border-gray-700">
              <div className="mx-auto max-w-2xl p-4 md:p-6">
                <div className="text-5xl md:text-6xl mb-4 text-red-500">🏨</div>
                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">
                  No Hotels Found
                </h2>
                <p className="text-base md:text-lg text-gray-300">
                  Add a new hotel to get started!
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
                <div className="w-2/12 text-left font-semibold text-lg">Name</div>
                <div className="w-3/12 text-left font-semibold text-lg">Location</div>
                <div className="w-3/12 text-left font-semibold text-lg">Coordinates</div>
                <div className="w-2/12 text-left font-semibold text-lg">Description</div>
                <div className="w-1/12 text-left font-semibold text-lg">Actions</div>
              </div>

              {/* Hotel Rows */}
              <div className="hidden md:block">
                {currentHotels.map((hotel) => (
                  <div
                    key={hotel._id}
                    className="flex flex-row items-center justify-between bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 mb-4"
                  >
                    <div className="w-2/12 text-left">
                      <p className="text-lg text-white">{hotel.name}</p>
                    </div>
                    <div className="w-3/12 text-left">
                      <p className="text-gray-300">
                        {hotel.address?.area}, {hotel.address?.district}, {hotel.address?.pincode}
                      </p>
                    </div>
                    <div className="w-3/12 text-left">
                      <p className="text-gray-300">
                        {hotel.address?.latitude && hotel.address?.longitude ?
                          `${parseFloat(hotel.address.latitude).toFixed(4)}, ${parseFloat(hotel.address.longitude).toFixed(4)}` :
                          'Not set'}
                      </p>
                    </div>
                    <div className="w-2/12 text-left">
                      <p className="text-gray-300">{truncateDescription(hotel.description)}</p>
                    </div>
                    <div className="w-1/12 text-left">
                      <button
                        onClick={() => {
                          setCurrentHotel({
                            ...hotel,
                            images: [],
                            hotelImages: hotel.hotelImages || [],
                            area: hotel.address?.area || '',
                            district: hotel.address?.district || '',
                            pincode: hotel.address?.pincode || '',
                            longitude: hotel.address?.longitude || '',
                            latitude: hotel.address?.latitude || ''
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

              {/* Hotel Cards (Mobile) */}
              <div className="md:hidden space-y-4">
                {currentHotels.map((hotel) => (
                  <div
                    key={hotel._id}
                    className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-red-400 font-medium">Name</p>
                        <p className="text-lg text-white">{hotel.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium">Location</p>
                        <p className="text-gray-300">
                          {hotel.address?.area}, {hotel.address?.district}, {hotel.address?.pincode}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium">Coordinates</p>
                        <p className="text-gray-300">
                          {hotel.address?.latitude && hotel.address?.longitude ?
                            `${parseFloat(hotel.address.latitude).toFixed(4)}, ${parseFloat(hotel.address.longitude).toFixed(4)}` :
                            'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium">Description</p>
                        <p className="text-gray-300">{truncateDescription(hotel.description, 30)}</p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setCurrentHotel({
                              ...hotel,
                              images: [],
                              hotelImages: hotel.hotelImages || [],
                              area: hotel.address?.area || '',
                              district: hotel.address?.district || '',
                              pincode: hotel.address?.pincode || '',
                              longitude: hotel.address?.longitude || '',
                              latitude: hotel.address?.latitude || ''
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Hotel Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-400 font-medium">Name</p>
                <p className="text-lg text-white">{currentHotel.name}</p>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Location</p>
                <p className="text-white">{currentHotel.area}, {currentHotel.district}, {currentHotel.pincode}</p>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Coordinates</p>
                <p className="text-white">
                  {currentHotel.latitude && currentHotel.longitude ?
                    `Lat: ${parseFloat(currentHotel.latitude).toFixed(4)}, Lon: ${parseFloat(currentHotel.longitude).toFixed(4)}` :
                    'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Description</p>
                <p className="text-white">{currentHotel.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentHotel.hotelImages?.map((img, index) => {
                  const imageUrl = getImageUrl(img);
                  return (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Hotel ${index}`}
                        className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setCurrentHotel(prev => ({
                            ...prev,
                            images: prev.hotelImages.map(img => ({ preview: getImageUrl(img) }))
                          }));
                          openImageModal(index);
                        }}
                      />
                    </div>
                  );
                })}
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
                  src={currentHotel.images[currentImageIndex]?.preview || getImageUrl(currentHotel.hotelImages[currentImageIndex])}
                  alt={`Hotel ${currentImageIndex}`}
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
              Image {currentImageIndex + 1} of {currentHotel.hotelImages?.length || currentHotel.images?.length}
            </div>
          </div>
        </div>
      )}

      {/* Add Hotel Modal */}
      {showModal === "add" && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add New Hotel</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateHotel(); }}>
              <div className="mb-4">
                <label className="block text-red-400">Hotel Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentHotel.name || ""}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter hotel name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={currentHotel.area || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter area"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">District</label>
                  <input
                    type="text"
                    name="district"
                    value={currentHotel.district || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter district"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={currentHotel.pincode || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter pincode"
                    pattern="\d{6}"
                    title="Pincode must be 6 digits"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={currentHotel.latitude || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter latitude"
                    pattern="^[-+]?(90(\.0+)?|[0-8]?\d(\.\d+)?)$"
                    title="Enter a valid latitude coordinate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={currentHotel.longitude || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter longitude"
                    pattern="^[-+]?(180(\.0+)?|1[0-7]\d(\.\d+)?|[0-9]?\d(\.\d+)?)$"
                    title="Enter a valid longitude coordinate"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Description</label>
                <textarea
                  name="description"
                  value={currentHotel.description || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter hotel description"
                  rows="3"
                  required
                />
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
                  {currentHotel.images?.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.preview}
                        alt={`Hotel preview ${index}`}
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
                  Add Hotel
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Update Hotel</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateHotel(); }}>
              <div className="mb-4">
                <label className="block text-red-400">Hotel Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentHotel.name || ""}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter hotel name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={currentHotel.area || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter area"
                    required
                  />
                </div>
                <div>
                  <label className="block text-red-400">District</label>
                  <input
                    type="text"
                    name="district"
                    value={currentHotel.district || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter district"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={currentHotel.pincode || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter pincode"
                    pattern="\d{6}"
                    title="Pincode must be 6 digits"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-red-400">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={currentHotel.latitude || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter latitude"
                    pattern="^[-+]?(90(\.0+)?|[0-8]?\d(\.\d+)?)$"
                    title="Enter a valid latitude coordinate"
                  />
                </div>
                <div>
                  <label className="block text-red-400">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={currentHotel.longitude || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter longitude"
                    pattern="^[-+]?(180(\.0+)?|1[0-7]\d(\.\d+)?|[0-9]?\d(\.\d+)?)$"
                    title="Enter a valid longitude coordinate"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-red-400">Description</label>
                <textarea
                  name="description"
                  value={currentHotel.description || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 mb-2 p-2 border border-gray-600 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter hotel description"
                  rows="3"
                  required
                />
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Update Hotel Images</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateHotel(); }}>
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
                {currentHotel.hotelImages?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentHotel.hotelImages?.map((img, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={getImageUrl(img)}
                          alt={`Hotel ${index}`}
                          className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setCurrentHotel(prev => ({
                              ...prev,
                              images: prev.hotelImages.map(img => ({ preview: getImageUrl(img) }))
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
                {currentHotel.images?.filter(img => img.file).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentHotel.images
                      ?.filter(img => img.file)
                      ?.map((img, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={img.preview}
                            alt={`New upload ${index}`}
                            className="h-24 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(
                              (currentHotel.hotelImages?.length || 0) + index
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Delete Hotel</h2>
            <p className="text-lg text-gray-300 mb-4">Are you sure you want to delete this hotel?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal("view")}
                className="bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHotel}
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

export default HotelManagement;