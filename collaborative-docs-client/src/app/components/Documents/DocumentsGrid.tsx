"use client";

import { motion, AnimatePresence } from "framer-motion";
import DocumentCard from "./DocumentCard";
import CreateDocumentCard from "./CreateDocumentCard";
import { DocumentsGridProps } from "@/app/utils/types/Documents";

export default function DocumentsGrid({
  searchQuery,
  documents,
  isCreating,
  onCreate,
  currentUserId,
}: DocumentsGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {onCreate && (
        <CreateDocumentCard isCreating={!!isCreating} onCreate={onCreate} />
      )}

      <AnimatePresence>
        {documents.map((doc) => (
          <motion.div
            key={doc._id}
            layout
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={itemVariants}
          >
            <DocumentCard
              searchQuery={searchQuery}
              {...doc}
              currentUserId={currentUserId}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
