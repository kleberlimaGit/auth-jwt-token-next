import { Can } from "@/hooks/Can";
import { setupAPIClient } from "@/libs/api";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { GetServerSideProps } from "next";

export default function Metrics() {
    
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/me");

    return {
      props: {},
    };
  }, {
    permissions:['metrics.lit'],
    roles:['administrator']
  }
);
