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
    addProjectTicket: builder.mutation({
      query: (data) => ({
        url: `/project/addTicket`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProjectTicketStatus: builder.mutation({
      query: (data) => ({
        url: `/project/updateTicketStatus?id=${data.id}`,
        method: "PUT",
        body: {
          status: data.status,
        },
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useAddProjectMutation } = projectEndPoints;
export const { useUpdateProjectTicketStatusMutation } = projectEndPoints;
export const { useGetProjectsQuery } = projectEndPoints;
export const { useGetSingleProjectQuery } = projectEndPoints;
export const { useAddProjectTicketMutation } = projectEndPoints;
