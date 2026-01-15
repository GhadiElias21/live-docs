"use client";

import { useState, useCallback } from "react";
import LiveCursors from "./liveCursors";
import { LiveCursor } from "../utils/hooks/useDocumentSocket";

interface Props {
  content: string;
  setContent: (v: string) => void;
  emitCursor: (position: number) => void;
  cursors: Record<string, LiveCursor>;
}

export default function DocumentEditor({
  content,
  setContent,
  emitCursor,
  cursors,
}: Props) {
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement | null>(
    null
  );

  const emitPosition = useCallback(() => {
    if (!textareaEl) return;
    emitCursor(textareaEl.selectionStart);
  }, [emitCursor, textareaEl]);

  return (
    <div className="relative">
      <textarea
        ref={setTextareaEl}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (e.target) emitCursor(e.target.selectionStart);
        }}
        onClick={emitPosition}
        onKeyUp={emitPosition}
        className="w-full min-h-[calc(100vh-200px)] p-8 bg-gray-800/50 border border-gray-700/50 rounded-xl resize-none text-lg text-gray-100 focus:outline-none"
        placeholder="Start writing your masterpiece..."
      />

      <LiveCursors textareaEl={textareaEl} cursors={cursors} />
    </div>
  );
}
