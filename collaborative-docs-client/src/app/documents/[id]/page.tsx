"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useSocket } from "@/socket/SocketProvider";
import { useDocumentSocket } from "@/app/utils/hooks/useDocumentSocket"; // Import the new hook
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} from "@/store/api/documentApi";
import { useAutoSave } from "@/app/utils/hooks/useAutoSave";
import ErrorState from "@/app/components/ErrorState";
import DocumentEditor from "@/app/components/DocumentEditor";
import DocumentHeader from "@/app/components/DocumentHeader";
import DocumentFooter from "@/app/components/DocumentFooter";
import { useGetMeQuery } from "@/store/api/authApi";
import { SharedWithUser } from "@/app/utils/types/Documents";
import FullScreenLoader from "@/app/components/FullScreenLoader";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { socket, isConnected } = useSocket();
  const { data: document, isLoading, isError } = useGetDocumentByIdQuery(id);
  const [updateDocument] = useUpdateDocumentMutation();
  const { data: meData } = useGetMeQuery();
  const loggedInUser = meData?.user;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  const { typingUsers, emitChange, emitCursor, cursors } = useDocumentSocket({
    socket,
    isConnected,
    documentId: id,
    user: loggedInUser,
    onContentUpdate: (newContent) => setContent(newContent),
  });

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    emitChange(newContent);
  };

  const isOwner = useMemo(
    () => document?.owner?.email === loggedInUser?.email,
    [document, loggedInUser]
  );

  const sharedWithUsers = useMemo<SharedWithUser[]>(() => {
    if (!document?.sharedWith) return [];
    return document.sharedWith.map((item) => ({
      _id: item.user._id,
      user: item.user,
      role: item.role,
    }));
  }, [document]);

  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      if (!content) {
        setContent(document.content || "");
      }
    }
  }, [document]);

  const handleSave = async () => {
    if (!document || isSaving) return;
    setIsSaving(true);
    try {
      await updateDocument({
        id: document._id,
        data: { title, content },
      }).unwrap();
      setLastSaved(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  useAutoSave({
    enabled: !!document,
    title,
    content,
    isSaving,
    initialTitle: document?.title,
    initialContent: document?.content,
    onSave: handleSave,
  });

  if (isLoading) return <FullScreenLoader />;
  if (isError || !document) return <ErrorState />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black"
    >
      <DocumentHeader
        title={title}
        setTitle={setTitle}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSave={handleSave}
        backLink="/documents"
        backLabel="← Documents"
        owner={document.owner}
        sharedWith={sharedWithUsers}
        loggedInUser={loggedInUser}
        isOwner={isOwner}
      />
      <main className="max-w-4xl mx-auto p-4 relative">
        <div className="h-6 mb-2 text-sm text-gray-400 italic flex items-center gap-2">
          <AnimatePresence>
            {typingUsers.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {Array.from(typingUsers).join(", ")} is typing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DocumentEditor
          content={content}
          setContent={handleContentChange}
          emitCursor={emitCursor}
          cursors={cursors}
        />

        <DocumentFooter content={content} />
      </main>
    </motion.div>
  );
}
