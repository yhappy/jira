import React, { useState, useContext, ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallBack, FullPageLoading } from "components/libs";

interface AuthForm {
  username: string;
  password: string;
}

const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setDate: setUser,
  } = useAsync<User | null>();
  const login = (form: AuthForm) =>
    auth.login(form).then((user) => setUser(user));
  const register = (form: AuthForm) =>
    auth.register(form).then((user) => setUser(user));
  const logout = () => auth.logout().then(() => setUser(null));

  useMount(() => {
    run(bootstrapUser());
  });

  if (isLoading || isIdle) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallBack error={error} />;
  }
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必须在 provider 中使用");
  } else {
    return context;
  }
};
