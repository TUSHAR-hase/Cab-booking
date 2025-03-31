import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiStar } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';

const HotelSearchPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    area: '',
    district: '',
    pincode: '',
    minPrice: '',
    maxPrice: ''
  });

  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const navigate = useNavigate();

  // Enhanced slider settings with better autoplay
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
    adaptiveHeight: true
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: '#1a202c',
      color: '#f56565',
      confirmButtonColor: '#e53e3e',
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.area) params.append('area', filters.area);
      if (filters.district) params.append('district', filters.district);
      if (filters.pincode) params.append('pincode', filters.pincode);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data.data);

      // Initialize image loading states
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

  return (
    <div className="min-h-screen bg-black text-red-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Find Your Perfect Hotel</h1>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {['name', 'area', 'district', 'pincode'].map(field => (
                <div key={field} className="space-y-1">
                  <label className="block text-lg font-medium text-red-400 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={filters[field]}
                    onChange={handleInputChange}
                    className="w-full rounded-md bg-gray-800 border-red-500 text-red-400 shadow-sm focus:border-red-700 focus:ring-red-700 px-4 py-2"
                  />
                </div>
              ))}

              {/* {['minPrice', 'maxPrice'].map(price => (
                <div key={price} className="space-y-1">
                  <label className="block text-lg font-medium text-red-400 capitalize">{price.replace('Price', ' Price ($)')}</label>
                  <input
                    type="number"
                    name={price}
                    min="0"
                    value={filters[price]}
                    onChange={handleInputChange}
                    className="w-full rounded-md bg-gray-800 border-red-500 text-red-400 shadow-sm focus:border-red-700 focus:ring-red-700 px-4 py-2"
                  />
                </div>
              ))} */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-black font-bold rounded-md shadow-sm"
            >
              {isLoading ? 'Searching...' : 'Search Hotels'}
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <div
                key={hotel._id}
                className="bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-red-500/50 transition-all duration-300"
                onClick={() => handleHotelClick(hotel._id)}
              >
                <div className="h-48 overflow-hidden relative">
                  {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
                    <>
                      <Slider {...sliderSettings} className="h-full">
                        {hotel.hotelImages.map((image, index) => (
                          <div key={index} className="h-48 relative">
                            {imageLoading[`${hotel._id}-${index}`] && (
                              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <div className="animate-pulse flex space-x-4">
                                  <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                                </div>
                              </div>
                            )}
                            <img
                              src={getImageUrl(image)}
                              alt={`${hotel.name} ${index + 1}`}
                              className={`w-full h-full object-cover ${imageLoading[`${hotel._id}-${index}`] ? 'opacity-0' : 'opacity-100'}`}
                              onLoad={() => handleImageLoad(hotel._id, index)}
                              onError={() => handleImageError(hotel._id, index)}
                            />
                          </div>
                        ))}
                      </Slider>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {hotel.hotelImages.length} photos
                      </div>
                    </>
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <span className="text-red-400">No images available</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-red-500 truncate">{hotel.name}</h3>
                    {/* <div className="flex items-center bg-red-600 px-2 py-1 rounded"> */}
                    {/* <FiStar className="text-yellow-300 mr-1" /> */}
                    {/* <span className="text-black font-bold">{hotel.rating || 'N/A'}</span> */}
                    {/* </div> */}
                  </div>

                  <div className="mt-2 flex items-center text-red-300">
                    <FiMapPin className="mr-1" />
                    <span className="truncate">{hotel.address?.area}, {hotel.address?.district}</span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-red-400">
                      {/* <FiDollarSign className="mr-1" /> */}
                      <span>₹ {hotel.minPrice || 'N/A'} - ₹ {hotel.maxPrice || 'N/A'}</span>
                    </div>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-black text-sm font-bold rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHotelClick(hotel._id);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <div className="text-center text-xl text-red-500 py-12">No hotels found. Try different search criteria.</div>
        )}
      </div>
    </div>
  );
};

export default HotelSearchPage;