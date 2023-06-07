import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    title: null,
    description: null,
    projectId: null,
    tickets: [],
    employees: [],
  },
  reducers: {
    setProjectData: (state, action) => {
      const { title, description, projectId, tickets, employees } =
        action.payload;
      state.description = description;
      state.employees = employees;
      state.projectId = projectId;
      state.tickets = tickets;
      state.title = title;
    },
  },
});

export const { setProjectData } = projectSlice.actions;

export default projectSlice.reducer;
