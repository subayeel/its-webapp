import React, { useState, useEffect } from "react";
import {
  CardContainer,
  ErrorContainer,
  GridContainer,
  Heading,
  LinkText,
} from "../../Global";
import {
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  FormControlLabel,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../api/auth/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";

import logo from "../../assets/atom.png";

import axios from "axios";
import { LoginContainer, AuthNav } from "./Auth.elements";
import { BASE_URL } from "../../utils/constants";
const LOGIN_URL = BASE_URL + "/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const { setAuth, persist, setPersist } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.userId;

      const roles = Object.values(response?.data?.roles);
      console.log(response);
      if (response.status === 200) {
        if (response?.data.roles?.includes(2000)) {
          navigate("/home");
        } else {
          navigate("/dev");
        }
      }
      setAuth({ user, pwd, roles, accessToken, userId });
      dispatch(setCredentials({ ...response.data }));
      setUser("");
      setPwd("");
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 400) {
        setError("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        setError("Login Failed");
      }
    }
  };
  const togglePersist = (e) => {
    setPersist(e.target.checked);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <LoginContainer>
      <Heading>Login</Heading>
      <GridContainer gap="0.8rem">
        <TextField
          label="UserName"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          onKeyDown={handleKeypress}
        />
        <TextField
          label="Password"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={handleKeypress}
        />

        {error && <ErrorContainer>{error}</ErrorContainer>}
        <LinkText to="/register">Not Registered?</LinkText>

        <FormControlLabel
          control={<Checkbox value={persist} onChange={togglePersist} />}
          label="Remember Me"
        />

        <Button type="submit" onClick={handleSubmit} variant="contained">
          Login
        </Button>
      </GridContainer>
    </LoginContainer>
  );
}

export default Login;
