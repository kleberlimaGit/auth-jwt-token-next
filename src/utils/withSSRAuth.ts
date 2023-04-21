import { AuthTokenError } from "@/errors/AuthTokenError";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";

type withSSRAuthOptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth(fn: GetServerSideProps, options?:withSSRAuthOptions) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx);
    const token = cookies["@app.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if(options){
      const user = decode<{permissions: string[], roles: string[]}>(token);
      const permissions = options?.permissions
      const roles = options?.roles
      
      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if(!userHasValidPermissions){
        return {
          redirect: {
            destination: "/404",
            permanent: false,
          },
        }
      }
    }

    

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "@app.token");
        destroyCookie(ctx, "@app.refreshToken");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      return {
        redirect: {
          destination: "/error",
          permanent: false,
        },
      };
    }
  };
}
