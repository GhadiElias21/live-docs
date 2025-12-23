"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
} from "@/store/api/documentApi";
import ErrorState from "../components/ErrorState";
import DocumentsGrid from "../components/Documents/DocumentsGrid";
import StatsFooter from "../components/Documents/StatsFooter";
import FullScreenLoader from "../components/FullScreenLoader";
import { useGetMeQuery } from "@/store/api/authApi";
import ShareUsersButton from "../components/User/ShareUsersButton";
import { toastPromise } from "../utils/toast";
import { FaPlus, FaSearch, FaFolderOpen, FaShareAlt } from "react-icons/fa";
import SearchModal from "../components/Documents/Modals/SearchModal";
// 1. Import your new SearchModal component

export default function DocumentsPage() {
  const { data: auth, isLoading: authLoading } = useGetMeQuery();
  const {
    data: documents = [],
    isLoading: docsLoading,
    isError,
  } = useGetDocumentsQuery();
  const [createDocument, { isLoading: isCreating }] =
    useCreateDocumentMutation();

  // 2. New state for the Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const userId = auth?.user?._id;

  // 3. KEYBOARD SHORTCUT (⌘K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 4. CLEAN DATA (No more filtering the background cards)
  const myDocuments = useMemo(() => {
    if (!userId) return [];
    return documents.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId === userId;
    });
  }, [documents, userId]);

  const sharedDocuments = useMemo(() => {
    if (!userId) return [];
    return documents.filter((doc) => {
      const ownerId = typeof doc.owner === "string" ? doc.owner : doc.owner._id;
      return ownerId !== userId;
    });
  }, [documents, userId]);

  if (authLoading || docsLoading) return <FullScreenLoader />;
  if (isError) return <ErrorState message="Error loading documents" />;
  if (!userId) return <ErrorState message="Not authenticated" />;

  const handleCreateDocument = async () => {
    const promise = createDocument({
      title: "New Document",
      content: "...",
    }).unwrap();
    try {
      await toastPromise(promise, {
        loading: "Creating...",
        success: "Created!",
        error: (err) => err?.data?.message || "Error",
      });
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 md:p-6 space-y-10">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
      />
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Workspace
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Your personal dashboard</p>
        </div>

        <div className="flex items-center gap-3 flex-col sm:flex-row">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-zinc-500 w-full md:w-64 hover:border-zinc-700 transition-all text-left"
          >
            <FaSearch className="text-zinc-600" />
            <span className="flex-1">Search...</span>
            <kbd className="hidden md:block bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 font-sans">
              ⌘K
            </kbd>
          </button>
          <div>
            {" "}
            <ShareUsersButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FaFolderOpen className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-200">
              My Documents
            </h2>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm">
            <DocumentsGrid
              documents={myDocuments}
              isCreating={isCreating}
              currentUserId={userId}
              onCreate={handleCreateDocument}
              // searchQuery no longer needed here for filtering
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FaShareAlt className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-200">
              Shared With Me
            </h2>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm">
            <DocumentsGrid documents={sharedDocuments} currentUserId={userId} />
          </div>
        </section>
      </main>
    </div>
  );
}
