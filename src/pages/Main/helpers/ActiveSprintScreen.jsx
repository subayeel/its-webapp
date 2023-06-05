import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../../../utils/StrictModeDroppable";

import { KanbanCard, KanbanContainer, KanbanColumn } from "../Main.elements";
import {
  Container,
  CenterFlexContainer,
  GridContainer,
  LightText,
} from "../../../Global";
import {
  JobSmallText,
  JobStatusText,
  JobSubTitle,
  JobTitleText,
  TileHeading,
  SkillTile,
} from "../Main.elements";

import { Button } from "@mui/material";
import {
  useGetTicketsQuery,
  useUpdateTicketStatusMutation,
} from "../../../api/endpoints/ticketsEndpoint";
import { useNavigate, useParams } from "react-router-dom";
import CustomKanbanBoard from "./CustomKanbanBoard";
function ActiveSprintScreen() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    data: tickets,
    isLoading: isTicketLoading,
    isSuccess: isTicketSuccess,
  } = useGetTicketsQuery();

  const [
    changeTicketStatus,
    {
      isLoading: isChangeStatusLoading,
      isSuccess: isChangeStatusSuccess,
      isError: isChangeStatusError,
      error: changeStatusError,
    },
  ] = useUpdateTicketStatusMutation();

  const columnsFromBackend = {
    TODO: {
      name: "TO DO",
      items: tickets?.filter((c) => c.status === "TODO"),
    },
    InProgress: {
      name: "In Progress",
      items: tickets?.filter((c) => c.status === "InProgress"),
    },
    DevelopmentCompleted: {
      name: "Development Completed",
      items: tickets?.filter((c) => c.status === "DevelopmentCompleted"),
    },
    InQA: {
      name: "In QA",
      items: tickets?.filter((c) => c.status === "InQA"),
    },
    Done: {
      name: "Done",
      items: tickets?.filter((c) => c.status === "Done"),
    },
  };

  const [columns, setColumns] = useState(columnsFromBackend);

  useEffect(() => {
    setColumns(columnsFromBackend);
  }, [isTicketSuccess]);

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
        projectId: projectId,
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
    }
  };

  return (
    <KanbanContainer>
      <DragDropContext
        onDragEnd={(result) => handleOnDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <Droppable droppableId={id}>
              {(provided, snapshot) => {
                return (
                  <Container>
                    <h3>{column.name}</h3>
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
                      {column?.items?.map((item, index) => {
                        return (
                          <Draggable
                            key={item._id}
                            draggableId={item._id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <KanbanCard
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={{
                                  userSelect: "none",
                                  width: "max-content",

                                  margin: "4px 8px",
                                  backgroundColor: snapshot.isDragging
                                    ? "#CBCBCB "
                                    : "#fff",
                                  ...provided.draggableProps.style,
                                }}
                              >
                              
                                <Container width="100%" align="flex-start">
                                
                                  <JobSubTitle>{item.title}</JobSubTitle>
                                  <TileHeading>{item.description}</TileHeading>
                                  <JobSmallText>
                                    Priority:{item.priority}
                                  </JobSmallText>
                                </Container>
                                <GridContainer
                                  justify="flex-start"
                                  gap="0"
                                  columns="auto auto"
                                >
                                  <LightText>Reporter:</LightText>
                                  <LightText>{item.reporter}</LightText>
                                </GridContainer>
                                <CenterFlexContainer justify="space-between">
                                  <Container align="flex-start">
                                    <LightText>Assignee:</LightText>
                                    <CenterFlexContainer>
                                      {item.assignee?.map((assgn) => (
                                        <SkillTile>{assgn}</SkillTile>
                                      ))}
                                    </CenterFlexContainer>
                                  </Container>

                                  <Button
                                    onClick={() =>
                                      navigate(`/ticket/${item._id}`)
                                    }
                                  >
                                    View
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
  );
}

export default ActiveSprintScreen;
