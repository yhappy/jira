import { useMemo } from "react";
import { useProject } from "utils/project";
import { useUrlQueryParam } from "utils/url";

// 项目列表搜素的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(() => {
      return {
        ...param,
        personId: Number(param.personId) || undefined,
      };
    }, [param]),
    setParam,
  ] as const;
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projectCreate === "true"
      ? setProjectCreate({ projectCreate: undefined })
      : "";
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Boolean(editingProjectId)
      ? setEditingProjectId({ editingProjectId: undefined })
      : "";
  };
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
