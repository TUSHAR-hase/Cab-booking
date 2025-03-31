import React from "react";
import TiltedCard from "./TiltedCard/TiltedCard";
import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import { useNavigate } from "react-router-dom";

const cars = [
  {
    name: "Maserati",
    description: "Experience the luxury and power of Maserati...",
    image:
      "https://www.hdcarwallpapers.com/walls/maserati_granturismo_2018-HD.jpg",
  },
  {
    name: "Porsche",
    description: "Unmatched performance and elegance with Porsche...",
    image:
      "https://porsche-mania.com/wp-content/uploads/2011/02/2010-Porsche_911-997_GT3_RS.jpg",
  },
  {
    name: "Mustang",
    description: "Feel the adrenaline rush with the Mustang...",
    image:
      "https://media.ed.edmunds-media.com/ford/mustang/2024/oem/2024_ford_mustang_coupe_dark-horse_fq_oem_1_1280.jpg",
  },
  {
    name: "Lamborghini",
    description: "Power and prestige of Lamborghini...",
    image:
      "https://images.pexels.com/photos/1577131/pexels-photo-1577131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const services = [
  {
    title: "Parcel",
    description: "Uber makes same-day item delivery easier than ever.",
    image:
      "https://cdn0.iconfinder.com/data/icons/ecommerce-flat-17/64/delivery_shipping_shipment_transport_courier_delivery_truck-512.png",
  },
  {
    title: "Reserve",
    description:
      "Reserve your ride in advance so you can relax on the day of your trip.",
    image: "https://clipground.com/images/reserved-png.png",
  },
  {
    title: "Ride",
    description: "Go anywhere with Uber. Request a ride, hop in, and go.",
    image:
      "https://cdn3.iconfinder.com/data/icons/transport-types/50/10-512.png",
  },
];

const CarRentalUI = () => {
  const navigate = useNavigate();

  const handleLearnMore = (title) => {
    if (title === "Parcel") navigate("/services/parcel");
    else if (title === "Reserve") navigate("/services/reserve");
    else if (title === "Ride") navigate("/booking/confirmbooking");
    else navigate("/booking/cab"); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Most Popular Cars Section */}
      <div className="mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-8 text-center">
          Most Popular Cars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {cars.map((car, index) => (
            <TiltedCard
              key={index}
              className="flex flex-col bg-white shadow-lg rounded-xl p-4"
              imageSrc={car.image}
              altText={car.name}
              containerHeight="350px"
              imageHeight="250px"
              imageWidth="100%"
              scaleOnHover={1.1}
              rotateAmplitude={14}
            />
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
            Our Services
          </span>
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <SpotlightCard key={index}>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="mb-4 p-4 bg-red-50 rounded-full">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-16 h-16 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>
                <button
                  onClick={() => handleLearnMore(service.title)}
                  className="w-full py-3 px-6 text-white font-semibold rounded-lg hover:bg-red-500  
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 
                  focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <span>Learn More</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarRentalUI;
