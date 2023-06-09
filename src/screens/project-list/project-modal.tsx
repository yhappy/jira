import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { ErrorBox } from "components/libs";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectModal, useProjectsQueryKey } from "./util";

export const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());

  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };
  const title = editingProject ? "编辑项目" : "创建项目";

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      open={projectModalOpen}
      width="100%"
      onClose={closeModal}
      forceRender={true}
    >
      <Container>
        {isLoading ? (
          <Spin size="large"></Spin>
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error}></ErrorBox>
            <Form
              form={form}
              layout="vertical"
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入项目名" }]}
              >
                <Input placeholder="请输入项目名"></Input>
              </Form.Item>
              <Form.Item
                label="部门"
                name="organization"
                rules={[{ required: true, message: "请输入部门名" }]}
              >
                <Input placeholder="请输入部门名"></Input>
              </Form.Item>
              <Form.Item label="负责人" name="personId">
                <UserSelect defaultOptionName="负责人"></UserSelect>
              </Form.Item>
              <Form.Item>
                <Button
                  loading={mutateLoading}
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
