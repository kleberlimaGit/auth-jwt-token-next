import { AuthTokenError } from "@/errors/AuthTokenError";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies } from "nookies";

export function withSSRAuth(fn: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx);

    if (!cookies["@app.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
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
