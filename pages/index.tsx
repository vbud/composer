import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { fileFramesStore, store } from 'src/stores';
import { Files, FileFrames } from 'src/contexts/FileContext';
import { Button } from 'src/Button/Button';
import { Text } from 'src/Text/Text';
import { Heading } from 'src/Heading/Heading';

import * as styles from '../pageStyles/Home.css';

export default function Home() {
  const [files, setFiles] = useState<Files | null>(null);

  const router = useRouter();

  useEffect(() => {
    store.getItem<Files>('files').then((files) => {
      files ? setFiles(files) : setFiles({});
    });
  }, []);

  return (
    <div className={styles.root}>
      <Head>
        <title>composer</title>
        <meta name="description" content="Design + engineering = ❤️" />
      </Head>

      <Heading level="1">Files</Heading>
      <div className={styles.files}>
        {files === null ? (
          <Text size="large">You have no files 😢.</Text>
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
            const id = crypto.randomUUID();

            const newFiles = {
              ...files,
              [id]: {
                id,
                name: 'Untitled',
                canvasPosition: {
                  left: 0,
                  top: 0,
                  zoom: 1,
                },
                selectedFrameId: null,
              },
            };

            setFiles(newFiles);
            store.setItem<Files>('files', newFiles);
            fileFramesStore.setItem<FileFrames>(id, {});

            router.push(id);
          }}
        >
          New file
        </Button>
      </div>
    </div>
  );
}
