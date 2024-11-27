import React, { Suspense } from 'react';

const MicroFrontendApp = React.lazy(() => import('MicroFrontend1/App'))

function Loading() {
  return <span>Loading</span>
}

export default function App() {
  return (<div><h1>Root app</h1>
    <Suspense fallback={<Loading/>}>
      <MicroFrontendApp></MicroFrontendApp>
    </Suspense>
  </div>)
}