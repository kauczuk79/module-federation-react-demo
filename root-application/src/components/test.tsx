import React, { ReactNode } from "react";
import { useUser } from "../firebase/auth";
import LoadModule from "../module-loader/module-loader";

export default function Test(): ReactNode {
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
      {user && (
        <LoadModule
          importFn={() => import("MicroFrontend1/App")}
          properties={{ user }}
        ></LoadModule>
      )}
    </>
  );
}
