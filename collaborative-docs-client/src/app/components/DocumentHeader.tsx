"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DocumentHeaderProps } from "../utils/types/Documents";

export default function DocumentHeader({
  title,
  setTitle,
  isSaving = false,
  lastSaved,
  onSave,
  backLink,
  backLabel,
  owner,
  sharedWith = [],
  loggedInUser,
  isOwner,
}: DocumentHeaderProps) {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          {/* Back Button */}
          {backLink && (
            <Link href={backLink}>
              <motion.button
                whileHover={{ x: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg"
              >
                {backLabel || "← Back"}
              </motion.button>
            </Link>
          )}

          {/* Title Input */}
          {title !== undefined && setTitle && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full text-2xl font-bold bg-transparent border-none outline-none text-white"
            />
          )}
        </div>

        {/* Owner & Shared Users */}
        <div className="flex items-center gap-3 mr-4">
          {owner && (
            <span
              className={`px-2 py-1 rounded-lg text-sm font-medium ${
                isOwner ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              Owner: {owner.username}
              {loggedInUser?.email === owner.email && " (You)"}
            </span>
          )}
          {sharedWith.map((s) => (
            <span
              key={s._id}
              className="px-2 py-1 rounded-lg text-sm font-medium bg-gray-600"
            >
              {s.user.username} ({s.role})
            </span>
          ))}
        </div>

        {/* Right Actions */}
        {onSave && (
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="hidden md:block text-sm text-gray-400">
                Saved at {lastSaved}
              </span>
            )}

            {onSave && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSave}
                disabled={isSaving}
                className={`px-5 py-2 rounded-lg font-medium ${
                  isSaving
                    ? "bg-emerald-600/50"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {isSaving ? "Saving..." : "Save"}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
