import React, { useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';

import { useStore, shallow } from 'src/store';
import { Text } from '../Text/Text';
import DismissIcon from '../icons/DismissIcon';

import * as styles from './StatusMessage.css';

const statusMessageDuration = 3000;

export const StatusMessage = () => {
  const [statusMessage, dismissStatusMessage] = useStore(
    (s) => [s.statusMessage, s.dismissStatusMessage],
    shallow
  );

  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const { tone, message, dismissable = false } = statusMessage || {};

  const closeHandler = useCallback(() => {
    dismissStatusMessage();

    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
    }
  }, [dismissStatusMessage]);

  useEffect(() => {
    if (statusMessage) {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = setTimeout(closeHandler, statusMessageDuration);
    }
  }, [closeHandler, statusMessage]);

  return statusMessage ? (
    <div
      className={classnames(styles.status, {
        [styles.positive]: tone === 'positive',
        [styles.critical]: tone === 'critical',
        [styles.dismissable]: dismissable,
      })}
    >
      <Text>{message}</Text>
      {dismissable && (
        <div
          className={styles.dismiss}
          onClick={(e) => {
            e.stopPropagation();
            closeHandler();
          }}
        >
          <DismissIcon />
        </div>
      )}
    </div>
  ) : null;
};
