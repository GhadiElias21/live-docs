import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<{ user: User }, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
