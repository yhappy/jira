import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTasksModal, useTasksQueryKey } from "./utils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTaskId, editingTask, close } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());
  const onCancel = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务吗",
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      okText="确认"
      cancelText="取消"
      confirmLoading={editLoading}
      title="编辑任务"
      open={!!editingTaskId}
      onCancel={onCancel}
      onOk={onOk}
      forceRender={true}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label="任务名"
          name="name"
          rules={[{ required: true }, { message: "请输入任务名" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item label="经办人" name="processorId">
          <UserSelect defaultOptionName="经办人"></UserSelect>
        </Form.Item>
        <Form.Item label="类型" name="typeId">
          <TaskTypeSelect></TaskTypeSelect>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button
          type="link"
          size="small"
          style={{ fontSize: "14px" }}
          onClick={startDelete}
        >
          删除
        </Button>
      </div>
    </Modal>
  );
};
