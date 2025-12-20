import { useEffect, useRef } from "react";

interface Props {
  enabled: boolean;
  title: string;
  content: string;
  initialTitle?: string;
  initialContent?: string;
  isSaving: boolean;
  onSave: () => void;
  delay?: number;
}

export function useAutoSave({
  enabled,
  title,
  content,
  initialTitle,
  initialContent,
  isSaving,
  onSave,
  delay = 3000,
}: Props) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || isSaving) return;

    const hasChanged = title !== initialTitle || content !== initialContent;

    if (!hasChanged) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isSaving) {
        onSave();
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, isSaving]);
}
