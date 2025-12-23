import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnlineUsersState {
  ids: string[];
}

const initialState: OnlineUsersState = {
  ids: [],
};

export const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } =
  onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
