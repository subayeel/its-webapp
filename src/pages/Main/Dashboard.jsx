import React, { useEffect, useState } from "react";
import {
  AddIcon,
  GridContainer,
  Heading,
  Heading2,
  LightText,
  LinkText,
} from "../../Global";
import { MenuBar } from "./Main.elements";

import logo2 from "../../assets/logo2.png";

//MUI Imports
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, useParams } from "react-router-dom";
import {
  AddCircle,
  AddCircleOutlineOutlined,
  DashboardRounded,
  DocumentScanner,
  ForkRight,
  LowPriority,
  TableChart,
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  MenuItem,
  Button,
} from "@mui/material";
import ActiveSprintScreen from "./helpers/ActiveSprintScreen";


import {
  useAddProjectMutation,
  useGetProjectsQuery,
  useGetSingleProjectQuery,
} from "../../api/endpoints/projectEndpoint";

import { useSelector, useDispatch } from "react-redux";
import { setProjectData } from "../../reduxSlices/projectsSlice";

function Dashboard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState("");

  const {
    data: projects,
    isLoading: isProjectLoading,
    isSuccess: isProjectSuccess,
  } = useGetProjectsQuery();
  const {
    data: singleProject,
    isLoading: isSingleProjectLoading,
    isSuccess: isSingleProjectSuccess,
  } = useGetSingleProjectQuery(id);

  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("sprint");
  const [projectId, setProjectId] = useState();
  const [isAddingProject, setAddingProject] = useState(false);
  const [isChangingProject, setChangingProject] = useState(false);

  

  function renderBody() {
    if (activeTab === "sprint") {
      return <ActiveSprintScreen></ActiveSprintScreen>;
    }
  }

  //store selected project in redux store
  useEffect(() => {
    dispatch(
      setProjectData({
        projectId: singleProject?._id,
        description: singleProject?.description,
        tickets: singleProject?.tickets,
        employees: singleProject?.employees,
        title: singleProject?.title,
      })
    );
  }, [singleProject]);
  const data = useSelector((state) => state.project);
  console.log(data);
  return (
    <GridContainer style={{ height: "calc(100vh - 65px)" }} columns="250px 1fr">
      <MenuBar place="flex-start">
        <GridContainer columns="auto auto" justify="space-between">
          <LinkText onClick={() => setChangingProject(!isChangingProject)}>
            {isChangingProject ? "Close" : "Change"}
          </LinkText>
          <AddIcon onClick={() => setAddingProject(true)} />
        </GridContainer>
        {isChangingProject ? (
          <Select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setChangingProject(false);
            }}
          >
            {projects?.map((obj) => {
              return <MenuItem value={obj._id}>{obj.title}</MenuItem>;
            })}
          </Select>
        ) : (
          <GridContainer columns="1fr 3fr">
            <img height="40px" src={logo2}></img>
            <div>
              <Heading2>{singleProject?.title}</Heading2>
              <LightText>Software Project</LightText>
            </div>
          </GridContainer>
        )}

        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Planning Board
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <DashboardRounded />
            </ListItemIcon>
            <ListItemText primary="ABC Board" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ForkRight />
                </ListItemIcon>
                <ListItemText primary="Roadmap" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LowPriority />
                </ListItemIcon>
                <ListItemText primary="Backlog" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <TableChart />
                </ListItemIcon>
                <ListItemText primary="Active Sprint" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <DocumentScanner />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </MenuBar>
      {renderBody()}
    </GridContainer>
  );
}

export default Dashboard;
