import { ReactNode, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "@/libs/apiClient";
type User = {
  email: string | null;
  permissions: string[] | null;
  roles: string[] | null;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData);

export function singOut() {
  destroyCookie(undefined, "@app.token");
  destroyCookie(undefined, "@app.refreshToken");
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "@app.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((res) => {
          const { email, permissions, roles } = res.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          destroyCookie(undefined, "@app.token");
          destroyCookie(undefined, "@app.refreshToken");
          Router.push("/");
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, "@app.token", token, {
        maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
        path: "/",
      });

      setCookie(undefined, "@app.refreshToken", refreshToken, {
        maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      Router.push("/dashboards");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
