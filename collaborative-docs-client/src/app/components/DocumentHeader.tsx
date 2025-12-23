"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DocumentHeaderProps } from "../utils/types/Documents";
import CollaboratorsList from "./User/CollaboratorsList";

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
}: DocumentHeaderProps) {
  return (
    <header className="bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800 p-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {backLink && (
            <Link href={backLink}>
              <motion.button
                whileHover={{ x: -2 }}
                className="p-2 text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="hidden md:inline">{backLabel || "Back"}</span>
                <span className="md:hidden">←</span>
              </motion.button>
            </Link>
          )}

          {title !== undefined && setTitle && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Document"
              className="w-full text-lg md:text-xl font-bold bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-700 truncate"
            />
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          {owner && (
            <CollaboratorsList
              owner={owner}
              sharedWith={sharedWith}
              loggedInUser={loggedInUser}
            />
          )}

          <div className="flex items-center gap-3">
            {lastSaved && !isSaving && (
              <span className="hidden lg:block text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Saved {lastSaved}
              </span>
            )}

            {onSave && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSave}
                disabled={isSaving}
                className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-semibold transition-all ${
                  isSaving
                    ? "bg-emerald-500/20 text-emerald-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Saving</span>
                  </div>
                ) : (
                  "Save"
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
