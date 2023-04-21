import { singOut } from "@/contexts/AuthContext";
import { AuthTokenError } from "@/errors/AuthTokenError";
import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";

let isRefreshing = false; // verifica se o token esta sendo atualizado ou não
let failedRequestQueue: {
    //o que acontece quando o processo de refresh estiver finalizado
    onSuccess: (token: string) => void;
    //o que acontece quando o processo de refresh der erro
    onFailure: (err: AxiosError<unknown, any>) => void;
}[] = [];

export function setupAPIClient(ctx: GetServerSidePropsContext | undefined = undefined){

    let cookies = parseCookies(ctx);
    
    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers: {
          Authorization: `Bearer ${cookies["@app.token"]}`,
        },
      });
      
      interface ErrorToken {
        code: string;
      }
      //espera a resposta do back-end
      api.interceptors.response.use(
        (response) => {
          return response;
        },
        (error: AxiosError<ErrorToken>) => {
          if (error.response?.status === 401) {
            if (error.response.data?.code === "token.expired") {
              cookies = parseCookies(ctx);
      
              const { "@app.refreshToken": refreshToken } = cookies;
              const originalConfig = error.config; // toda a configuracao que foi feita para o backend
      
              if (!isRefreshing) {
                isRefreshing = true;
                api
                  .post("/refresh", {
                    refreshToken,
                  })
                  .then((res) => {
                    const { token } = res.data;
      
                    setCookie(ctx, "@app.token", token, {
                      maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
                      path: "/",
                    });
      
                    setCookie(ctx, "@app.refreshToken", res.data.refreshToken, {
                      maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
                      path: "/",
                    });
                    api.defaults.headers["Authorization"] = `Bearer ${token}`;
                    failedRequestQueue.forEach(request => request.onSuccess(token))
                    failedRequestQueue = []
                  }).catch(err => {
                      failedRequestQueue.forEach(request => request.onFailure(err))
                      failedRequestQueue = []
                      if(typeof window !== "undefined"){
                          singOut()
                      }
                  })
                  .finally(() => {
                      isRefreshing = false
                  });
              }
              return new Promise((resolve, reject) => {
                failedRequestQueue.push({
                  //o que acontece quando o processo de refresh estiver finalizado
                  onSuccess: (token: string) => {
                    originalConfig!.headers["Authorization"] = `Bearer ${token}`;
                    if (originalConfig) {
                      resolve(api(originalConfig));
                    }
                  },
                  //o que acontece quando o processo de refresh der erro
                  onFailure: (err: AxiosError) => {
                      reject(err)
                  },
                });
              });
            } else {
              if(typeof window !== "undefined"){
                  singOut()
              }else {
                return Promise.reject(new AuthTokenError)
              }
            }
          }
          return Promise.reject(error)
        }
      );
      return api 
}
