"use client";

import { useState } from "react";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
} from "@/store/api/documentApi";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/Documents/EmptyState";
import DocumentsGrid from "../components/Documents/DocumentsGrid";
import StatsFooter from "../components/Documents/StatsFooter";
import FloatingSaveButton from "../components/FloatingButton";
import FullScreenLoader from "../components/FullScreenLoader";

export default function DocumentsPage() {
  const { data: documents = [], isLoading, isError } = useGetDocumentsQuery();
  const [createDocument, { isLoading: isCreating }] =
    useCreateDocumentMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDocument = async () => {
    try {
      await createDocument({
        title: "New Document",
        content: "Start typing here...",
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <FullScreenLoader />;
  if (isError) return <ErrorState message="Error loading documents" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-100 p-4 md:p-6">
      {documents.length > 0 ? (
        <>
          <DocumentsGrid
            documents={filteredDocuments}
            isCreating={isCreating}
            onCreate={handleCreateDocument}
          />
          <StatsFooter
            total={documents.length}
            shown={filteredDocuments.length}
          />
        </>
      ) : (
        <EmptyState noDocuments />
      )}

      <FloatingSaveButton
        onClick={handleCreateDocument}
        isLoading={isCreating}
      />
    </div>
  );
}
