import React from "react";
import Button from "./Button";

export default function App({ user }: { user?: any }) {
  return (
    <div>
      <h3>Microfrontend here, I know you are {user?.displayName}</h3>
      <div>
        <Button></Button>
      </div>
    </div>
  );
}
