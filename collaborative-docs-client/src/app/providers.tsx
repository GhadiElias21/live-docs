"use client";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { ReactNode } from "react";
type ProvidersProps = {
  children: ReactNode;
};
export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}
