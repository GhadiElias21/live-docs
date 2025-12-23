export const initSocket = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    const userId = socket.handshake.auth?.userId;
    console.log("👤 User ID:", userId);

    if (!userId) {
      socket.disconnect();
      return;
    }

    onlineUsers.set(userId, socket.id);
    io.emit("userOnline", Array.from(onlineUsers.keys()));

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("userOffline", userId);
    });
  });
};
