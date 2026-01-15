import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";

export interface LiveCursor {
  userId: string;
  username: string;
  color: string;
  position: number;
}

interface UseDocumentSocketProps {
  socket: Socket | null;
  isConnected: boolean;
  documentId: string;
  user:
    | {
        _id: string;
        username?: string;
        email?: string;
        color?: string;
      }
    | undefined;
  onContentUpdate: (content: string) => void;
}

export const useDocumentSocket = ({
  socket,
  isConnected,
  documentId,
  user,
  onContentUpdate,
}: UseDocumentSocketProps) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [cursors, setCursors] = useState<Record<string, LiveCursor>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !documentId || !user) return;

    socket.emit("join-document", {
      documentId,
      username: user.username || user.email,
    });

    const handleUserJoined = (username: string) => {
      toast.success(`👋 ${username} has joined!`, {
        id: `user-join-${username}`,
      });
    };

    const handleUserTyping = (username: string) => {
      setTypingUsers((prev) => new Set(prev).add(username));
    };

    const handleUserStoppedTyping = (username: string) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(username);
        return next;
      });
    };

    const handleDocumentUpdate = (newContent: string) => {
      onContentUpdate(newContent);
    };

    const handleCursorUpdate = (cursor: LiveCursor) => {
      if (cursor.userId === user._id) return;

      setCursors((prev) => ({
        ...prev,
        [cursor.userId]: cursor,
      }));
    };

    const handleCursorRemove = (userId: string) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stopped-typing", handleUserStoppedTyping);
    socket.on("document-update", handleDocumentUpdate);
    socket.on("cursor-update", handleCursorUpdate);
    socket.on("cursor-remove", handleCursorRemove);

    return () => {
      socket.emit("leave-document", documentId);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stopped-typing", handleUserStoppedTyping);
      socket.off("document-update", handleDocumentUpdate);
      socket.off("cursor-update", handleCursorUpdate);
      socket.off("cursor-remove", handleCursorRemove);
    };
  }, [socket, isConnected, documentId, user, onContentUpdate]);

  const emitChange = useCallback(
    (newContent: string) => {
      if (!socket || !isConnected || !user) return;

      socket.emit("document-change", {
        documentId,
        content: newContent,
      });

      socket.emit("typing", {
        documentId,
        username: user.username || user.email,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          documentId,
          username: user.username || user.email,
        });
      }, 1000);
    },
    [socket, isConnected, documentId, user]
  );

  const emitCursor = useCallback(
    (position: number) => {
      if (!socket || !isConnected || !user) return;

      socket.emit("cursor-update", {
        documentId,
        cursor: {
          userId: user._id,
          username: user.username || user.email,
          color: user.color || "#3b82f6",
          position,
        },
      });
    },
    [socket, isConnected, documentId, user]
  );

  return {
    typingUsers,
    cursors,
    emitChange,
    emitCursor,
  };
};
