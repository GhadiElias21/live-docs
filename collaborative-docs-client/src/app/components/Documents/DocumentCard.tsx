"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";
import { DocumentCardProps } from "@/app/utils/types/Documents";

export default function DocumentCard({
  _id,
  title,
  content,
  updatedAt,
  owner,
  currentUserId,
}: DocumentCardProps) {
  const ownerId = typeof owner === "string" ? owner : owner?._id;
  const ownerUsername = typeof owner === "string" ? null : owner?.username;

  const isShared = ownerId !== currentUserId;

  return (
    <Link href={`/documents/${_id}`}>
      <motion.div
        layout
        whileHover={{ scale: 1.02, y: -5 }}
        className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-5 rounded-2xl hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer h-full flex flex-col"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-400"
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

          {/* 👑 Owner badge (shared docs only) */}
          {isShared && ownerUsername && (
            <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-1 rounded-full">
              <FaCrown className="text-amber-400" />
              {ownerUsername}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
            {title || "Untitled Document"}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {content || "No content yet. Start writing..."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Recently edited</span>
          </div>

          <div className="text-xs text-gray-500">
            {updatedAt ? new Date(updatedAt).toLocaleDateString() : "Today"}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
