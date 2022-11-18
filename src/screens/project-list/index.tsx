import { useEffect, useState } from "react";
import { cleanObject, useDebounce, useMount } from "utils/index";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import qs from "qs";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const deouncedParam = useDebounce(param, 200);

  const [users, setUsers] = useState([]);

  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(
      `${apiUrl}/projects?${qs.stringify(cleanObject(deouncedParam))}`
    ).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [deouncedParam]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  });

  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List users={users} list={list} />
    </div>
  );
};
