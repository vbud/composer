import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useStore, shallow } from 'src/store';
import { Button } from 'src/Button/Button';
import { Text } from 'src/Text/Text';
import { Heading } from 'src/Heading/Heading';

import * as styles from './Home.css';

export default function Home() {
  const router = useRouter();
  const [files, createFile] = useStore((s) => [s.files, s.createFile], shallow);

  return (
    <div className={styles.root}>
      <Head>
        <title>composer</title>
      </Head>

      <Heading level="1">Files</Heading>
      <div className={styles.files}>
        {files === null || Object.keys(files).length === 0 ? (
          <Text size="large">😢 You have no files.</Text>
        ) : (
          Object.entries(files).map(([fileId, { name }]) => (
            <div key={fileId} className={styles.fileLink}>
              <Text size="large">
                <Link href={`/${fileId}`}>{name}</Link>
              </Text>
            </div>
          ))
        )}
      </div>

      <div>
        <Button
          onClick={() => {
            const newFileId = createFile();
            router.push(newFileId);
          }}
        >
          New file
        </Button>
      </div>
    </div>
  );
}
