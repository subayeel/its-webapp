import { apiSlice } from "../apiSlice";

const developerEndpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addDeveloper: builder.mutation({
      query: (data) => ({
        url: `/register/developer/`,
        method: "POST",
        body: data,

      }),
      invalidatesTags:["Developer"]
    }),
  }),
});

export const { useAddDeveloperMutation } = developerEndpoint;
