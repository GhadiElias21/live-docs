"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} from "@/store/api/documentApi";
import { useAutoSave } from "@/app/utils/hooks/useAutoSave";
import LoadingState from "@/app/components/LoadingState";
import ErrorState from "@/app/components/ErrorState";
import DocumentEditor from "@/app/components/DocumentEditor";
import DocumentHeader from "@/app/components/DocumentHeader";
import DocumentFooter from "@/app/components/DocumentFooter";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { data: document, isLoading, isError } = useGetDocumentByIdQuery(id);

  const [updateDocument] = useUpdateDocumentMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setContent(document.content || "");
    }
  }, [document]);

  const handleSave = async () => {
    if (!document || isSaving) return; // 👈 HARD GUARD

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

  if (isLoading) return <LoadingState />;
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
      />
      <main className="max-w-4xl mx-auto p-4">
        <DocumentEditor content={content} setContent={setContent} />

        <DocumentFooter content={content} />
      </main>
    </motion.div>
  );
}
