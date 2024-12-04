import React from "react";
import Auth from "AuthMicrofrontend/Auth";
import Test from "./components/test";

const { UserProvider } = require("AuthMicrofrontend/Auth") as typeof Auth;

export default function App() {
  return (
    <UserProvider>
      <Test></Test>
    </UserProvider>
  );
}
