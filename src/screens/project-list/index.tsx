import { useEffect, useState } from "react";
import { cleanObject, useDebounce, useMount } from "utils/index";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import qs from "qs";
import { useHttp } from "utils/http";

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const deouncedParam = useDebounce(param, 200);

  const [users, setUsers] = useState([]);

  const [list, setList] = useState([]);
  const client = useHttp();
  useEffect(() => {
    client("projects", { data: cleanObject(deouncedParam) }).then(setList);
  }, [deouncedParam]);

  useMount(() => {
    client("users").then(setUsers);
  });

  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List users={users} list={list} />
    </div>
  );
};
