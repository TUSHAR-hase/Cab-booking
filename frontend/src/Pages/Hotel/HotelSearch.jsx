import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiFilter } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';

const HotelSearchPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    area: '',
    district: '',
    pincode: ''
  });

  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [showFilters, setShowFilters] = useState(true); // Filters shown by default
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear',
    arrows: false,
    adaptiveHeight: true,
    dotClass: "slick-dots !bottom-2",
    customPaging: () => (
      <div className="w-2 h-2 bg-gray-500 rounded-full mx-1 transition-all duration-300 hover:bg-red-500" />
    )
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: '#0f172a',
      color: '#fecaca',
      confirmButtonColor: '#ef4444',
      backdrop: 'rgba(0, 0, 0, 0.8)'
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (!filters.name && !filters.area && !filters.district && !filters.pincode) {
        throw new Error("Please provide at least one search parameter")
      }
      if (filters.name) params.append('name', filters.name);
      if (filters.area) params.append('area', filters.area);
      if (filters.district) params.append('district', filters.district);
      if (filters.pincode) params.append('pincode', filters.pincode);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/search?${params.toString()}`);

      if (!response.ok) {
        console.log(response);

        throw new Error(response.message || 'Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data.data);

      const loadingStates = {};
      data.data.forEach(hotel => {
        if (hotel.hotelImages) {
          hotel.hotelImages.forEach((_, index) => {
            loadingStates[`${hotel._id}-${index}`] = true;
          });
        }
      });
      setImageLoading(loadingStates);
    } catch (err) {
      showErrorAlert(err.message || 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/booking/hotel/${hotelId}`);
  };

  const getImageUrl = (imagePath) => {
    const cleanedPath = imagePath.replace(/^public[\\/]/, '');
    return `${import.meta.env.VITE_API_URL}/${cleanedPath.replace(/\\/g, '/')}`;
  };

  const handleImageLoad = (hotelId, index) => {
    setImageLoading(prev => ({
      ...prev,
      [`${hotelId}-${index}`]: false
    }));
  };

  const handleImageError = (hotelId, index) => {
    setImageLoading(prev => ({
      ...prev,
      [`${hotelId}-${index}`]: false
    }));
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      area: '',
      district: '',
      pincode: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4">Discover Your Perfect Stay</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find luxury hotels, budget stays, and everything in between with our curated selection
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-12 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-400">Search Hotels</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiFilter className="text-red-400" />
              <span className="text-gray-300">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <div className={`grid grid-cols-1 gap-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['name', 'area', 'district', 'pincode'].map(field => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={filters[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field}`}
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-red-500 px-4 py-2.5 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FiSearch />
                      Search Hotels
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Search Button (shown when filters are hidden) */}
            <div className={`${!showFilters ? 'block' : 'hidden'}`}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiSearch />
                {isLoading ? 'Searching...' : 'Search with Current Filters'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-400">
                {hotels.length} {hotels.length === 1 ? 'Hotel' : 'Hotels'} Found
              </h2>
              <div className="text-gray-400">
                Sorted by: <span className="text-red-400">Best Match</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div
                  key={hotel._id}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-red-500/20 transition-all duration-300 border border-gray-700 hover:border-red-500/50 group"
                  onClick={() => handleHotelClick(hotel._id)}
                >
                  <div className="h-64 overflow-hidden relative">
                    {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
                      <>
                        <Slider {...sliderSettings} className="h-full">
                          {hotel.hotelImages.map((image, index) => (
                            <div key={index} className="h-64 relative">
                              {imageLoading[`${hotel._id}-${index}`] && (
                                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                                  <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-gray-600 h-12 w-12"></div>
                                  </div>
                                </div>
                              )}
                              <img
                                src={getImageUrl(image)}
                                alt={`${hotel.name} ${index + 1}`}
                                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoading[`${hotel._id}-${index}`] ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={() => handleImageLoad(hotel._id, index)}
                                onError={() => handleImageError(hotel._id, index)}
                              />
                            </div>
                          ))}
                        </Slider>
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2.5 py-1 rounded-full flex items-center">
                          <FiStar className="text-yellow-400 mr-1" />
                          <span>{hotel.averageRating || 'New'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                        <span className="text-red-400">No images available</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors truncate">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
                        <span className="text-gray-100 text-sm font-medium">
                          ₹{hotel.minPrice || '0'} - ₹{hotel.maxPrice || '0'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-400 mb-4">
                      <FiMapPin className="mr-2 text-red-400" />
                      <span className="truncate">
                        {hotel.address?.area}, {hotel.address?.district}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-300 text-sm">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Available Now
                      </div>
                      <button
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotelClick(hotel._id);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No hotels found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search criteria</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HotelSearchPage;