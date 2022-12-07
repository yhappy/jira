import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./libs";

export const ProjectPopover = (props: { projectButton: JSX.Element }) => {
  const { data: projects, isLoading } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((projects) => (
          <List.Item>
            <List.Item.Meta title={projects.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      {props.projectButton}
      <Button></Button>
    </ContentContainer>
  );
  return (
    <Popover placement="bottom" content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
