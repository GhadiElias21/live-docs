"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  noDocuments?: boolean;
}

export default function EmptyState({
  searchQuery,
  onClearSearch,
  noDocuments,
}: EmptyStateProps) {
  if (searchQuery && !noDocuments) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg mb-2">No documents found</p>
        <p className="text-gray-500">
          Try a different search term or{" "}
          <button
            onClick={onClearSearch}
            className="text-emerald-400 hover:text-emerald-300"
          >
            clear search
          </button>
        </p>
      </motion.div>
    );
  }

  if (noDocuments) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-16 h-16 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Your documents will appear here
        </h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Get started by creating your first document. All your notes, ideas,
          and projects will be organized here.
        </p>
      </motion.div>
    );
  }

  return null;
}
