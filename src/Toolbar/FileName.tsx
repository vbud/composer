import { useCallback, useRef, useState } from 'react';
import { FileId, shallow, useStore } from 'src/store';
import { Text } from 'src/Text/Text';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import * as styles from './FileName.css';

export default function FileName({ fileId }: { fileId: FileId }) {
  const [name, renameFile, displayStatusMessage] = useStore(
    (s) => [s.files[fileId].name, s.renameFile, s.displayStatusMessage],
    shallow
  );

  const [editedName, setEditedName] = useState(name);
  const [sizerWidth, setSizerWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const sizerSpanRef = useRef<HTMLSpanElement>(null);

  const revertName = useCallback(() => {
    setEditedName(name);
    setIsEditing(false);
  }, [name]);

  const saveName = useCallback(() => {
    if (editedName.length === 0) {
      displayStatusMessage({
        message: 'Filename cannot be empty',
        tone: 'critical',
      });
      revertName();
    } else if (editedName.length > 40) {
      displayStatusMessage({
        message: 'Filename cannot be more than 40 characters long',
        tone: 'critical',
      });
      revertName();
    } else {
      renameFile(fileId, editedName);
      setIsEditing(false);
    }
  }, [fileId, editedName, revertName, displayStatusMessage, renameFile]);

  const inputRef = useRef<HTMLInputElement>(null);
  useInteractOutside(inputRef, {
    onClickOutside: saveName,
    onEscapeKey: revertName,
  });

  const updateNameAndWidth = (name: string) => {
    setEditedName(name);

    // This sizer hack allows us to size the input to its content, which is not
    // easily solved with CSS.
    if (!sizerSpanRef.current) return;
    sizerSpanRef.current.innerText = name;
    setSizerWidth(sizerSpanRef.current.offsetWidth);
  };

  return (
    <div className={styles.root}>
      {isEditing ? (
        <>
          <Text className={styles.sizer}>
            <span ref={sizerSpanRef} />
          </Text>
          <input
            style={{ width: sizerWidth }}
            className={styles.input}
            ref={inputRef}
            autoFocus
            value={editedName}
            onFocus={() => updateNameAndWidth(editedName)}
            onChange={(e) => updateNameAndWidth(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
          />
        </>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Text>{name}</Text>
        </div>
      )}
    </div>
  );
}
