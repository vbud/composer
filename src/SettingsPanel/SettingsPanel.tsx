import React, { useContext, ReactElement } from 'react';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { AppContext } from 'src/contexts/AppContext';
import { ColorScheme } from 'src/utils/colorScheme';
import { Stack } from '../Stack/Stack';

import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';

import * as styles from './SettingsPanel.css';
import { Button } from 'src/Button/Button';
import { FileContext } from 'src/contexts/FileContext';
import { useRouter } from 'next/router';

const colorModeIcon: Record<ColorScheme, ReactElement> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

export default function SettingsPanel() {
  const [{ colorScheme }, appDispatch] = useContext(AppContext);
  const [_, fileDispatch] = useContext(FileContext);
  const router = useRouter();

  const confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      fileDispatch({
        type: 'deleteFile',
      });
      router.push('/');
    }
  };

  return (
    <ToolbarPanel data-testid="settings-panel">
      <Stack space="large">
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color mode</Heading>
          </legend>
          <div className={styles.colorSchemeRadioContainer}>
            {['System', 'Light', 'Dark'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="colorScheme"
                  id={`colorScheme${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === colorScheme}
                  onChange={() =>
                    appDispatch({
                      type: 'updateColorScheme',
                      payload: option.toLowerCase() as ColorScheme,
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`colorScheme${option}`}
                  className={styles.label}
                  title={option}
                >
                  <span className={styles.labelText}>
                    {colorModeIcon[option.toLowerCase() as ColorScheme]}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div>
          <Heading level="3">File settings</Heading>
          <div className={styles.fileSettingsContainer}>
            <Button tone="critical" onClick={confirmDelete}>
              Delete file
            </Button>
          </div>
        </div>
      </Stack>
    </ToolbarPanel>
  );
}
