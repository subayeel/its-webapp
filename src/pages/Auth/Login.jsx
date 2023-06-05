import React, { useState, useEffect } from "react";
import { CardContainer, ErrorContainer, GridContainer, Heading, LinkText } from "../../Global";
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

import axios from "axios";
import { LoginContainer } from "./Auth.elements";
const LOGIN_URL = "http://localhost:5000/auth";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const { setAuth, persist, setPersist, auth } = useAuth();

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
      const roles = response?.data?.roles;

      if (response.status === 200) {
        navigate("/dashboard");
      }
      setAuth({ user, pwd, roles, accessToken });
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

  return (
    <LoginContainer>
      <Heading>Login</Heading>
      <GridContainer gap="0.8rem">
        <TextField
          label="UserName"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        {error && <ErrorContainer>{error}</ErrorContainer>}
        <LinkText to="/register">Not Registered?</LinkText>

        <FormControlLabel
          control={<Checkbox value={persist} onChange={togglePersist} />}
          label="Remember Me"
        />
        
        <Button onClick={handleSubmit} variant="contained">
          Login
        </Button>
      </GridContainer>
    </LoginContainer>
  );
}

export default Login;
