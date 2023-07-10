import { apiSlice } from "../apiSlice";

const developerEndpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedProjects: builder.query({
      query: () => `/developer/myprojects`,
      providesTags: ["DevProjects"],
    }),
    addDeveloper: builder.mutation({
      query: (data) => ({
        url: `/register/developer/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Developer"],
    }),
    updateDeveloper: builder.mutation({
      query: (data) => ({
        url: `/developer/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Developer"],
    }),
    deleteDeveloper: builder.mutation({
      query: (data) => ({
        url: `/developer/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Developer"],
    }),
  }),
});

export const { useAddDeveloperMutation } = developerEndpoint;
export const { useUpdateDeveloperMutation } = developerEndpoint;
export const { useGetAssignedProjectsQuery } = developerEndpoint;
export const { useDeleteDeveloperMutation } = developerEndpoint;
