import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from "./api/documentApi";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    [documentApi.reducerPath]: documentApi.reducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(documentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
