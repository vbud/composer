import React, { useMemo, useRef } from 'react';

import { FileFrame } from 'src/contexts/FileContext';
import { compileJsx } from 'src/utils/compileJsx';
import { Components } from 'src/utils/components';
import RenderCode from '../RenderCode/RenderCode';

import * as styles from './Frame.css';

export const Frame = ({
  fileFrame,
  components,
}: {
  fileFrame: FileFrame;
  components: Components;
}) => {
  const lastValidCompiledRef = useRef<string | undefined>();
  const compiledCode = useMemo(() => {
    try {
      const compiled = compileJsx(fileFrame.code) ?? undefined;
      lastValidCompiledRef.current = compiled;
      return compiled;
    } catch {
      return lastValidCompiledRef.current;
    }
  }, [fileFrame.code]);

  return (
    <div className={styles.root}>
      <RenderCode code={compiledCode} scope={components} />
    </div>
  );
};
