import { apiSlice } from "../apiSlice";

const ticketsEnpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: () => "/ticket",
      providesTags: ["Tickets"],
    }),
    addTicket: builder.mutation({
      query: (data) => ({
        url: `/ticket`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tickets"],
    }),
    updateTicketStatus: builder.mutation({
      query: (data) => ({
        url: `/ticket/updatestatus?id=${data.id}`,
        method: "PUT",
        body: {
          status: data.status,
          ticketId: data.ticketId,
        },
      }),
      invalidatesTags: ["Tickets"],
    }),
    
  }),
});

export const { useGetTicketsQuery } = ticketsEnpoint;
export const { useAddTicketMutation } = ticketsEnpoint;
export const { useUpdateTicketStatusMutation } = ticketsEnpoint;

