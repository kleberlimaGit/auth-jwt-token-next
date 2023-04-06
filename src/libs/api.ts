import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
export const api = axios.create({
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
                cookies = parseCookies();
                const { "@app.token": refreshToken } = cookies;
                api.post("/refresh", {
                    refreshToken,
                }).then((res) => {
                    
                    const { token } = res.data.token;

                    setCookie(undefined, "@app.token", token, {
                        maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
                        path: "/",
                    });
        
                    setCookie(undefined, "@app.refreshToken", res.data.refreshToken, {
                        maxAge: 60 * 60, // tempo de armazenamento do cookie no navegador
                        path: "/",
                    });

                    api.defaults.headers['Authorization'] = `Bearer ${token}`

                });
            } else {
                //deslogar o usuário
            }
        }
    }
);
