import { useMemo, useRef } from 'react';
import { compileJsx } from 'src/utils/compileJsx';
import RenderCode from '../RenderCode/RenderCode';

export const CompileAndRenderCode = ({ code }: { code: string }) => {
  const lastValidCompiledRef = useRef<string | undefined>();
  const compiledCode = useMemo(() => {
    try {
      const compiled = compileJsx(code) ?? undefined;
      lastValidCompiledRef.current = compiled;
      return compiled;
    } catch {
      return lastValidCompiledRef.current;
    }
  }, [code]);

  return <RenderCode code={compiledCode} />;
};
