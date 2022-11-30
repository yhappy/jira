import styled from "@emotion/styled";
import { Row } from "components/libs";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, MenuProps } from "antd";
import { Route, Routes, Navigate } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";

export const AuthenticatedApp = () => {
  return (
    <div>
      <PageHeader />
      <Main>
        <Router>
          <Routes>
            <Route path="/projects" element={<ProjectListScreen />} />
            <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
          </Routes>
        </Router>
      </Main>
    </div>
  );
};

const PageHeader = () => {
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
    <Header between={true}>
      <HeaderLeft gap={true}>
        <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
        <h2>项目</h2>
        <h2>用户</h2>
      </HeaderLeft>
      <HeaderRight>
        <Dropdown menu={{ items }}>
          <Button type="link">Hi, {user?.name}</Button>
        </Dropdown>
      </HeaderRight>
    </Header>
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
  height: calc(100vh - 6rem);
`;
