import React from "react";
import { motion } from "framer-motion";
function Footer() {
  return (
    <motion.div
      className="bg-pittBlue shadow p-6 fixed bottom-0 w-full flex items-center justify-center flex-grow"
      initial={{ opacity: 0, y: 20 }} // Fade-in effect
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-white font-bold">
        {" "}
        Created By Makayla, Nicky, Buzybee and Ibrahim
      </p>
    </motion.div>
  );
}

export default Footer;
