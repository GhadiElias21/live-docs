"use client";

import { useLayoutEffect, useState, useRef } from "react";
import getCaretCoordinates from "textarea-caret";
import { LiveCursor } from "@/app/utils/hooks/useDocumentSocket";

interface Props {
  textareaEl: HTMLTextAreaElement | null;
  cursors: Record<string, LiveCursor>;
}

interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  color: string;
  username: string;
}

export default function LiveCursors({ textareaEl, cursors }: Props) {
  const [positions, setPositions] = useState<CursorPosition[]>([]);
  const rAF = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!textareaEl) return;

    const updateCursors = () => {
      const next: CursorPosition[] = [];

      const { scrollTop, scrollLeft } = textareaEl;

      Object.values(cursors).forEach((cursor) => {
        const { top, left } = getCaretCoordinates(textareaEl, cursor.position);

        next.push({
          userId: cursor.userId,
          x: Math.max(0, left - scrollLeft),
          y: Math.max(0, top - scrollTop),
          color: cursor.color,
          username: cursor.username,
        });
      });

      setPositions(next);
    };

    if (rAF.current) cancelAnimationFrame(rAF.current);

    rAF.current = requestAnimationFrame(updateCursors);

    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [textareaEl, cursors]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {positions.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute top-0 left-0 transition-transform duration-100 ease-out will-change-transform z-50"
          style={{
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
          }}
        >
          <div
            style={{ backgroundColor: cursor.color }}
            className="w-[2px] h-5 shadow-sm"
          />

          <div
            style={{ backgroundColor: cursor.color }}
            className="absolute -top-7 left-[-2px] px-1.5 py-0.5 rounded-sm rounded-bl-none shadow-md"
          >
            <p className="text-[10px] font-bold text-white whitespace-nowrap leading-none select-none">
              {cursor.username}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
