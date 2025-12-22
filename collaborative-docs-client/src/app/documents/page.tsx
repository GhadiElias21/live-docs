"use client";

import { useMemo, useState } from "react";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
} from "@/store/api/documentApi";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/Documents/EmptyState";
import DocumentsGrid from "../components/Documents/DocumentsGrid";
import StatsFooter from "../components/Documents/StatsFooter";
import FullScreenLoader from "../components/FullScreenLoader";
import { useGetMeQuery } from "@/store/api/authApi";
import ShareUsersButton from "../components/User/ShareUsersButton";

export default function DocumentsPage() {
  const { data: auth, isLoading: authLoading } = useGetMeQuery();

  const {
    data: documents = [],
    isLoading: docsLoading,
    isError,
  } = useGetDocumentsQuery();

  const [createDocument, { isLoading: isCreating }] =
    useCreateDocumentMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const userId = auth?.user?._id;

  const filtered = useMemo(() => {
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);
  const myDocuments = useMemo(() => {
    if (!userId) return [];
    return filtered.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId === userId;
    });
  }, [filtered, userId]);

  const sharedDocuments = useMemo(() => {
    if (!userId) return [];
    return filtered.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId !== userId;
    });
  }, [filtered, userId]);

  if (authLoading || docsLoading) return <FullScreenLoader />;
  if (isError) return <ErrorState message="Error loading documents" />;
  if (!userId) return <ErrorState message="Not authenticated" />;

  const handleCreateDocument = async () => {
    await createDocument({
      title: "New Document",
      content: "Start typing here...",
    }).unwrap();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 md:p-6 space-y-10">
      <ShareUsersButton />
      <section>
        <h2 className="text-xl font-semibold mb-4">My Documents</h2>

        {myDocuments.length ? (
          <>
            <DocumentsGrid
              documents={myDocuments}
              isCreating={isCreating}
              currentUserId={userId}
              onCreate={handleCreateDocument}
            />
            <StatsFooter total={documents.length} shown={myDocuments.length} />
          </>
        ) : (
          <EmptyState noDocuments />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Shared With Me</h2>

        {sharedDocuments.length ? (
          <DocumentsGrid documents={sharedDocuments} currentUserId={userId} />
        ) : (
          <p className="text-gray-400 text-sm">
            No documents shared with you yet.
          </p>
        )}
      </section>
    </div>
  );
}
