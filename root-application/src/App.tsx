import React from "react";
import { UserProvider } from "./firebase/auth";
import { getFirestore } from "firebase/firestore";

import app from "./firebase/app";
import Test from "./components/test";
getFirestore(app);

export default function App() {
  return (
    <UserProvider>
      <Test></Test>
    </UserProvider>
  );
}
