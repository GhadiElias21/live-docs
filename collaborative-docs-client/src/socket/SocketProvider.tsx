"use client";

import { useEffect } from "react";
import { getSocket } from "./client";
import { useDispatch } from "react-redux";
import {
  removeOnlineUser,
  setOnlineUsers,
} from "@/store/slices/onlineUsersSlice";
import { useGetMeQuery } from "@/store/api/authApi";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isSuccess } = useGetMeQuery();
  const user = data?.user;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSuccess || !user?._id) return;

    const socket = getSocket(user._id);

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    socket.on("userOnline", (onlineUsers: string[]) => {
      dispatch(setOnlineUsers(onlineUsers));
      console.log("Online users updated:", onlineUsers);
    });

    socket.on("userOffline", (userId: string) => {
      dispatch(removeOnlineUser(userId));
      console.log("User went offline:", userId);
    });

    return () => {
      socket.disconnect();
    };
  }, [isSuccess, user?._id, dispatch]);

  return <>{children}</>;
}
