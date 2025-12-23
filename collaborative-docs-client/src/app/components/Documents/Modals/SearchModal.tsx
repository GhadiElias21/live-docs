"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFileAlt } from "react-icons/fa";
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

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results =
    query.length < 2
      ? []
      : documents
          .filter(
            (doc) =>
              doc.title.toLowerCase().includes(query.toLowerCase()) ||
              doc.content.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8);

  const highlightText = (text: string, target: string) => {
    if (!target.trim()) return text;
    const parts = text.split(new RegExp(`(${target})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === target.toLowerCase() ? (
            <span
              key={i}
              className="text-emerald-400 font-semibold bg-emerald-400/10 px-0.5 rounded"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose} // Use unified handler
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[95%] max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="flex items-center px-5 border-b border-zinc-800">
              <FaSearch className="text-zinc-500 mr-3 shrink-0" />
              <input
                autoFocus
                placeholder="Search documents by title or content..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-5 text-zinc-100 outline-none placeholder:text-zinc-600 text-lg"
              />
              <div className="flex items-center gap-1">
                <kbd className="hidden md:block px-2 py-1 bg-zinc-800 text-zinc-500 rounded text-xs font-sans border border-zinc-700">
                  ESC
                </kbd>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                    Results
                  </p>
                  {results.map((doc) => (
                    <button
                      key={doc._id}
                      onClick={() => {
                        router.push(`/documents/${doc._id}`);
                        handleClose(); // Use unified handler
                      }}
                      className="w-full cursor-pointer flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group text-left border border-transparent hover:border-zinc-800"
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                        <FaFileAlt className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">
                          {highlightText(doc.title || "Untitled", query)}
                        </p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          {highlightText(doc.content || "", query)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                    <FaSearch className="text-zinc-700 text-xl" />
                  </div>
                  <p className="text-zinc-500 font-medium">
                    {query.length < 2
                      ? "Start typing to search..."
                      : `No results for "${query}"`}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-zinc-800/30 px-5 py-3 border-t border-zinc-800 flex justify-between items-center">
              <p className="text-[10px] text-zinc-500">
                Search matches titles and content
              </p>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="bg-zinc-800 px-1 rounded border border-zinc-700 font-sans">
                    ↵
                  </span>{" "}
                  Select
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
