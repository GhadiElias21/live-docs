"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaUserShield, FaUserEdit } from "react-icons/fa";

interface CollaboratorsListProps {
  owner: { username: string; email: string };
  sharedWith: {
    _id: string;
    user: { username: string; email: string };
    role: string;
  }[];
  loggedInUser?: { email: string };
}

export default function CollaboratorsList({
  owner,
  sharedWith,
  loggedInUser,
}: CollaboratorsListProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-700/50 rounded-full transition-all"
      >
        <div className="flex -space-x-2 ml-1">
          <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {owner.username.charAt(0)}
          </div>
          {sharedWith.slice(0, 2).map((s) => (
            <div
              key={s._id}
              className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase"
            >
              {s.user.username.charAt(0)}
            </div>
          ))}
          {sharedWith.length > 2 && (
            <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
              +{sharedWith.length - 2}
            </div>
          )}
        </div>
        <FaChevronDown
          className={`text-[10px] text-zinc-500 mr-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-zinc-800 bg-white/5">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Who has access
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <div className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {owner.username.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">
                      {owner.username}{" "}
                      {loggedInUser?.email === owner.email && "(You)"}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <FaUserShield /> Owner
                    </p>
                  </div>
                </div>

                {sharedWith.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-t border-zinc-800/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 uppercase">
                      {s.user.username.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {s.user.username}{" "}
                        {loggedInUser?.email === s.user.email && "(You)"}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 uppercase">
                        <FaUserEdit size={10} /> {s.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
