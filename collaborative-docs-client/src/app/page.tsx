"use client";

import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal, closeAuthModal } from "@/store/slices/modalSlice";
import AuthModal from "./components/Homepage/AuthModal";
import HeroSection from "./components/Homepage/HeroSection";
import { RootState } from "@/store/store";

export default function Home() {
  const dispatch = useDispatch();

  const { isAuthModalOpen, authModalType } = useSelector(
    (state: RootState) => state.modal
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg">
              <FaFileAlt className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">
              Nexus<span className="text-emerald-400">Docs</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(openAuthModal("login"))}
              className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Sign In
            </button>

            <button
              onClick={() => dispatch(openAuthModal("signup"))}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-semibold"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      <HeroSection />

      <AuthModal
        isOpen={isAuthModalOpen}
        type={authModalType}
        onClose={() => dispatch(closeAuthModal())}
      />
    </div>
  );
}
