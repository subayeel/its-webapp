import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    logout: builder.query({
      query: () => "/logout",
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
export const { useLogoutQuery } = authApiSlice;
