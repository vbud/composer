import deepEqual from 'deep-equal';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { FileId, shallow, useStore } from 'src/store';
import { exampleFiles } from 'src/store/exampleFiles';
import { ButtonLink } from '../Button/Button';
import { Text } from '../Text/Text';
import * as styles from './IsExampleEdited.css';

export function IsExampleEdited({ fileId }: { fileId: FileId }) {
  const [file, copyExampleFile] = useStore(
    (s) => [s.files[fileId], s.copyExampleFile],
    shallow
  );
  const router = useRouter();
  const saveProgressToNewFile = () => {
    const newFileId = copyExampleFile(file.id);
    router.push(newFileId);
  };

  const ignore = ['selectedFrameId', 'canvasPosition'];

  const isExampleEdited =
    !!exampleFiles[fileId] &&
    !deepEqual(omit(file, ignore), omit(exampleFiles[fileId], ignore));

  return isExampleEdited ? (
    <div className={styles.root}>
      <Text>
        You are editing an example file, and your changes will not be saved.
        Consider{' '}
        <ButtonLink onClick={saveProgressToNewFile}>
          saving your progress to a new file
        </ButtonLink>
        .
      </Text>
    </div>
  ) : null;
}
