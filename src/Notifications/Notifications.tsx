import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import { IsExampleEdited } from 'src/IsExampleEdited/IsExampleEdited';
import { StatusMessage } from 'src/StatusMessage/StatusMessage';
import { FileId, shallow, useStore } from 'src/store';
import * as styles from './Notifications.css';

export function Notifications({ fileId }: { fileId: FileId }) {
  const [showCanvasOnly] = useStore(
    (s) => [s.showCanvasOnly, s.statusMessage],
    shallow
  );

  return (
    <Stack
      className={classNames(styles.root, {
        [styles.toolbarHidden]: showCanvasOnly,
      })}
      spacing={2}
      alignItems="center"
    >
      <IsExampleEdited fileId={fileId} />
      <StatusMessage />
    </Stack>
  );
}
