import React, { useContext, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { FileContext } from 'src/contexts/FileContext';
import { Text } from '../Text/Text';
import DismissIcon from '../icons/DismissIcon';

import * as styles from './StatusMessage.css';

const statusMessageDuration = 3000;

export const StatusMessage = () => {
  const [{ statusMessage }, dispatch] = useContext(FileContext);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const { tone, message, dismissable = false } = statusMessage || {};

  const closeHandler = useCallback(() => {
    dispatch({ type: 'dismissMessage' });

    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
    }
  }, [dispatch]);

  useEffect(() => {
    if (statusMessage) {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = setTimeout(closeHandler, statusMessageDuration);
    }
  }, [closeHandler, dispatch, statusMessage]);

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
