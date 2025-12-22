"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
import { useToast } from "@/app/utils/hooks/useToast";

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
  const { success, error } = useToast();

  const [shareDocument, { isLoading: isSharing }] = useShareDocumentMutation();

  const [updateAccess, { isLoading: isUpdating }] =
    useUpdateDocumentAccessMutation();

  const [removeAccess, { isLoading: isRemoving }] =
    useRemoveDocumentAccessMutation();

  const [documentId, setDocumentId] = useState("");
  const [role, setRole] = useState<Role>("viewer");

  const currentUserId = auth?.user?._id;

  const myDocuments = useMemo(() => {
    if (!currentUserId) return [];
    return documents.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId === currentUserId;
    });
  }, [documents, currentUserId]);

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

    try {
      if (!existingShare) {
        await shareDocument({
          documentId,
          userId: user._id,
          role,
        }).unwrap();
      } else if (existingShare.role !== role) {
        await updateAccess({
          documentId,
          userId: user._id,
          role,
        }).unwrap();
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    if (!documentId || !existingShare) return;
    try {
      await removeAccess({
        documentId,
        userId: user._id,
      }).unwrap();
      success("Operation successful!");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
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
          className="
            w-full max-w-md rounded-2xl p-6
            bg-gradient-to-br from-[#0b0f0e] to-[#050707]
            border border-green-500/20
            shadow-[0_0_40px_rgba(34,197,94,0.15)]
            space-y-5
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">
              Share with <span className="text-green-400">{user.username}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-green-400 transition"
            >
              ✕
            </button>
          </div>

          {/* Document select */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-400">
              Document
            </label>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="
                w-full rounded-md bg-black/40 p-2
                border border-green-500/20
                focus:outline-none focus:ring-2 focus:ring-green-500/40
              "
            >
              <option value="">Select your document</option>
              {myDocuments.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-400">
              Role
            </label>
            <select
              value={role ?? (existingShare ? existingShare.role : "viewer")}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={!documentId}
              className="
                w-full rounded-md bg-black/40 p-2
                border border-green-500/20
                focus:outline-none focus:ring-2 focus:ring-green-500/40
                disabled:opacity-40
              "
            >
              <option value="viewer">Viewer (read only)</option>
              <option value="editor">Editor (can edit)</option>
            </select>
          </div>

          {existingShare && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                text-sm rounded-md p-2
                bg-green-500/10 text-green-400
                border border-green-500/20
              "
            >
              Already shared as{" "}
              <span className="font-semibold capitalize">
                {existingShare.role}
              </span>
            </motion.div>
          )}

          <div className="flex justify-between items-center pt-3">
            {existingShare && (
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className="
                  px-3 py-1.5 rounded-md text-sm
                  text-red-400 border border-red-500/30
                  hover:bg-red-500/10
                  transition disabled:opacity-40
                "
              >
                Remove access
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                onClick={onClose}
                className="
                  px-4 py-1.5 rounded-md text-sm
                  bg-gray-800 hover:bg-gray-700
                  transition
                "
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!documentId || isLoading}
                className="
                  px-4 py-1.5 rounded-md text-sm font-medium
                  bg-green-500 text-black
                  hover:bg-green-400
                  disabled:opacity-40
                  shadow-[0_0_20px_rgba(34,197,94,0.4)]
                "
              >
                {!existingShare
                  ? "Share"
                  : existingShare.role !== role
                  ? "Update"
                  : "Done"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
