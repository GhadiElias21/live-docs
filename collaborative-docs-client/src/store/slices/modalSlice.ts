// store/slices/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isAuthModalOpen: boolean;
  authModalType: "login" | "signup";
}

const initialState: ModalState = {
  isAuthModalOpen: false,
  authModalType: "signup",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<"login" | "signup">) => {
      state.isAuthModalOpen = true;
      state.authModalType = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    toggleAuthModal: (state, action: PayloadAction<"login" | "signup">) => {
      state.isAuthModalOpen = !state.isAuthModalOpen;
      state.authModalType = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, toggleAuthModal } =
  modalSlice.actions;

export default modalSlice.reducer;
