import React from "react";
import {
  CardContainer,
  GridContainer,
  HLine,
  Heading,
  HeroText,
  LightText,
  MainContainer,
} from "../../Global";
import { JobSmallText, JobTitleText } from "./Main.elements";
import { useGetProjectsQuery } from "../../api/endpoints/projectEndpoint";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const {
    data: projects,
    isLoading: isProjectLoading,
    isSuccess: isProjectSuccess,
  } = useGetProjectsQuery();
  return (
    <MainContainer>
      <GridContainer columns="1fr auto 1fr">
        <HLine></HLine>
        <HeroText>Your Projects</HeroText>
        <HLine></HLine>
      </GridContainer>
      <GridContainer
        justify="flex-start"
        columns="repeate(autofill,minmax(250px,500px))"
      >
        {projects?.map((obj) => {
          return (
            <CardContainer>
              <JobTitleText>{obj.title}</JobTitleText>
              <GridContainer gap="4px" columns="1fr 1fr">
                <>
                  <JobSmallText>
                    No. of Tickets:{obj.tickets.length}
                  </JobSmallText>
                  <JobSmallText>
                    No. of Assignee:{obj.employees.length}
                  </JobSmallText>
                  <LightText>{obj.description}</LightText>
                </>
                <Button onClick={() => navigate(`/project/${obj._id}`)}>
                  View
                </Button>
              </GridContainer>
            </CardContainer>
          );
        })}
      </GridContainer>
    </MainContainer>
  );
}

export default Home;
