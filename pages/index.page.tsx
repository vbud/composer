import Stack from '@mui/material/Stack';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from 'src/Button/Button';
import { Heading } from 'src/Heading/Heading';
import { Link } from 'src/Link/Link';
import { File, shallow, useStore } from 'src/store';
import { isExampleId } from 'src/store/exampleFiles';
import { Text } from 'src/Text/Text';
import * as styles from './Home.css';

const FileList = ({ heading, files }: { heading: string; files: File[] }) => (
  <div>
    <Heading level="1">{heading}</Heading>
    <div className={styles.files}>
      {files.length === 0 ? (
        <Text size="large">No files to display.</Text>
      ) : (
        files.map(({ id, name }) => (
          <div key={id} className={styles.fileLink}>
            <Text size="large">
              <Link href={`/${id}`}>{name}</Link>
            </Text>
          </div>
        ))
      )}
    </div>
  </div>
);

// ts-unused-exports:disable-next-line
export default function Home() {
  const router = useRouter();
  const [files, createFile] = useStore((s) => [s.files, s.createFile], shallow);

  const userFiles: File[] = [];
  const exampleFiles: File[] = [];
  Object.values(files).forEach((file) => {
    if (isExampleId(file.id)) {
      exampleFiles.push(file);
    } else {
      userFiles.push(file);
    }
  });

  return (
    <div className={styles.root}>
      <Head>
        <title>composer</title>
      </Head>

      <Stack spacing={8}>
        <div>
          <FileList heading="Files" files={userFiles} />
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
        <FileList heading="Examples" files={exampleFiles} />
      </Stack>
    </div>
  );
}
