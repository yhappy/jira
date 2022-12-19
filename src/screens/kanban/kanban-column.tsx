import styled from "@emotion/styled";
import { Card } from "antd";
import { Mark } from "components/mark";
import { Kanban } from "types/kanban";
import { Task } from "types/task";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { CreateTask } from "./create-task";
import { BugSvg, TaskSvg } from "./svg";
import { useTasksModal, useTasksSearchParams } from "./utils";

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
      <h3>{kanban.name}</h3>
      <TasksContainer>
        {tasks?.map((task) => (
          <TaskCard task={task} key={task.id}></TaskCard>
        ))}
        <CreateTask kanbanId={kanban.id}></CreateTask>
      </TasksContainer>
    </Container>
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
