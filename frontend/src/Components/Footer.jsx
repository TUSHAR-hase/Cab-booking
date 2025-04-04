import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left"
      >
        {/* Brand & Description */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold text-red-500 tracking-wide">
            BrandLogo
          </h2>
          <p className="text-gray-400 text-md mt-4 leading-relaxed">
            Transforming digital experiences with innovation and precision.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-red-500 mb-6 relative after:block after:w-16 after:h-1 after:bg-red-500 after:mt-2 after:mx-auto md:after:mx-0">
            Quick Links
          </h3>
          <ul className="space-y-4">
            {["Home", "About", "Services", "Projects", "Contact"].map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1, x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/${link.toLowerCase()}`}
                  className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:underline text-lg"
                >
                  {link}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-red-500 mb-6 relative after:block after:w-16 after:h-1 after:bg-red-500 after:mt-2 after:mx-auto md:after:mx-0">
            Contact
          </h3>
          <p className="text-gray-400 flex items-center justify-center md:justify-start space-x-3 text-lg hover:text-red-500 transition-all duration-300">
            <Mail size={20} className="text-red-500" /> <span>support@example.com</span>
          </p>
          <p className="text-gray-400 flex items-center justify-center md:justify-start space-x-3 text-lg mt-3 hover:text-red-500 transition-all duration-300">
            <Phone size={20} className="text-red-500" /> <span>+123 456 7890</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Social Media Icons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center space-x-8 mt-12"
      >
        {[Facebook, Twitter, Linkedin, Github].map((Icon, index) => (
          <motion.a
            key={index}
            href="#"
            className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icon size={32} />
          </motion.a>
        ))}
      </motion.div>



      {/* Copyright */}
      <p className="text-gray-500 text-center text-lg mt-8">
        &copy; {new Date().getFullYear()} BrandLogo. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
