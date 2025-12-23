"use client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ReactNode } from "react";
import SocketProvider from "../socket/SocketProvider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <SocketProvider>
        {children}
        <Toaster position="top-right" />
      </SocketProvider>
    </Provider>
  );
}
