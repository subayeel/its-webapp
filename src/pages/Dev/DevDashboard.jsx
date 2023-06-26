import React, { useState, memo } from "react";
import ReactModal from "react-modal";
import {
  AddIcon,
  CardContainer,
  CenterFlexContainer,
  ErrorContainer,
  GridContainer,
  Heading,
  HeroText,
  LightText,
  LinkText,
  MainContainer,
} from "../../Global";
import { TableContainer } from "../Main/Main.elements";
import {
  useAddProjectMutation,
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../api/endpoints/projectEndpoint";

import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  MenuItem,
  Button,
  TextField,
  ListItemText,
} from "@mui/material";
import { projectModalStyle } from "../../utils/modalStyles";
import {
  useAddDeveloperMutation,
  useDeleteDeveloperMutation,
  useGetAssignedProjectsQuery,
} from "../../api/endpoints/developerEndpoint";
import useAuth from "../../hooks/useAuth";
import { useGetDeveloperQuery } from "../../api/endpoints/managerEndpoint";
import NoData from "../../components/NoData";

const DevDashboard = memo(() => {
  const navigate = useNavigate();
  const auth = useAuth();
  //adding project states
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [isAddingProject, setAddingProject] = useState(false);
  const [isAddingDeveloper, setAddingDeveloper] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  //add Employee states
  const [devName, setDevName] = useState("");
  const [devUsername, setDevUsername] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [devCPassword, setDevCPassword] = useState("");

  const [error, setError] = useState("");

  //RTK Query

  const {
    data: assignedProjects,
    isLoading: isProjectLoading,
    isSuccess: isProjectSuccess,
  } = useGetAssignedProjectsQuery();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  console.log(auth);
  const handleClick = () => {
    setAddingProject(!isAddingProject);
  };
  const openAddDevelopersModal = () => {
    setAddingDeveloper(true);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setSelectedEmployees(value);
  };

  function handleEmptyDev() {
    setAddingProject(false);
    setAddingDeveloper(true);
  }

  return (
    <MainContainer>
      <CardContainer>
        <GridContainer columns="1fr" width="100%">
          <GridContainer columns="1fr" width="100%">
            <HeroText>Assigned Projects</HeroText>
            {/* <AddIcon onClick={handleClick}></AddIcon> */}
          </GridContainer>
          {assignedProjects?.length === 0 ? (
            <NoData message="No Projects Aavailable"></NoData>
          ) : (
            <TableContainer>
              <table>
                <tr>
                  <th>Project</th>
                  <th>Tickets Count</th>
                  <th>Employees Count</th>
                  <th>Action</th>
                </tr>
                {assignedProjects?.map((obj, i) => {
                  return (
                    <tr>
                      <td>{obj.title}</td>
                      <td>{obj.tickets.length}</td>
                      <td>{obj.employees.length}</td>
                      <td>
                        <CenterFlexContainer>
                          <Button
                            onClick={() => navigate(`/dev/project/${obj._id}`)}
                          >
                            View
                          </Button>
                        </CenterFlexContainer>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </TableContainer>
          )}
        </GridContainer>
      </CardContainer>
      {/* <CardContainer>
          <GridContainer columns="1fr">
            <GridContainer columns="1fr auto">
              <HeroText>Developers</HeroText>
              <AddIcon onClick={openAddDevelopersModal}></AddIcon>
            </GridContainer>
            <GridContainer>
              {myDevelopers?.length === 0 ? (
                <NoData
                  message="No Developers assigned to you"
                  onclick={() => setAddingDeveloper(true)}
                  btnText="Add Developer"
                ></NoData>
              ) : (
                <GridContainer columns="1fr">
                  <TableContainer>
                    <table>
                      <tr>
                        <th>Name</th>
                        <th>Projects Undertaken</th>
                        <th>Tickets Undertaken</th>
                        <th>ACTION</th>
                      </tr>
                      {myDevelopers?.map((obj, i) => (
                        <tr>
                          <td>{obj.fullName}</td>
                          <td>{obj.projectsAssigned.length}</td>
                          <td>{obj.ticketsAssigned.length}</td>
                          <td>
                            <CenterFlexContainer>
                              <Button
                                onClick={() =>
                                  navigate(`/developer/${obj._id}`)
                                }
                              >
                                View
                              </Button>
                              <Button
                                style={{
                                  background: "#D85959",
                                  color: "white",
                                }}
                                onClick={() => handleDeleteDeveloper(obj._id)}
                              >
                                Delete
                              </Button>
                            </CenterFlexContainer>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </TableContainer>
                </GridContainer>
              )}
            </GridContainer>
          </GridContainer>
        </CardContainer> */}

      {/* <GridContainer
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
      </GridContainer> */}
    </MainContainer>
  );
});

export default DevDashboard;
