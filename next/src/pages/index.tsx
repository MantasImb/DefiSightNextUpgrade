import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type NextPage } from "next";
import Head from "next/head";
import WalletForm from "~/components/WalletForm";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>DefiSight</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {!user && <SignInButton />}
        {user && (
          <UserButton
            appearance={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              baseTheme: dark,
            }}
          />
        )}
        <WalletForm />
      </main>
    </>
  );
};

export default Home;
