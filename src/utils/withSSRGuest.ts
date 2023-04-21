import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

export function withSSRGuest(fn: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx);

    if (cookies["@app.token"]) {
      return {
        redirect: {
          destination: "/dashboards",
          permanent: false,
        },
      };
    }
    return await fn(ctx)
  };
}
