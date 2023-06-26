import { apiSlice } from "../apiSlice";

const projectEndPoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (data) => "/project",
      providesTags: ["Projects"],
    }),
    getSingleProject: builder.query({
      query: (id) => `/project/singleproject?id=${id}`,
      providesTags: ["Project"],
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
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (data) => ({
        url: `/project/${data.id}`,
        method: "DELETE",
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
      invalidatesTags: ["Project"],
    }),
    updateProjectTicketDetails: builder.mutation({
      query: (data) => ({
        url: `/project/ticket/update?id=${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    removeProjectTicket: builder.mutation({
      query: (data) => ({
        url: `/project/ticket/delete?id=${data.id}`,
        method: "PUT",
        body: { projectId: data.projectId },
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const { useAddProjectMutation } = projectEndPoints;
export const { useDeleteProjectMutation } = projectEndPoints;
export const { useUpdateProjectTicketStatusMutation } = projectEndPoints;
export const { useGetProjectsQuery } = projectEndPoints;
export const { useGetSingleProjectQuery } = projectEndPoints;
export const { useAddProjectTicketMutation } = projectEndPoints;
export const { useUpdateProjectTicketDetailsMutation } = projectEndPoints;
export const { useRemoveProjectTicketMutation } = projectEndPoints;
