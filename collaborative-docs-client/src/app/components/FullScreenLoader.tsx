"use client";

import { motion } from "framer-motion";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50">
      <motion.div
        className="w-24 h-24 border-4 border-t-emerald-500 border-b-teal-400 border-l-white border-r-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
