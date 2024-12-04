import React, { ReactNode } from "react";
import ComponentLoader from "../module-loader/module-loader";
import Auth from "AuthMicrofrontend/Auth";
const { useUser } = require("AuthMicrofrontend/Auth") as typeof Auth;

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
        <ComponentLoader
          importFn={() => import("MicroFrontend1/App")}
          properties={{ user }}
        ></ComponentLoader>
      )}
    </>
  );
}
