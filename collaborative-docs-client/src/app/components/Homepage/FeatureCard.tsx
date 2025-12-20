"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  feature: {
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
  };
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        translateY: -10,
      }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-emerald-500/30 transition-all duration-300 h-full">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
        >
          {feature.icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
        <p className="text-gray-400">{feature.description}</p>
      </div>
    </motion.div>
  );
}
