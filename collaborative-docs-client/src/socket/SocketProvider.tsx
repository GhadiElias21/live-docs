"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "@/store/slices/onlineUsersSlice";
import { useGetMeQuery } from "@/store/api/authApi";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { data: meData } = useGetMeQuery();
  const user = meData?.user;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { userId: user._id },
    });

    socketRef.current = socketInstance;
    setTimeout(() => setSocketState(socketInstance), 0);

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => setIsConnected(false));
    socketInstance.on("userOnline", (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketState, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
