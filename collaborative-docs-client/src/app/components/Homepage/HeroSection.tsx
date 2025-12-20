"use client";

import { motion } from "framer-motion";
import {
  FaBolt,
  FaPlay,
  FaChevronRight,
  FaCheck,
  FaCode,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/modalSlice";

import FeatureCard from "./FeatureCard";
import { techStack, features } from "@/app/utils/front";

export default function HeroSection() {
  const dispatch = useDispatch();

  return (
    <main className="relative z-10 container mx-auto px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 mb-6">
            <FaBolt className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-emerald-300">
              Real-time Collaborative Editing
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Write, Code,
            </span>
            <br />
            <span className="text-white">Collaborate in Real-time</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            The future of document editing is here. Create, edit, and
            collaborate on documents with your team in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => dispatch(openAuthModal("signup"))}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-lg flex items-center gap-2 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all"
            >
              Start Creating Free
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10">
              <FaPlay className="inline mr-2 text-emerald-400" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div className="mb-20">
          <p className="text-center text-gray-400 mb-8">
            Built with cutting-edge technology
          </p>

          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center"
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  {tech.icon}
                </div>
                <span className={`mt-3 text-sm ${tech.color}`}>
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything you need
            <br />
            for modern collaboration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="relative rounded-3xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 mb-6">
            <FaCode className="w-8 h-8 text-black" />
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your workflow?
          </h2>

          <p className="text-xl text-gray-300 mb-8">
            No credit card required. Start collaborating today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => dispatch(openAuthModal("signup"))}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold"
            >
              Create Your First Document
            </button>

            <button
              onClick={() => dispatch(openAuthModal("login"))}
              className="px-10 py-4 rounded-xl bg-white/5 border border-white/10"
            >
              Already have an account? Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
