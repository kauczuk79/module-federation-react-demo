import React, { lazy, ReactNode, Suspense, useCallback, useMemo } from "react";

function Error() {
  return <>Error</>;
}

function Loading() {
  return <span>Loading</span>;
}

export default function ComponentLoader({
  importFn,
  properties,
}: {
  importFn: () => any;
  properties: { [property: string]: any };
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
      <ComponentModule {...properties}></ComponentModule>
    </Suspense>
  );
}
