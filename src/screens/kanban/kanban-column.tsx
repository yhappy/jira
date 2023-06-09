import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { Row } from "components/libs";
import { Mark } from "components/mark";
import { Kanban } from "types/kanban";
import { Task } from "types/task";
import { useDeleteKanban } from "utils/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { CreateTask } from "./create-task";
import { BugSvg, TaskSvg } from "./svg";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./utils";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return name === "task" ? <TaskSvg /> : <BugSvg />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
      onClick={() => startEdit(task.id)}
    >
      <p>
        <Mark keyword={keyword} name={task.name}></Mark>
      </p>
      <TaskTypeIcon id={task.typeId}></TaskTypeIcon>
    </Card>
  );
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Container>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id}></More>
      </Row>
      <TasksContainer>
        <Droppable type="row" direction="vertical" droppableId={"" + kanban.id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ minHeight: "5px" }}
            >
              {tasks?.map((task, taskIndex) => (
                <Draggable
                  draggableId={"task" + task.id}
                  index={taskIndex}
                  key={task.id}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} key={task.id}></TaskCard>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <CreateTask kanbanId={kanban.id}></CreateTask>
      </TasksContainer>
    </Container>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startEdit = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };

  const items = [
    {
      label: (
        <Button type="link" onClick={startEdit}>
          删除
        </Button>
      ),
      key: "edit",
    },
  ];
  return (
    <Dropdown menu={{ items }}>
      <Button type="link">...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
