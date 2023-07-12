import React from "react";
import { GridContainer, LightText } from "../Global";
import construction from "../assets/construction.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function UnderConstruction() {
  const navigate = useNavigate();
  return (
    <GridContainer >
      <img height="200px" src={construction} />
      <LightText>
        The page you are requesting for is under construction.
      </LightText>
      <Button sx={{background:"#6B7EBF"}} onClick={() => navigate("/home")} variant="contained">
        Go Back
      </Button>
    </GridContainer>
  );
}

export default UnderConstruction;
