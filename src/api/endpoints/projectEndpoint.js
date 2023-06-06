import { apiSlice } from "../apiSlice";

const projectEndPoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/project",
      providesTags: ["Projects"],
    }),
    getSingleProject: builder.query({
      query: (id) => `/project/singleproject?id=${id}`,
    }),
    addProject: builder.mutation({
      query: (data) => ({
        url: `/project`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useAddProjectMutation } = projectEndPoints;
export const { useGetProjectsQuery } = projectEndPoints;
export const { useGetSingleProjectQuery } = projectEndPoints;
