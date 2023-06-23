import React from "react";
import { GridContainer, LightText } from "../Global";
import logo from "../assets/empty.png";
import { Button } from "@mui/material";
function NoData({ message, onclick, btnText }) {
  return (
    <GridContainer>
      <img height="180px" src={logo}></img>
      <LightText style={{ textAlign: "center" }}>{message}</LightText>
      {onclick && (
        <Button onClick={onclick} style={{ background: "#D95959",color:"white",fontWeight:"700" }}>
          {btnText}
        </Button>
      )}
    </GridContainer>
  );
}

export default NoData;
