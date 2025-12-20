"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  buttonText?: string;
  buttonHref?: string;
  onClick?: () => void;
  className?: string;
}

export default function ErrorState({
  message = "Something went wrong",
  buttonText,
  buttonHref,
  onClick,
  className = "min-h-screen bg-black",
}: ErrorStateProps) {
  const renderButton = () => {
    if (!buttonText) return null;

    if (buttonHref) {
      return (
        <Link href={buttonHref}>
          <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg">
            {buttonText}
          </button>
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className="px-6 py-3 bg-emerald-500 text-white rounded-lg"
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-red-400 text-xl mb-4">{message}</p>
        {renderButton()}
      </motion.div>
    </div>
  );
}
