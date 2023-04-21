import { AuthContext } from "@/contexts/AuthContext";
import { Can } from "@/hooks/Can";
import { useCan } from "@/hooks/useCan";
import { setupAPIClient } from "@/libs/api";
import { api } from "@/libs/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useContextSelector } from "use-context-selector";

export default function Dashboards() {
  const { isAuthenticated, user } = useContextSelector(
    AuthContext,
    (context) => {
      return {
        isAuthenticated: context.isAuthenticated,
        user: context.user,
      };
    }
  );
  // const userCanSeeMetrics = useCan({
  //   roles: ["administrator"],
  // });

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Hello World {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/me");
    const teste = response.data

    return {
      props: {
        teste
      },
    };
  }
);
