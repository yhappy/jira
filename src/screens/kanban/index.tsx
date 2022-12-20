import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/libs";
import { useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useReorderTask, useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { TaskModal } from "./task-modal";
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./utils";

import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import { useCallback } from "react";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || kanbanIsLoading;
  const onDragEnd = useDragEnd();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel></SearchPanel>
        {isLoading ? (
          <Spin size="large"></Spin>
        ) : (
          <ColumnsContainer>
            <Droppable
              type="column"
              direction="horizontal"
              droppableId="kanban"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ display: "flex" }}
                >
                  {kanbans?.map((kanban, index) => (
                    <Draggable
                      draggableId={"kanban" + kanban.id}
                      index={index}
                      key={kanban.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <KanbanColumn kanban={kanban} key={kanban.id} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CreateKanban></CreateKanban>
          </ColumnsContainer>
        )}
        <TaskModal></TaskModal>
      </ScreenContainer>
    </DragDropContext>
  );
};

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutateAsync: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutateAsync: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;
      if (type === "column") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) return;
        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ fromId, referenceId: toId, type });
      }
      if (type === "row") {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        // if (fromKanbanId === toKanbanId) return;
        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) return;
        const type =
          fromKanbanId === toKanbanId && destination.index > source.index
            ? "after"
            : "before";
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type,
        });
      }
    },
    [allTasks, kanbans, reorderKanban, reorderTask]
  );
};

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
