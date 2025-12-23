"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFileAlt, FaRegClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Document } from "@/app/utils/types/Documents";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
}

export default function SearchModal({
  isOpen,
  onClose,
  documents,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results =
    query.length < 2
      ? []
      : documents
          .filter((doc) =>
            doc.title.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5); // Limit to top 5 results

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 border-b border-zinc-800">
              <FaSearch className="text-zinc-500 mr-3" />
              <input
                autoFocus
                placeholder="Search documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-4 text-zinc-100 outline-none placeholder:text-zinc-600"
              />
              <kbd className="hidden md:block px-2 py-1 bg-zinc-800 text-zinc-500 rounded text-xs font-sans">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {results.length > 0 ? (
                results.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => {
                      router.push(`/documents/${doc._id}`);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 text-zinc-400 transition-all group"
                  >
                    <FaFileAlt className="group-hover:text-emerald-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-100">
                        {doc.title}
                      </p>
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {doc.content}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-10 text-center text-zinc-600">
                  {query.length < 2
                    ? "Type at least 2 characters..."
                    : "No documents found."}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
