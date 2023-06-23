import React, { useState } from "react";
import ReactModal from "react-modal";
import {
  AddIcon,
  CardContainer,
  ErrorContainer,
  GridContainer,
  Heading,
  HeroText,
  MainContainer,
} from "../../Global";
import { TableContainer } from "./Main.elements";
import {
  useAddProjectMutation,
  useGetProjectsQuery,
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
import { useAddDeveloperMutation } from "../../api/endpoints/developerEndpoint";
import useAuth from "../../hooks/useAuth";
import { useGetDeveloperQuery } from "../../api/endpoints/managerEndpoint";

function Home() {
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
  const [addProject, { isLoading: isAddProjectLoading }] =
    useAddProjectMutation();
  const [addDeveloper, { isLoading: isAddDeveloperLoading }] =
    useAddDeveloperMutation();

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

  const employees = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
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
  console.log(auth.auth.userId);
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

  async function handleAddProject() {
    await addProject({
      title: pTitle,
      description: pDesc,
      employees: selectedEmployees,
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
    await addDeveloper({
      fullName: devName,
      user: devUsername,
      pwd: devPassword,
      userId: auth.auth.userId,
    });

    setError("");
    setDevCPassword("");
    setDevName("");
    setDevPassword("");
    setDevUsername("");
    setAddingDeveloper(false);
  }
  return (
    <MainContainer>
      {/* Add Developer Name */}
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

      {/* Add Project Name */}
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
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {employees.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddProject}>
            Add Project
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
            <TableContainer>
              <table>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Ticket Count</th>
                  <th>Employees Count</th>
                  <th>Action</th>
                </tr>
                {projects?.map((obj, i) => {
                  return (
                    <tr>
                      <td>{i}</td>
                      <td>{obj.title}</td>
                      <td>{obj.tickets.length}</td>
                      <td>{obj.employees.length}</td>
                      <td>
                        <Button onClick={() => navigate(`/project/${obj._id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </TableContainer>
          </GridContainer>
        </CardContainer>
        <CardContainer>
          <GridContainer columns="1fr">
            <GridContainer columns="1fr auto">
              <HeroText>Developers</HeroText>
              <AddIcon onClick={openAddDevelopersModal}></AddIcon>
            </GridContainer>
            <GridContainer>
              <GridContainer columns="1fr">
                <TableContainer>
                  <table>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Projects Undertaken</th>
                      <th>Tickets Undertaken</th>
                      <th>ACTION</th>
                    </tr>
                    {myDevelopers?.map((obj, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{obj.fullName}</td>
                        <td>{obj.projectsAssigned.length}</td>
                        <td>{obj.ticketsAssigned.length}</td>
                        <td>
                          <Button
                            onClick={() => navigate(`/developer/${obj._id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </TableContainer>
              </GridContainer>
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
}

export default Home;
