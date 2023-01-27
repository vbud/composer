import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { fileFramesStore, store } from 'src/stores';
import { Files, FileFrames, initialFile } from 'src/contexts/FileContext';
import { Button } from 'src/Button/Button';

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

      {files !== null && (
        <>
          {Object.keys(files).map((fileId) => (
            <div key={fileId}>
              <Link href={`/${fileId}`}>{fileId}</Link>
            </div>
          ))}

          <div>
            <Button
              onClick={() => {
                const id = crypto.randomUUID();

                const newFiles = {
                  ...files,
                  [id]: {
                    id,
                    ...initialFile,
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
        </>
      )}
    </div>
  );
}
