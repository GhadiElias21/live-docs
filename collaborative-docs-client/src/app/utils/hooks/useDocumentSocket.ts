import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface UseDocumentSocketProps {
  socket: Socket | null;
  isConnected: boolean;
  documentId: string;
  user: { username?: string; email?: string } | undefined;
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
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.add(username);
        return newSet;
      });
    };

    const handleUserStoppedTyping = (username: string) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    };

    const handleDocumentUpdate = (newContent: string) => {
      onContentUpdate(newContent);
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stopped-typing", handleUserStoppedTyping);
    socket.on("document-update", handleDocumentUpdate);

    return () => {
      socket.emit("leave-document", documentId);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stopped-typing", handleUserStoppedTyping);
      socket.off("document-update", handleDocumentUpdate);
    };
  }, [socket, isConnected, documentId, user, onContentUpdate]);

  const emitChange = useCallback(
    (newContent: string) => {
      if (!socket || !isConnected || !user) return;

      // Emit Content
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

  return {
    typingUsers,
    emitChange,
  };
};
