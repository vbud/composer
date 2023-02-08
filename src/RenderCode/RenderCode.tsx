import React from 'react';
import { components } from 'src/utils/components';
import CatchErrors from './CatchErrors';

function evalCode(code: string | undefined, scope: Record<string, any>) {
  // eslint-disable-next-line no-new-func
  return Function(...Object.keys(scope), `return ${code}`).apply(
    null,
    Object.values(scope)
  );
}

export default function RenderCode({ code }: { code: string | undefined }) {
  return (
    <CatchErrors code={code}>
      {evalCode(code, {
        ...components,
        React,
      })}
    </CatchErrors>
  );
}
