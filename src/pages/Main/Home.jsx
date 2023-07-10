import React, { useState, memo, useReducer } from "react";
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
import { TableContainer } from "./Main.elements";

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
  useAddProjectMutation,
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../api/endpoints/projectEndpoint";
import {
  useAddDeveloperMutation,
  useDeleteDeveloperMutation,
  useUpdateDeveloperMutation,
} from "../../api/endpoints/developerEndpoint";
import useAuth from "../../hooks/useAuth";
import { useGetDeveloperQuery } from "../../api/endpoints/managerEndpoint";
import NoData from "../../components/NoData";
import { current } from "@reduxjs/toolkit";

const Home = memo(() => {
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

  //Update Dev
  const [devUpdateModal, setDevUpdateModal] = useState(false);
  const [currentDev, setCurrentDev] = useState("");
  const [uFullName, setUFullName] = useState("");
  const [uProjects, setUProjects] = useState([]);

  const [selectedProjects, setSelectedProjects] = useState([]);
  //Update EMployee

  const [error, setError] = useState("");

  //RTK Query
  const [addProject, { isLoading: isAddProjectLoading }] =
    useAddProjectMutation();
  const [deleteProject, { isLoading: isDeleteProjectLoading }] =
    useDeleteProjectMutation();
  const [addDeveloper, { isLoading: isAddDeveloperLoading }] =
    useAddDeveloperMutation();
  const [deleteDeveloper, { isLoading: isDeleteDeveloperLoading }] =
    useDeleteDeveloperMutation();
  const [updateDeveloper, { isLoading: isUpdateDeveloperLoading }] =
    useUpdateDeveloperMutation();

  const {
    data: projects,
    isLoading: isProjectLoading,
    isSuccess: isProjectSuccess,
  } = useGetProjectsQuery();
  const {
    data: myDevelopers,
    isLoading: isDevelopersLoading,
    isSuccess: isDevelopersSuccess,
  } = useGetDeveloperQuery();

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
  const handleProjectAssigning = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProjects(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setUProjects(value);
  };

  async function handleAddProject() {
    await addProject({
      title: pTitle,
      description: pDesc,
      employees: selectedEmployees.map((id) => {
        return {
          userId: id,
          fullName: myDevelopers.find((no) => no._id === id).fullName,
        };
      }),
    });

    setPDesc("");
    setPTitle("");
    setPersonName([]);
    setSelectedEmployees([]);
    setAddingProject(false);
  }
  async function handleAddDeveloper() {
    if (devPassword !== devCPassword) {
      setError("Password do not match");
      return;
    }
    try {
      const response = await addDeveloper({
        fullName: devName,
        user: devUsername,
        pwd: devPassword,
        userId: auth.auth.userId,
      });
      console.log(response);
      if (response.error.originalStatus === 409) {
        setError("Username already exists.");
        return;
      }
    } catch (err) {
      console.log(err);
    }

    setError("");
    setDevCPassword("");
    setDevName("");
    setDevPassword("");
    setDevUsername("");
    setAddingDeveloper(false);
  }
  function handleEmptyDev() {
    setAddingProject(false);
    setAddingDeveloper(true);
  }
  function handleEmptyProjects() {
    setDevUpdateModal(false);
    setAddingProject(true);
  }
  //TODO :create delete endpoint
  async function handleDeleteDeveloper(did) {
    try {
      const response = await deleteDeveloper({ id: did });
    } catch (e) {
      console.log(e);
    }
  }
  //TODO :create delete endpoint
  async function handleDeleteProject(pid) {
    try {
      const response = await deleteProject({ id: pid });
    } catch (e) {
      console.log(e);
    }
  }

  //TODO: Update existing employee
  async function handleDevEdit(id) {
    setCurrentDev(myDevelopers.find((obj) => obj._id == id));

    const cd = myDevelopers.find((obj) => obj._id == id);

    console.log("cd", cd);
    setUFullName(cd.fullName);
    setUProjects(cd.projectsAssigned.map((p) => p._id));
    setDevUpdateModal(true);
  }

  const handleUpdateDeveloper = async () => {
    await updateDeveloper({
      id: currentDev._id,
      fullName: uFullName,
      projects: projects.filter((proj) => uProjects.includes(proj._id)),
    });
  };
  return (
    <MainContainer>
      {/* Update Developer */}
      <ReactModal
        isOpen={devUpdateModal}
        onRequestClose={() => setDevUpdateModal(false)}
        style={projectModalStyle}
      >
        <Heading>Update {uFullName} Details</Heading>
        <GridContainer columns="1fr">
          <TextField
            label="Full Name"
            value={uFullName}
            onChange={(e) => setUFullName(e.target.value)}
          ></TextField>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Assign Project
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              multiple
              value={uProjects}
              onChange={handleProjectAssigning}
              input={<OutlinedInput label="Assign Project" />}
              renderValue={(selected) =>
                selected
                  .map((obj) => projects.find((no) => no._id === obj).title)
                  .join(", ")
              }
              MenuProps={MenuProps}
              disabled={projects?.length === 0}
            >
              {projects?.map((obj) => (
                <MenuItem key={obj.title} value={obj._id}>
                  <Checkbox checked={uProjects.indexOf(obj._id) > -1} />
                  <ListItemText primary={obj.title} />
                </MenuItem>
              ))}
            </Select>
            {projects?.length === 0 && (
              <>
                <LightText>
                  Please add Projects and assign them to your developers.&nbsp;
                  <LinkText onClick={handleEmptyProjects}>
                    Add Projects
                  </LinkText>
                </LightText>
              </>
            )}
          </FormControl>

          {error && <ErrorContainer>{error}</ErrorContainer>}
          <Button variant="contained" onClick={handleUpdateDeveloper}>
            Update
          </Button>
        </GridContainer>
      </ReactModal>

      {/* Add Project  */}
      <ReactModal
        onRequestClose={() => setAddingProject(false)}
        isOpen={isAddingProject}
        style={projectModalStyle}
      >
        <Heading>Add Project</Heading>
        <GridContainer columns="1fr">
          <TextField
            label="Title"
            value={pTitle}
            onChange={(e) => setPTitle(e.target.value)}
          ></TextField>
          <TextField
            label="Description"
            value={pDesc}
            onChange={(e) => setPDesc(e.target.value)}
          ></TextField>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Employees</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Employees" />}
              renderValue={(selected) =>
                selected
                  .map(
                    (obj) => myDevelopers.find((no) => no._id === obj).fullName
                  )
                  .join(", ")
              }
              MenuProps={MenuProps}
              disabled={myDevelopers?.length === 0}
            >
              {myDevelopers?.map((obj) => (
                <MenuItem key={obj.fullName} value={obj._id}>
                  <Checkbox checked={personName.indexOf(obj._id) > -1} />
                  <ListItemText primary={obj.fullName} />
                </MenuItem>
              ))}
            </Select>
            {myDevelopers?.length === 0 && (
              <>
                <LightText>
                  Please add employees and assign project to them.&nbsp;
                  <LinkText onClick={handleEmptyDev}>Add Employees</LinkText>
                </LightText>
              </>
            )}
          </FormControl>
          <Button variant="contained" onClick={handleAddProject}>
            Add Project
          </Button>
        </GridContainer>
      </ReactModal>

      {/* Add Developer Details */}
      <ReactModal
        onRequestClose={() => setAddingDeveloper(false)}
        isOpen={isAddingDeveloper}
        style={projectModalStyle}
      >
        <Heading>Add Developer</Heading>
        <GridContainer columns="1fr">
          <TextField
            label="Full Name"
            value={devName}
            onChange={(e) => setDevName(e.target.value)}
          ></TextField>
          <TextField
            label="Username"
            value={devUsername}
            onChange={(e) => setDevUsername(e.target.value)}
          ></TextField>
          <TextField
            type="password"
            label="Password"
            value={devPassword}
            onChange={(e) => setDevPassword(e.target.value)}
          ></TextField>
          <TextField
            type="password"
            label="Confirm Password"
            value={devCPassword}
            onChange={(e) => setDevCPassword(e.target.value)}
          ></TextField>
          {error && <ErrorContainer>{error}</ErrorContainer>}
          <Button variant="contained" onClick={handleAddDeveloper}>
            Add Developer
          </Button>
        </GridContainer>
      </ReactModal>
      <GridContainer
        columns="repeat(auto-fill,minmax(400px,1fr))"
        align="stretchs"
      >
        <CardContainer>
          <GridContainer columns="1fr" width="100%">
            <GridContainer columns="1fr auto" width="100%">
              <HeroText>Your Projects</HeroText>
              <AddIcon onClick={handleClick}></AddIcon>
            </GridContainer>
            {projects?.length === 0 ? (
              <NoData
                message="No Projects Aavailable"
                onclick={() => setAddingProject(true)}
                btnText="Add Project"
              ></NoData>
            ) : (
              <TableContainer>
                <table>
                  <tr>
                    <th>Project</th>
                    <th>Tickets Count</th>
                    <th>Employees Count</th>
                    <th>Action</th>
                  </tr>
                  {projects?.map((obj, i) => {
                    return (
                      <tr>
                        <td>{obj.title}</td>
                        <td>{obj.tickets.length}</td>
                        <td>{obj.employees.length}</td>
                        <td>
                          <CenterFlexContainer>
                            <Button
                              onClick={() => navigate(`/project/${obj._id}`)}
                            >
                              View
                            </Button>
                            <Button
                              style={{
                                background: "#D85959",
                                color: "white",
                              }}
                              onClick={() => handleDeleteProject(obj._id)}
                            >
                              Delete
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
        <CardContainer>
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
                            <CenterFlexContainer style={{gap:"8px"}}>
                              <Button
                                style={{
                                  background: "#90c1d7",
                                  color: "white",
                                }}
                                onClick={() => handleDevEdit(obj?._id)}
                              >
                                Edit
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
        </CardContainer>
      </GridContainer>

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

export default Home;
