import React from "react";
import { motion } from "framer-motion";
function Navbar() {
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-pittBlue shadow-lg p-6 mb-6 flex items-center justify-center rounded-b-2xl"
      initial={{ opacity: 0, y: 20 }} // Fade-in effect
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
    >
      <img
        src="/panther.png"
        alt="Panther Logo"
        className="h-14 w-14 mr-4 rounded-full shadow-md"
      />
      <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wide">
        Pitt Finance Dashboard
      </h1>
    </motion.div>
  );
}

export default Navbar;
