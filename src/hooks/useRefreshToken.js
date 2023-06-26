import { setCredentials } from "../api/auth/authSlice";
import axios from "../api/axios";
import useAuth from "./useAuth";
import { useDispatch } from "react-redux";
const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const dispatch = useDispatch();
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    console.log(response);
    setAuth((prev) => {
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
        managerId: response.data?.managerId,
        developerId: response.data?.developerId,
      };
    });
    // console.log(response.data )
    dispatch(setCredentials({ ...response.data }));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
