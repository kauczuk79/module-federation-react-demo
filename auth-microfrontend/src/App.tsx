import React, { ReactNode } from "react";
import { UserProvider, useUser } from "./auth/user-provider";

function Test(): ReactNode {
  const { user, login, signOut } = useUser();
  return (
    <>
      <h1>Hello {user ? user.displayName : ""} </h1>
      {!user && (
        <button
          onClick={async () => {
            await login();
          }}
        >
          Login
        </button>
      )}
      {user && (
        <button
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </button>
      )}
    </>
  );
}

export default function App(): ReactNode {
  return (
    <UserProvider>
      <Test></Test>
    </UserProvider>
  );
}
