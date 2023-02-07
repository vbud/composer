import classNames from 'classnames';
import { capitalize } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { Text, TextProps } from 'src/Text/Text';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import * as styles from './AutosizeInput.css';

export default function AutosizeInput({
  className,
  name,
  value,
  onSaveValue,
  isEditable = true,
  textProps = {},
}: {
  className?: string;
  name: string;
  value: string;
  onSaveValue: (value: string) => void;
  isEditable?: boolean;
  textProps?: Omit<TextProps, 'children'>;
}) {
  const displayStatusMessage = useStore((s) => s.displayStatusMessage);

  const [editedValue, setEditedValue] = useState(value);
  const [sizerWidth, setSizerWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const sizerSpanRef = useRef<HTMLSpanElement>(null);

  const revertValue = useCallback(() => {
    setEditedValue(value);
    setIsEditing(false);
  }, [value]);

  const saveValue = useCallback(() => {
    if (editedValue.length === 0) {
      displayStatusMessage({
        message: `${capitalize(name)} cannot be empty.`,
        tone: 'critical',
      });
      revertValue();
    } else if (editedValue.length > 40) {
      displayStatusMessage({
        message: `${capitalize(name)} cannot be more than 40 characters long.`,
        tone: 'critical',
      });
      revertValue();
    } else {
      onSaveValue(editedValue);
      setIsEditing(false);
    }
  }, [name, onSaveValue, editedValue, revertValue, displayStatusMessage]);

  const inputRef = useRef<HTMLInputElement>(null);
  useInteractOutside(inputRef, {
    onClickOutside: saveValue,
    onEscapeKey: revertValue,
  });

  const updateValueAndWidth = (value: string) => {
    setEditedValue(value);

    // This sizer hack allows us to size the input to its content, which is not
    // easily solved with CSS alone.
    if (!sizerSpanRef.current) return;
    sizerSpanRef.current.innerText = value;
    setSizerWidth(sizerSpanRef.current.offsetWidth);
  };

  return (
    <div className={classNames(styles.root, className)}>
      {isEditing ? (
        <>
          <Text
            {...textProps}
            className={classNames(styles.sizer, textProps.className)}
          >
            <span ref={sizerSpanRef} />
          </Text>
          <input
            style={{ width: sizerWidth }}
            className={styles.input}
            ref={inputRef}
            autoFocus
            value={editedValue}
            onFocus={(e) => {
              e.currentTarget.select();
              updateValueAndWidth(editedValue);
            }}
            onChange={(e) => updateValueAndWidth(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveValue()}
          />
        </>
      ) : (
        <div
          onClick={(e) => {
            if (!isEditable) return;

            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Text {...textProps}>{value}</Text>
        </div>
      )}
    </div>
  );
}
