import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from "./api/documentApi";
import modalReducer from "./slices/modalSlice";
import { authApi } from "./api/authApi";
import { usersApi } from "./api/userApi";

export const store = configureStore({
  reducer: {
    [documentApi.reducerPath]: documentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      documentApi.middleware,
      authApi.middleware,
      usersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
