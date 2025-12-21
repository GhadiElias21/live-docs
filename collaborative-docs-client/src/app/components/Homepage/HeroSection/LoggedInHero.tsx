"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaClock, FaUsers, FaArrowRight } from "react-icons/fa";

interface LoggedInSectionProps {
  username: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LoggedInHero({ username }: LoggedInSectionProps) {
  const router = useRouter();
  return (
    <main className="relative z-10 container mx-auto px-6 py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2  rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 mb-6">
            <FaClock className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-sm text-emerald-300">
              Your workspace is ready
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {username}
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Pick up where you left off or start something new.
          </p>
        </motion.div>

        {/* Primary actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
        >
          <button
            onClick={() => {
              router.push("/documents");
            }}
            className="group px-8 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all"
          >
            Documents
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2">
            <FaUsers className="text-emerald-400" />
            Invite collaborators
          </button>
        </motion.div>

        {/* Dashboard cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Recent documents */}
          <div className="md:col-span-2 rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaFileAlt className="text-emerald-400" />
              Recent documents
            </h3>

            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition"
                >
                  <div>
                    <p className="font-medium">Project Notes #{i + 1}</p>
                    <span className="text-sm text-gray-400">
                      Edited 2 hours ago
                    </span>
                  </div>

                  <FaArrowRight className="text-gray-400" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 to-teal-400/10 border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-6">Workspace stats</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Documents</span>
                <span className="font-semibold">12</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Collaborators</span>
                <span className="font-semibold">5</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Edits this week</span>
                <span className="font-semibold">87</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
