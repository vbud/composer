import React from 'react';

import * as styles from './FileName.css';

export default function FileName({ name }: { name: string }) {
  return <div className={styles.root}>{name}</div>;
}
