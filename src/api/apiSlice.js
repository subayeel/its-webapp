import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./auth/authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://its-backend.onrender.com",
  baseUrl: "http://localhost:5000/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result);
    if (result?.error?.originalStatus === 403) {
      console.log("sending refresh token");
      // send refresh token to get new access token
      const refreshResult = await baseQuery("/refresh", api, extraOptions);

      if (refreshResult?.data) {
        const user = api.getState().auth.user;
        // store the new token
        api.dispatch(setCredentials({ ...refreshResult.data, user }));
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});
