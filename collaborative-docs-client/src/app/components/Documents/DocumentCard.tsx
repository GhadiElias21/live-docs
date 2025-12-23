"use client";

import { motion } from "framer-motion";
import { FaCrown, FaTrash, FaTimes } from "react-icons/fa";
import { DocumentCardProps } from "@/app/utils/types/Documents";
import { useState } from "react";
import { useDeleteDocumentMutation } from "@/store/api/documentApi";
import { toastPromise } from "@/app/utils/toast";
import { useRouter } from "next/navigation";

export default function DocumentCard({
  _id,
  title,
  content,
  updatedAt,
  owner,
  searchQuery,
  currentUserId,
  onDeleted,
}: DocumentCardProps & {
  onDeleted?: (_id: string) => void;
  searchQuery?: string;
}) {
  const [deleteDocument] = useDeleteDocumentMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const ownerId = typeof owner === "string" ? owner : owner?._id;
  const ownerUsername = typeof owner === "string" ? null : owner?.username;
  const isShared = ownerId !== currentUserId;

  // --- REFINED SEARCH LOGIC ---
  // 1. Only activate highlighting if user types 3 or more characters
  const isSearchActive = searchQuery && searchQuery.length >= 3;

  // 2. Check if this specific card matches the query
  const isMatch =
    isSearchActive &&
    (title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content?.toLowerCase().includes(searchQuery.toLowerCase()));

  // 3. Dim the card if we are searching but this card ISN'T a match
  const isDimmed = isSearchActive && !isMatch;

  const handleCardClick = () => {
    router.push(`/documents/${_id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await toastPromise(deleteDocument(_id).unwrap(), {
        loading: "Deleting document...",
        success: "Document deleted successfully",
        error: (err) => err?.data?.message || "Failed to delete document",
      });
      onDeleted?.(_id);
    } catch (error) {}
    setIsDeleting(false);
  };

  return (
    <motion.div
      layout
      onClick={handleCardClick}
      whileHover={{ scale: isDimmed ? 1 : 1.02, y: isDimmed ? 0 : -5 }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isDimmed ? 0.35 : 1,
        filter: isDimmed
          ? "grayscale(60%) blur(0.4px)"
          : "grayscale(0%) blur(0px)",
        scale: isDimmed ? 0.98 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`group relative p-5 rounded-2xl cursor-pointer h-full flex flex-col border backdrop-blur-sm transition-colors duration-300 ${
        isMatch
          ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30"
          : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-emerald-500/30"
      }`}
    >
      {/* Search Match Pulse Indicator */}
      {isMatch && (
        <div className="absolute top-4 right-4 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between z-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isMatch ? "bg-emerald-500/20" : "bg-emerald-500/10"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              isMatch ? "text-emerald-300" : "text-emerald-400"
            }`}
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

        <div className="flex gap-2">
          {isShared && ownerUsername && (
            <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-1 rounded-full">
              <FaCrown className="text-amber-400" />
              {ownerUsername}
            </div>
          )}

          {!isShared && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex cursor-pointer items-center justify-center w-8 h-8 text-zinc-500 hover:text-red-400 rounded-lg transition-all z-20 hover:bg-red-500/10"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 z-10">
        <h3
          className={`text-lg font-semibold mb-2 transition-colors ${
            isMatch
              ? "text-emerald-300"
              : "text-white group-hover:text-emerald-300"
          }`}
        >
          <HighlightedText
            text={title || "Untitled Document"}
            highlight={isSearchActive ? searchQuery : ""}
          />
        </h3>

        <p
          className={`text-sm line-clamp-3 mb-4 transition-colors ${
            isMatch ? "text-zinc-100" : "text-gray-400"
          }`}
        >
          <HighlightedText
            text={content || "No content yet..."}
            highlight={isSearchActive ? searchQuery : ""}
          />
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isMatch
                ? "bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-pulse"
                : "bg-emerald-500/40"
            }`}
          />
          <span className="text-xs text-gray-500">Recently edited</span>
        </div>
        <div className="text-xs text-gray-500">
          {updatedAt ? new Date(updatedAt).toLocaleDateString() : "Today"}
        </div>
      </div>
    </motion.div>
  );
}

function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) return <>{text}</>;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span
            key={i}
            className="text-emerald-400 bg-emerald-400/10 rounded-sm px-0.5"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
