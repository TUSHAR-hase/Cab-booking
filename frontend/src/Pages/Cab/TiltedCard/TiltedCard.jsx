/*
	Installed from https://reactbits.dev/tailwind/
*/
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";


const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};
export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  descriptionText = "This is a sample description of the tilted card.",
  buttonText = "Book",
  containerHeight = "300px",
  containerWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
}) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0, { damping: 20, stiffness: 100 });
  const navigate = useNavigate();

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1); // Show description and button on hover
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    opacity.set(0); // Hide description and button when not hovering
  }

  function HandleBookingPage() {
    navigate("/booking/confirmbooking");
  }
  return (
    <figure
      ref={ref}
      className="relative flex items-center justify-center [perspective:800px]"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      {/* Tilted Image Container */}
      <motion.div
        className="relative [transform-style:preserve-3d] overflow-hidden rounded-lg shadow-lg"
        style={{
          width: "100%",
          height: "100%",
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Image */}
        <motion.img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover will-change-transform"
        />

        {/* Overlay Content (Description & Button) */}
        <motion.div
          className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-4 opacity-0 transition-opacity duration-30"
          style={{ opacity, rotateX, rotateY }}
        >
          <p className="text-sm font-medium">{descriptionText}</p>
          <button onClick={HandleBookingPage} className="mt-3 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-bold cursor-pointer ">
            {buttonText}
          </button>
        </motion.div>
      </motion.div>
    </figure>
  );
}
