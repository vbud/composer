import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Button } from 'src/Button/Button';
import { FileId, shallow, useStore } from 'src/store';
import { ColorScheme } from 'src/utils/colorScheme';
import { Heading } from '../Heading/Heading';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import { Stack } from '../Stack/Stack';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import * as styles from './SettingsPanel.css';

const colorModeIcon: Record<ColorScheme, ReactElement> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

export default function SettingsPanel({ fileId }: { fileId: FileId }) {
  const [colorScheme, deleteFile, updateColorScheme] = useStore(
    (s) => [s.colorScheme, s.deleteFile, s.updateColorScheme],
    shallow
  );

  const router = useRouter();

  const confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      router.push('/');
      deleteFile(fileId);
    }
  };

  const inputIdPrefix = 'colorScheme_';

  return (
    <ToolbarPanel data-testid="settings-panel">
      <Stack space="large">
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color mode</Heading>
          </legend>
          <div className={styles.colorSchemeRadioContainer}>
            {(['system', 'light', 'dark'] as const).map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="colorScheme"
                  id={`${inputIdPrefix}${option}`}
                  value={option}
                  title={option.toLocaleUpperCase()}
                  checked={option === colorScheme}
                  onChange={() => updateColorScheme(option)}
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`${inputIdPrefix}${option}`}
                  className={styles.label}
                  title={option.toLocaleUpperCase()}
                >
                  <span className={styles.labelText}>
                    {colorModeIcon[option]}
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
