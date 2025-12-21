"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  setTitle?: (v: string) => void;
  isSaving?: boolean;
  lastSaved?: string;
  onSave?: () => void;
  backLink?: string;
  backLabel?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export default function Header({
  title,
  setTitle,
  isSaving = false,
  lastSaved,
  onSave,
  backLink,
  backLabel,
  actionLabel,
  actionIcon,
  onAction,
}: HeaderProps) {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
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

          {title !== undefined && setTitle && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full text-2xl font-bold bg-transparent border-none outline-none text-white"
            />
          )}
        </div>

        {/* Right Action */}
        {(onSave || onAction) && (
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

            {onAction && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAction}
                className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-medium flex items-center gap-2"
              >
                {actionIcon}
                {actionLabel}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
