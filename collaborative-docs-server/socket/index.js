export const initSocket = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    onlineUsers.set(userId, socket.id);
    io.emit("userOnline", Array.from(onlineUsers.keys()));

    socket.on("join-document", ({ documentId, username }) => {
      socket.join(documentId);

      socket.to(documentId).emit("user-joined", username);
    });
    socket.on("leave-document", (documentId) => {
      socket.leave(documentId);
    });
    socket.on("document-change", ({ documentId, content }) => {
      socket.to(documentId).emit("document-update", content);
    });
    socket.on("typing", ({ documentId, username }) => {
      socket.to(documentId).emit("user-typing", username);
    });

    socket.on("stop-typing", ({ documentId, username }) => {
      socket.to(documentId).emit("user-stopped-typing", username);
    });
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("userOffline", userId);
    });
  });
};
