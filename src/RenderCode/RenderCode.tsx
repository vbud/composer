import React from 'react';

import CatchErrors from './CatchErrors';

function evalCode(code: string | undefined, scope: Record<string, any>) {
  // eslint-disable-next-line no-new-func
  return Function(...Object.keys(scope), `return ${code}`).apply(
    null,
    Object.values(scope)
  );
}

export default function RenderCode({
  code,
  scope,
}: {
  code: string | undefined;
  scope: Record<string, any>;
}) {
  return (
    <CatchErrors code={code}>
      {evalCode(code, {
        ...scope,
        React,
      })}
    </CatchErrors>
  );
}
