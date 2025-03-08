import React from "react";

const cars = [
  {
    name: "Maserati",
    description: "Experience the luxury and power of Maserati.",
    image: "https://www.hdcarwallpapers.com/walls/maserati_granturismo_2018-HD.jpg",
  },
  {
    name: "Mustang",
    description: "Feel the adrenaline rush with the Mustang.",
    image: "https://media.ed.edmunds-media.com/ford/mustang/2024/oem/2024_ford_mustang_coupe_dark-horse_fq_oem_1_1280.jpg",
  },
  {
    name: "Porsche",
    description: "Unmatched performance and elegance with Porsche.",
    image: "https://porsche-mania.com/wp-content/uploads/2011/02/2010-Porsche_911-997_GT3_RS.jpg",
  },
];

const services = [
  {
    title: "Courier",
    description: "Uber makes same-day item delivery easier than ever.",
    image: "https://cdn0.iconfinder.com/data/icons/ecommerce-flat-17/64/delivery_shipping_shipment_transport_courier_delivery_truck-512.png",
  },
  {
    title: "Reserve",
    description: "Reserve your ride in advance so you can relax on the day of your trip.",
    image: "https://clipground.com/images/reserved-png.png",
  },
  {
    title: "Ride",
    description: "Go anywhere with Uber. Request a ride, hop in, and go.",
    image: "https://cdn3.iconfinder.com/data/icons/transport-types/50/10-512.png",
  },
];

const CarRentalUI = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Most Popular Cars Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-red-500 mb-8"> Most Popular Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div
              key={index}
              className="bg-gray-600 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <img src={car.image} alt={car.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{car.name}</h3>
                <p className="text-gray-600">{car.description}</p>
                <div className="mt-4 flex justify-end">
                  <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:from-red-800 hover:to-red transition-all">
                    Book Now 
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div>
        <h2 className="text-4xl font-bold text-red-500 mb-8"> Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-400 rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img src={service.image} alt={service.title} className="w-16 h-16 object-contain mr-4" />
                <h3 className="text-2xl font-semibold text-gray-900">{service.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button className="text-red border-2 px-5 py-2 rounded-lg hover:bg-red-500 hover:border-red-500 transition-all">
                Learn More 
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarRentalUI;
