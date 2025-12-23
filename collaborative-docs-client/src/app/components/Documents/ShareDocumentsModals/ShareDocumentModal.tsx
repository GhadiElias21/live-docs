"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaCheck,
  FaFileAlt,
  FaUserShield,
} from "react-icons/fa";

import {
  useGetDocumentsQuery,
  useShareDocumentMutation,
  useUpdateDocumentAccessMutation,
  useRemoveDocumentAccessMutation,
} from "@/store/api/documentApi";

import { useGetMeQuery } from "@/store/api/authApi";
import {
  backdrop,
  modal,
} from "@/app/utils/animations/ShareDocumentsModals/ShareDocumentsModals";
import { toastPromise } from "@/app/utils/toast";

type Role = "viewer" | "editor";

interface Props {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  onClose: () => void;
}

export default function ShareDocumentModal({ user, onClose }: Props) {
  const { data: auth } = useGetMeQuery();
  const { data: documents = [] } = useGetDocumentsQuery();

  const [shareDocument, { isLoading: isSharing }] = useShareDocumentMutation();
  const [updateAccess, { isLoading: isUpdating }] =
    useUpdateDocumentAccessMutation();
  const [removeAccess, { isLoading: isRemoving }] =
    useRemoveDocumentAccessMutation();

  const [documentId, setDocumentId] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const currentUserId = auth?.user?._id;

  const myDocuments = useMemo(() => {
    if (!currentUserId) return [];
    return documents.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId === currentUserId;
    });
  }, [documents, currentUserId]);

  const selectedDoc = myDocuments.find((d) => d._id === documentId);

  const existingShare = useMemo(() => {
    if (!documentId) return null;
    const doc = documents.find((d) => d._id === documentId);
    if (!doc?.sharedWith) return null;

    return doc.sharedWith.find(
      (entry) =>
        (typeof entry.user === "string" ? entry.user : entry.user._id) ===
        user._id
    );
  }, [documentId, documents, user._id]);

  const isLoading = isSharing || isUpdating || isRemoving;

  const handleSubmit = async () => {
    if (!documentId) return;

    let promise;
    const isNewShare = !existingShare;

    if (!existingShare) {
      promise = shareDocument({
        documentId,
        userId: user._id,
        role,
      }).unwrap();
    } else if (existingShare.role !== role) {
      promise = updateAccess({
        documentId,
        userId: user._id,
        role,
      }).unwrap();
    } else {
      onClose();
      return;
    }
    try {
      await toastPromise(promise, {
        loading: isNewShare ? "Sharing document..." : "Updating access...",
        success: isNewShare
          ? "Document shared successfully"
          : "Access updated successfully",
        error: (err) => err?.data?.message || "Something went wrong",
      });
      onClose();
    } catch (err) {}
  };

  const handleRemove = async () => {
    if (!documentId || !existingShare) return;
    const promise = removeAccess({
      documentId,
      userId: user._id,
    }).unwrap();
    try {
      await toastPromise(promise, {
        loading: "Removing access...",
        success: "Access removed successfully",
        error: (err) => err?.data?.message || "Something went wrong",
      });
      onClose();
    } catch {}
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl p-8 bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Share Document</h2>
              <p className="text-sm text-zinc-500">
                Sharing with{" "}
                <span className="text-emerald-400 font-medium">
                  {user.username}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">
                Select Document
              </label>
              <button
                onClick={() => setIsDocOpen(!isDocOpen)}
                className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-zinc-200 hover:border-emerald-500/50 transition-all shadow-inner"
              >
                <div className="flex items-center gap-3">
                  <FaFileAlt
                    className={
                      documentId ? "text-emerald-500" : "text-zinc-600"
                    }
                  />
                  <span
                    className={documentId ? "text-zinc-100" : "text-zinc-500"}
                  >
                    {selectedDoc?.title || "Choose a document..."}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-xs text-zinc-500 transition-transform ${
                    isDocOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isDocOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-48 overflow-y-auto"
                  >
                    {myDocuments.map((doc) => (
                      <button
                        key={doc._id}
                        onClick={() => {
                          setDocumentId(doc._id);
                          setIsDocOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-emerald-500/10 text-left transition-colors group"
                      >
                        <span className="text-sm text-zinc-300 group-hover:text-emerald-400">
                          {doc.title}
                        </span>
                        {documentId === doc._id && (
                          <FaCheck className="text-emerald-500 text-xs" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">
                Access Role
              </label>
              <button
                disabled={!documentId}
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FaUserShield className="text-emerald-500" />
                  <span className="capitalize">{role}</span>
                </div>
                <FaChevronDown
                  className={`text-xs text-zinc-500 transition-transform ${
                    isRoleOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isRoleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-10 overflow-hidden"
                  >
                    {[
                      {
                        id: "viewer",
                        label: "Viewer",
                        desc: "Can only read the document",
                      },
                      {
                        id: "editor",
                        label: "Editor",
                        desc: "Full editing privileges",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setRole(opt.id as Role);
                          setIsRoleOpen(false);
                        }}
                        className="w-full flex flex-col p-4 hover:bg-emerald-500/10 text-left transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400">
                            {opt.label}
                          </span>
                          {role === opt.id && (
                            <FaCheck className="text-emerald-500 text-xs" />
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {existingShare && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs">
              <FaCheck size={10} />
              <span>
                User already has <strong>{existingShare.role}</strong> access
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            {existingShare && (
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className="flex-1 px-4 py-4 rounded-2xl text-xs font-bold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition disabled:opacity-40"
              >
                Remove Access
              </button>
            )}

            <motion.button
              whileHover={!(!documentId || isLoading) ? { scale: 1.02 } : {}}
              whileTap={!(!documentId || isLoading) ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={!documentId || isLoading}
              className="flex-[2] py-4 rounded-2xl text-sm font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shadow-lg shadow-emerald-500/10"
            >
              {isLoading
                ? "Processing..."
                : !existingShare
                ? "Send Invitation"
                : existingShare.role !== role
                ? "Update Access"
                : "Keep Access"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
