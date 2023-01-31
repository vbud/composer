import React, { useCallback, useContext, useRef, useState } from 'react';

import { FileContext } from 'src/contexts/FileContext';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import { Text } from 'src/Text/Text';

import * as styles from './FileName.css';

export default function FileName() {
  const [{ activeFileName }, dispatch] = useContext(FileContext);

  const [editedName, setEditedName] = useState(activeFileName);
  const [sizerWidth, setSizerWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const sizerSpanRef = useRef<HTMLSpanElement>(null);

  const revertName = useCallback(() => {
    setEditedName(activeFileName);
    setIsEditing(false);
  }, [activeFileName]);

  const saveName = useCallback(() => {
    if (editedName.length === 0) {
      dispatch({
        type: 'displayStatusMessage',
        payload: {
          message: 'Filename cannot be empty',
          tone: 'critical',
        },
      });
      revertName();
    } else if (editedName.length > 40) {
      dispatch({
        type: 'displayStatusMessage',
        payload: {
          message: 'Filename cannot be more than 40 characters long',
          tone: 'critical',
        },
      });
      revertName();
    } else {
      dispatch({
        type: 'renameFile',
        payload: editedName,
      });
      setIsEditing(false);
    }
  }, [editedName, revertName, dispatch]);

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
          <Text>{activeFileName}</Text>
        </div>
      )}
    </div>
  );
}
