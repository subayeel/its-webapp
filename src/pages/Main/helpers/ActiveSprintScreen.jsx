import React, { useEffect, useState, useReducer } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../../../utils/StrictModeDroppable";
import { useDispatch } from "react-redux";
import {
  KanbanCard,
  KanbanContainer,
  KanbanColumn,
  ProfileAvatar,
} from "../Main.elements";
import {
  Container,
  CenterFlexContainer,
  GridContainer,
  LightText,
  Absolute,
  TextButton,
  MainContainer,
} from "../../../Global";
import {
  JobSmallText,
  JobSubTitle,
  TileHeading,
  SkillTile,
} from "../Main.elements";

import { HLine } from "../../../Global";

import { Heading2 } from "../../../Global";
import { Close } from "@mui/icons-material";
import { DeleteIcon } from "../Main.elements";
import {
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import {
  useRemoveProjectTicketMutation,
  useUpdateProjectTicketDetailsMutation,
  useUpdateProjectTicketStatusMutation,
} from "../../../api/endpoints/projectEndpoint";
import ReactModal from "react-modal";
import { customStyle } from "../../../utils/modalStyles";
import { useGetDeveloperQuery } from "../../../api/endpoints/managerEndpoint";
function ActiveSprintScreen({ employees }) {
  const { id } = useParams();

  const data = useSelector((state) => state.project);

  // const [newData, setNewData] = useState(data);

  const [selectedId, setSelectedId] = useState();
  const [isAddingModal, setAddingModal] = useState(false);
  const [curTicket, setCurTicket] = useState({});
  const [personName, setPersonName] = useState([]);

  const [updateTicketDetails, { isLoading: isUpdateTicketLoading }] =
    useUpdateProjectTicketDetailsMutation();
  const [changeTicketStatus, { isLoading: isChangeStatusLoading }] =
    useUpdateProjectTicketStatusMutation();
  const [removeTicket, { isLoading: isRemoveTicketLoading }] =
    useRemoveProjectTicketMutation();
  const {
    data: myDevelopers,
    isLoading: isDevelopersLoading,
    isSuccess: isDevelopersSuccess,
  } = useGetDeveloperQuery();

  const ACTION = {
    projectId: "handleProjectId",
    issueType: "handleIssue",
    status: "handleStatus",
    description: "handleDesc",
    assignee: "handleAssignee",
    reporter: "handleReporter",
    priority: "handlePriority",
    sprint: "handleSprint",
    title: "handleTitle",
  };

  function reducer(state, action) {
    switch (action.type) {
      case ACTION.projectId:
        return { ...state, projectId: action.payload };
      case ACTION.issueType:
        return { ...state, issueType: action.payload };
      case ACTION.status:
        return { ...state, status: action.payload };
      case ACTION.description:
        return { ...state, description: action.payload };
      case ACTION.assignee:
        return { ...state, assignee: action.payload };
      case ACTION.reporter:
        return { ...state, reporter: action.payload };
      case ACTION.priority:
        return { ...state, priority: action.payload };
      case ACTION.title:
        return { ...state, title: action.payload };
      case ACTION.sprint:
        return { ...state, sprint: action.payload };
      case ACTION.reset:
        return {
          projectId: "",
          issueType: "",
          status: "",
          description: "",
          assignee: [],
          reporter: "",
          priority: "",
          title: "",
        };
    }
  }
  const [issueData, dispatch] = useReducer(reducer, {
    issueType: "",
    status: "",
    description: "",
    assignee: [],
    reporter: "",
    priority: "",
    title: "",
  });

  const columnsFromBackend = {
    TODO: {
      name: "TO DO",
      items: data.tickets?.filter((c) => c.status === "TODO"),
    },
    InProgress: {
      name: "In Progress",
      items: data.tickets?.filter((c) => c.status === "InProgress"),
    },
    DevelopmentCompleted: {
      name: "Development Completed",
      items: data.tickets?.filter((c) => c.status === "DevelopmentCompleted"),
    },
    InQA: {
      name: "In QA",
      items: data.tickets?.filter((c) => c.status === "InQA"),
    },
    Done: {
      name: "Done",
      items: data.tickets?.filter((c) => c.status === "Done"),
    },
  };

  const [columns, setColumns] = useState(columnsFromBackend);

  const dummyIssues = [
    { id: 1, type: "Task" },
    { id: 2, type: "Story" },
    { id: 3, type: "Bug" },
    { id: 4, type: "Epic" },
  ];
  const dummyEpic = [
    { id: 1, type: "Threejs Animation Update" },
    { id: 2, type: "Revert Textfield changes" },
    { id: 3, type: "Authentication" },
    { id: 4, type: "Bugs" },
  ];
  const dummyStatus = [
    { key: "TODO", status: "TO DO" },
    { key: "DevelopmentCompleted", status: "Development Completed" },
    { key: "InProgress", status: "In Progress" },
    { key: "InQA", status: "In QA" },
    { key: "Done", status: "Done" },
  ];
  const dummyPriority = [
    { id: 1, type: "Highest" },
    { id: 2, type: "High" },
    { id: 3, type: "Low" },
    { id: 4, type: "Lowest" },
  ];
  const dummySprint = [
    { id: 1, type: "Sprint 1" },
    { id: 2, type: "Sprint 2" },
    { id: 3, type: "Sprint 3" },
    { id: 4, type: "Sprint 4" },
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
  async function handleUpdateSubmit() {
    const response = await updateTicketDetails({
      ...issueData,
      projectId: data.projectId,
      id: selectedId,
    });
    // dispatchRedux(
    //   setProjectData({
    //     title: response?.data.title,
    //     description: response?.data.description,
    //     projectId: response?.data.projectId,
    //     tickets: response?.data.tickets,
    //     employees: response?.data.employees,
    //   })
    // );
    dispatch({ type: ACTION.reset });
    setAddingModal(false);
  }
  useEffect(() => {
    setColumns(columnsFromBackend);
  }, [data]);

  const handleOnDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      await changeTicketStatus({
        status: destination.droppableId,
        id: result.draggableId,
        projectId: id,
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
    }
  };

  function openModal(id) {
    setCurTicket(data.tickets.find((obj) => obj._id == id));
    setSelectedId(id);
    const ct = data.tickets.find((obj) => obj._id == id);

    dispatch({ type: ACTION.title, payload: ct.title });
    dispatch({ type: ACTION.issueType, payload: ct.issueType });
    dispatch({ type: ACTION.status, payload: ct.status });
    dispatch({ type: ACTION.assignee, payload: ct.assignee });
    dispatch({ type: ACTION.reporter, payload: ct.reporter });
    dispatch({ type: ACTION.priority, payload: ct.priority });
    dispatch({ type: ACTION.sprint, payload: ct.sprint });
    setAddingModal(true);
  }

  async function handleDeleteTicket(curTicketId) {
    console.log(id);
    const result = await removeTicket({
      id: curTicketId,
      projectId: id,
    });
  }

  const [selectedDev, setSelectedDevList] = useState([]);
  const [devFilter, setDevFilter] = useState("");
  const [selectedEpic, setSelectedEpic] = useState("");
  console.log(selectedDev);
  return (
    <GridContainer align="flex-start">
      <GridContainer width="100%" columns="auto 1fr 1fr">
        <TextField
          sx={{ width: "100px" }}
          value={devFilter}
          onChange={setDevFilter}
          label="Search"
        ></TextField>
        <GridContainer
          width="100%"
          columns="repeat(auto-fill,minmax(20px,1fr))"
        >
          {data.employees?.map((obj, i) => (
            <ProfileToggle
              setSelectedDevList={setSelectedDevList}
              selectedDev={selectedDev}
              isSelected={selectedDev.includes(obj.userId)}
              key={i}
              user={obj}
            ></ProfileToggle>
          ))}
        </GridContainer>
        <FormControl fullWidth>
          <InputLabel id="epic-label">Epic</InputLabel>
          <Select
            fullWidth
            sx={{ width: "280px" }}
            labelId="epic-label"
            value={issueData.issueType}
            label="Epic"
            onChange={(e) => {
              setSelectedEpic(e.target.value);
            }}
          >
            {dummyIssues.map((dp) => {
              return <MenuItem value={dp.type}>{dp.type}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </GridContainer>

      <KanbanContainer>
        <ReactModal
          style={customStyle}
          isOpen={isAddingModal}
          onRequestClose={() => setAddingModal(false)}
        >
          <GridContainer
            style={{ borderBottom: "2px solid #ddd" }}
            padding="1rem"
            justify="space-between"
            columns="auto auto"
          >
            <Heading2>Update Issue</Heading2>
            <Close onClick={() => setAddingModal(false)} />
          </GridContainer>

          <GridContainer
            style={{ overflowY: "scroll", height: "300px" }}
            justify="flex-start"
            place="flex-start"
            columns="1fr"
            padding="1rem"
          >
            <LightText>
              Project Name: <Heading2>{data.title}</Heading2>
            </LightText>

            <TextField
              label="Issue Title"
              value={issueData.title}
              onChange={(e) => {
                dispatch({ type: ACTION.title, payload: e.target.value });
              }}
            ></TextField>
            <FormControl fullWidth>
              <InputLabel id="issue-label">Issue Type *</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="issue-label"
                value={issueData.issueType}
                label="Issue Type *"
                onChange={(e) => {
                  dispatch({ type: ACTION.issueType, payload: e.target.value });
                }}
              >
                {dummyIssues.map((dp) => {
                  return <MenuItem value={dp.type}>{dp.type}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <HLine />

            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="status-label"
                value={issueData.status}
                label="Status *"
                onChange={(e) => {
                  dispatch({ type: ACTION.status, payload: e.target.value });
                }}
              >
                {dummyStatus.map((dp) => {
                  return <MenuItem value={dp.key}>{dp.status}</MenuItem>;
                })}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={issueData.description}
              onChange={(e) => {
                dispatch({ type: ACTION.description, payload: e.target.value });
              }}
            ></TextField>

            <HLine />

            <FormControl fullWidth>
              <InputLabel id="status-label">Reporter</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="status-label"
                value={issueData.reporter}
                label="Reporter *"
                onChange={(e) => {
                  dispatch({ type: ACTION.reporter, payload: e.target.value });
                }}
              >
                {data.employees?.map((obj) => {
                  return (
                    <MenuItem value={obj.fullName}>{obj.fullName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Assignee</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="status-label"
                value={issueData.assignee}
                label="Reporter *"
                onChange={(e) => {
                  dispatch({ type: ACTION.assignee, payload: e.target.value });
                }}
              >
                {data.employees?.map((obj) => {
                  return (
                    <MenuItem value={obj.fullName}>{obj.fullName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <HLine />
            <FormControl fullWidth>
              <InputLabel id="status-label">Priority</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="status-label"
                value={issueData.priority}
                label="Priority *"
                onChange={(e) => {
                  dispatch({ type: ACTION.priority, payload: e.target.value });
                }}
              >
                {dummyPriority.map((dp) => {
                  return <MenuItem value={dp.type}>{dp.type}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Sprint</InputLabel>
              <Select
                fullWidth
                sx={{ width: "280px" }}
                labelId="status-label"
                value={issueData.sprint}
                label="Sprint"
                onChange={(e) => {
                  dispatch({ type: ACTION.sprint, payload: e.target.value });
                }}
              >
                {dummySprint.map((dp) => {
                  return <MenuItem value={dp.type}>{dp.type}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </GridContainer>
          <Absolute width="100%" bottom="0">
            <GridContainer
              justify="space-between"
              style={{ borderTop: "2px solid #ddd" }}
              padding="0 0.7rem"
              columns="auto auto"
            >
              <TextButton onClick={() => setAddingModal(false)}>
                Cancel
              </TextButton>
              <Button variant="contained" onClick={handleUpdateSubmit}>
                Update
              </Button>
            </GridContainer>
          </Absolute>
        </ReactModal>

        <DragDropContext
          onDragEnd={(result) => handleOnDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <Droppable droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <Container>
                      <Heading2>{column.name}</Heading2>
                      <KanbanColumn
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#EBFFC8 "
                            : "#EFF2E9",
                          marginRight: "1rem",
                        }}
                      >
                        {column?.items
                          ?.filter((obj) => {
                            if (selectedDev.length !== 0) {
                              return selectedDev.includes(obj.assignee);
                            } else {
                              return true;
                            }
                          })
                          .map((item, index) => {
                            return (
                              <Draggable
                                key={item._id}
                                draggableId={item._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <KanbanCard
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    style={{
                                      userSelect: "none",
                                      display: "grid",
                                      width: "calc(100% - 16px - 2rem)",
                                      gridTemplateColumns: "1fr",
                                      margin: "4px 8px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#CBCBCB "
                                        : "#fff",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <GridContainer
                                      columns="1fr auto"
                                      width="100%"
                                    >
                                      <JobSubTitle style={{ margin: "0" }}>
                                        {item.title}
                                      </JobSubTitle>
                                      <DeleteIcon
                                        onClick={() =>
                                          handleDeleteTicket(item._id)
                                        }
                                      />
                                    </GridContainer>
                                    <TileHeading>
                                      {item.description}
                                    </TileHeading>
                                    <JobSmallText>
                                      Priority:&nbsp;{item.priority}
                                    </JobSmallText>

                                    <GridContainer
                                      justify="flex-start"
                                      gap="0"
                                      columns="auto auto"
                                    >
                                      <LightText>Reporter:&nbsp;</LightText>
                                      <LightText>{item.reporter}</LightText>
                                    </GridContainer>
                                    <HLine />
                                    <CenterFlexContainer justify="space-between">
                                      <Container align="flex-start">
                                        <LightText>Assignee:&nbsp;</LightText>
                                        <LightText>{item.assignee}</LightText>
                                      </Container>

                                      <Button
                                        onClick={() => openModal(item._id)}
                                      >
                                        Update
                                      </Button>
                                    </CenterFlexContainer>
                                  </KanbanCard>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </KanbanColumn>
                    </Container>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </KanbanContainer>
    </GridContainer>
  );
}

export default ActiveSprintScreen;

function ProfileToggle({ isSelected, user, setSelectedDevList }) {
  const [selected, setSelected] = useState(isSelected);

  useEffect(() => {
    if (selected) {
      setSelectedDevList((curSelectedDevs) => [
        ...curSelectedDevs,
        user.fullName,
      ]);
    } else {
      setSelectedDevList((curSelectedDevs) =>
        curSelectedDevs.filter((name) => name !== user.fullName)
      );
    }
  }, [selected]);
  return (
    <ProfileAvatar onClick={() => setSelected(!selected)} isSelected={selected}>
      {user.fullName.substr(0, 1)} {user.fullName.split(" ")[1]?.substr(0, 1)}
    </ProfileAvatar>
  );
}
