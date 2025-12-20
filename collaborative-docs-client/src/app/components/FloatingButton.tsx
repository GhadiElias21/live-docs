"use client";

import { motion } from "framer-motion";

interface FloatingButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
  label?: string; // optional text
  className?: string; // for custom styles
}

export default function FloatingButton({
  onClick,
  isLoading = false,
  icon,
  label,
  className = "",
}: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={isLoading}
      className={`fixed bottom-6 right-6 w-16 h-16 md:w-14 md:h-14 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center ${className} disabled:opacity-50`}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
        />
      ) : icon ? (
        icon
      ) : label ? (
        <span>{label}</span>
      ) : (
        "+"
      )}
    </motion.button>
  );
}
