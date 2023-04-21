import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { withSSRGuest } from "@/utils/withSSRGuest";
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContextSelector(AuthContext, (context) => {
    return {
      signIn: context.signIn,
    };
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    };
  }
);
