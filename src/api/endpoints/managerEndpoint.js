import { apiSlice } from "../apiSlice";

const managerEndpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeveloper: builder.query({
      query: () => `/developer`,
      providesTags: ["Developer"],
    }),
  }),
});

export const { useGetDeveloperQuery } = managerEndpoint;
