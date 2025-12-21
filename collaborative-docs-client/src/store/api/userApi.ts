import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  username: string;
  email: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersQuery } = usersApi;
