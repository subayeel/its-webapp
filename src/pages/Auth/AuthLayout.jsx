import React from "react";
import { Outlet } from "react-router-dom";
import { CenterFlexContainer, LightText } from "../../Global";
import { Button } from "@mui/material";
import { AuthNav } from "./Auth.elements";
import { GridContainer } from "../../Global";

import logo from "../../assets/atom.png";

function AuthLayout() {
  return (
    <>
      <AuthNav>
        <GridContainer columns="1fr auto">
          <img heigth="80px" src={logo} alt="Navbar Icon"></img>
          <h1>ATOM</h1>
        </GridContainer>
        <GridContainer>
          {/* <Button variant="contained">CONTACT US</Button> */}
        </GridContainer>
      </AuthNav>
      <Outlet />
      <footer>
        <CenterFlexContainer>
          <LightText>&#169; Copyright reserved 2022-2023</LightText>
        </CenterFlexContainer>
      </footer>
    </>
  );
}

export default AuthLayout;
