import React, { lazy, ReactNode, Suspense, useMemo } from "react";

function Error() {
  return <>Error</>;
}

function Loading() {
  return <span>Loading</span>;
}

export default function ModuleLoader({
  importFn,
  ...props
}: {
  importFn: () => any;
}): ReactNode {
  const ComponentModule = useMemo(
    () =>
      lazy(async () => {
        try {
          return await importFn();
        } catch {
          return {
            default: Error,
          };
        }
      }),
    [importFn]
  );
  return (
    <Suspense fallback={<Loading />}>
      <ComponentModule {...props}></ComponentModule>
    </Suspense>
  );
}
