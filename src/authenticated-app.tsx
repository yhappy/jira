import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/libs";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, MenuProps } from "antd";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";

export const AuthenticatedApp = () => {
  return (
    <Router>
      <PageHeader />
      <Main>
        <Routes>
          <Route path="/projects" element={<ProjectListScreen />} />
          <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
          <Route path="*" element={<Navigate to={"/projects"} />}></Route>
        </Routes>
      </Main>
      <ProjectModal />
    </Router>
  );
};

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type="link" onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { user, logout } = useAuth();
  const items: MenuProps["items"] = [
    {
      label: (
        <Button type="link" onClick={logout}>
          logout
        </Button>
      ),
      key: "logout",
    },
  ];
  return (
    <Dropdown menu={{ items }}>
      <Button type="link">Hi, {user?.name}</Button>
    </Dropdown>
  );
};

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Header = styled(Row)`
  padding: 3.2rem;
  height: 6rem;
  grid-area: header;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const Main = styled.main`
  height: calc(100vh - 7rem);
  display: flex;
  overflow: hidden;
`;
