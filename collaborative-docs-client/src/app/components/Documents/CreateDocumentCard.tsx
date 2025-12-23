"use client";

import { motion } from "framer-motion";

interface CreateDocumentCardProps {
  isCreating: boolean;
  onCreate: () => void;
}

export default function CreateDocumentCard({
  isCreating,
  onCreate,
}: CreateDocumentCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1.1 }}>
      <button
        onClick={onCreate}
        disabled={isCreating}
        className="w-full h-full min-h-[220px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-dashed border-emerald-500/30 p-6 rounded-2xl hover:border-emerald-500/50 hover:from-gray-800/70 hover:to-gray-900/70 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
            />
            <span className="text-emerald-400">Creating...</span>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <svg
                className="w-7 h-7 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-emerald-400 font-medium text-lg">
              Create New
            </span>
          </>
        )}
      </button>
    </motion.div>
  );
}
