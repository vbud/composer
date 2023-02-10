import * as muiComponents from '@mui/material';
import { omit } from 'lodash';
import parsePropTypes from 'parse-prop-types';
import { ElementType } from 'react';
import * as reactIs from 'react-is';

type Components = Record<string, ElementType>;
export type Hints = Record<string, Record<string, string[] | null>>;

function getComponents(): Components {
  const components: Components = {};
  for (const [name, component] of Object.entries(muiComponents)) {
    if (
      name[0].toLocaleUpperCase() === name[0] &&
      reactIs.isValidElementType(component)
    ) {
      components[name] = component;
    }
  }
  return components;
}

export const components = getComponents();

function getHints(): Hints {
  const componentNames = Object.keys(components).sort();

  const hints: Hints = {};
  componentNames.forEach((componentName) => {
    const parsedPropTypes = parsePropTypes(components[componentName]);
    const filteredPropTypes = omit(parsedPropTypes, 'children');
    const propNames = Object.keys(filteredPropTypes);

    hints[componentName] = {};

    propNames.forEach((propName) => {
      const propType = filteredPropTypes[propName].type;

      hints[componentName][propName] =
        propType.name === 'oneOf'
          ? propType.value
              .filter((x: any) => typeof x === 'string')
              .map((x: string) => `"${x}"`)
          : null;
    });
  });

  return hints;
}

export const hints = getHints();
