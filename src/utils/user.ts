import { User } from "screens/project-list/search-panel";
import { cleanObject, useMount } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useMount(() => {
    run(client("users", { data: cleanObject(param || {}) }));
  });
  return result;
};
