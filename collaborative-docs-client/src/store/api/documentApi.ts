import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Document } from "@/app/utils/types/Documents";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], void>({
      query: () => "documents",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Document" as const,
                id: _id,
              })),
              { type: "Document", id: "LIST" },
            ]
          : [{ type: "Document", id: "LIST" }],
    }),

    getDocumentById: builder.query<Document, string>({
      query: (id) => `documents/${id}`,
      providesTags: (result, error, id) => [{ type: "Document", id }],
    }),

    createDocument: builder.mutation<Document, Partial<Document>>({
      query: (data) => ({
        url: "documents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),

    updateDocument: builder.mutation<
      Document,
      { id: string; data: Partial<Document> }
    >({
      query: ({ id, data }) => ({
        url: `documents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id },
        { type: "Document", id: "LIST" },
      ],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Document", id },
        { type: "Document", id: "LIST" },
      ],
    }),
    shareDocument: builder.mutation({
      query: ({ documentId, userId, role }) => ({
        url: "/documents/share",
        method: "POST",
        body: { documentId, userId, role },
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useShareDocumentMutation,
} = documentApi;
