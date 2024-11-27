import React from "react";
import LoadModule from "./module-loader/module-loader";

export default function App() {
  return (
    <div>
      <h1>Root app</h1>
      <LoadModule importFn={() => import("MicroFrontend1/App")}></LoadModule>
    </div>
  );
}
