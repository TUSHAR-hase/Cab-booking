import React,{useEffect} from 'react';
import { motion } from 'framer-motion';
import { FaPlaneDeparture, FaHotel, FaCarAlt,FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  
  
  const options = [
    { id: 1, name: "Hotels", icon: FaHotel },
    { id: 2, name: "Flights", icon: FaPlaneDeparture },
    { id: 3, name: "Car Rentals", icon: FaCarAlt },
  ];

  const stats = [
    { id: 1, name: "Happy Travelers", value: "100K+" },
    { id: 2, name: "Destinations", value: "500+" },
    { id: 3, name: "Hotels", value: "10K+" },
    { id: 4, name: "Customer Satisfaction", value: "98%" },
  ];

  const places = [
    { id: 1, name: "Bali, Indonesia", image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 2, name: "Paris, France", image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 3, name: "Santorini, Greece", image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 4, name: "Tokyo, Japan", image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] flex items-center justify-center text-center px-6 sm:px-10 bg-black font-[Poppins]">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555057918-9aadd809fb71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-fixed opacity-70"></div>
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90"></div>

  {/* Content Box */}
  <motion.div
    className="relative bg-white/10 backdrop-blur-xl px-8 sm:px-16 py-12 sm:py-20 rounded-3xl shadow-2xl border border-white/15 max-w-[90%] sm:max-w-3xl"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >
    {/* Title */}
    <motion.h1
      className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 drop-shadow-xl leading-tight tracking-wide"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      Discover Your Next Adventure
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      Escape to breathtaking destinations, embrace new cultures, and create unforgettable memories.
    </motion.p>

    {/* Centered Explore Button */}
    <motion.div
      className="mt-8 sm:mt-10 flex justify-center flex-wrap"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.button
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-110 hover:shadow-red-500/50 flex items-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Now <FaArrowRight className="ml-3 text-xl" />
      </motion.button>
    </motion.div>
  </motion.div>
</div>


      {/* Stats Section */}
      <div className="py-16 text-center bg-black text-white font-[Poppins] px-6 sm:px-10">
  <div className="max-w-5xl mx-auto">
    {/* Title */}
    <h2 className="text-4xl sm:text-5xl font-bold mb-10 sm:mb-12 text-red-500 uppercase tracking-wider">
      Our Achievements
    </h2>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          className="relative flex flex-col items-center p-6 rounded-xl shadow-lg border border-red-500 bg-black/30 backdrop-blur-lg transition-transform duration-300 hover:scale-105 md:hover:scale-110 hover:rotate-1 hover:shadow-red-500/50 group"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          {/* Outer Glowing Border Effect */}
          <div className="absolute inset-0 rounded-xl border-2 border-red-500 opacity-30 blur-md group-hover:opacity-70 transition-all duration-300"></div>

          {/* Animated Stat Number */}
          <motion.p
            className="text-5xl sm:text-6xl font-extrabold text-red-500 drop-shadow-lg transition-all duration-300 group-hover:text-white group-hover:scale-110"
            whileHover={{ scale: 1.1, rotate: -2 }}
          >
            {stat.value}
          </motion.p>

          {/* Stat Name */}
          <p className="mt-2 text-base sm:text-lg text-gray-300 uppercase tracking-wide transition-all duration-300 group-hover:text-red-400">
            {stat.name}
          </p>

          {/* Pulsating Glow */}
          <div className="absolute -z-10 h-16 w-16 sm:h-20 sm:w-20 bg-red-500/30 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
        </motion.div>
      ))}
    </div>
  </div>
</div>


      {/* Popular Destinations */}
      <div className="py-20 bg-black font-[Poppins] text-white">
  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-red-500 text-center mb-12 sm:mb-16 tracking-wider uppercase">
    Popular Destinations
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 px-4 sm:px-10">
    {places.map((place) => (
      <motion.div
        key={place.id}
        className="relative overflow-hidden rounded-3xl group shadow-xl transition-all duration-500"
        whileHover={{ scale: window.innerWidth >= 640 ? 1.1 : 1.02, rotate: window.innerWidth >= 640 ? 2 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <img
          className="w-full h-60 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105 sm:group-hover:scale-110 rounded-3xl"
          src={place.image}
          alt={place.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
          <motion.h3
            className="text-xl sm:text-2xl font-bold text-white drop-shadow-md mb-1 sm:mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {place.name}
          </motion.h3>
          <motion.p
            className="text-sm sm:text-md text-gray-300 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Explore the beauty and culture of {place.name}.
          </motion.p>
        </div>
      </motion.div>
    ))}
  </div>
</div>


      {/* Plan Your Trip */}
      <div 
      className="py-20 text-white text-center font-[Poppins] bg-cover bg-center px-4 sm:px-6 md:px-8" 
      
    >
      <div className="bg-black/60 py-16 px-6 sm:px-8 md:px-12 rounded-xl">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-500 mb-12 tracking-wider uppercase">
          Plan Your Trip
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 md:px-10">
          {options.map((option) => (
            <motion.div
              key={option.id}
              className="bg-black/40 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <option.icon className="mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-red-500 mb-4 sm:mb-6 transition-transform duration-500 hover:rotate-12" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-200">{option.name}</h3>
              <p className="mt-2 text-gray-400 text-base sm:text-lg">Find the best {option.name.toLowerCase()} for your trip.</p>
              <a 
                href="#" 
                className="mt-4 sm:mt-6 inline-block bg-red-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg font-medium tracking-wide hover:bg-red-700 transition-colors duration-300"
              >
                Search {option.name}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
