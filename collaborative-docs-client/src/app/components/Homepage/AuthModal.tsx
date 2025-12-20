"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeAuthModal, openAuthModal } from "@/store/slices/modalSlice";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(type === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 Sync Redux → local UI state
  useEffect(() => {
    setIsLogin(type === "login");
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with real auth logic / RTK Query
    setTimeout(() => {
      setLoading(false);
      dispatch(closeAuthModal());
    }, 1500);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    console.log(`Login with ${provider}`);
  };

  const toggleAuthType = () => {
    dispatch(openAuthModal(isLogin ? "signup" : "login"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeAuthModal())}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-black p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                {/* Close */}
                <button
                  onClick={() => dispatch(closeAuthModal())}
                  className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <FaTimes className="w-5 h-5 text-gray-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 mb-4">
                    <FaLock className="w-8 h-8 text-black" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-gray-400">
                    {isLogin
                      ? "Sign in to your account"
                      : "Start your free trial"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Enter username"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold disabled:opacity-50"
                  >
                    {loading
                      ? isLogin
                        ? "Signing in..."
                        : "Creating account..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </button>
                </form>

                {/* Social */}
                <div className="grid grid-cols-2 gap-3 my-6">
                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <FaGoogle className="inline mr-2" />
                    Google
                  </button>
                  <button
                    onClick={() => handleSocialLogin("github")}
                    className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <FaGithub className="inline mr-2" />
                    GitHub
                  </button>
                </div>

                {/* Toggle */}
                <div className="text-center text-sm text-gray-400">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={toggleAuthType}
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
