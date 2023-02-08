import CheckIcon from '@mui/icons-material/Check';
import * as muiComponents from '@mui/material';
import { omit } from 'lodash';
import parsePropTypes from 'parse-prop-types';
import { ElementType } from 'react';
import * as reactIs from 'react-is';

const staticTypes = __COMPOSER_GLOBAL__STATIC_TYPES__;

type Components = Record<string, ElementType>;
export type Hints = Record<string, Record<string, string[]>>;

function getComponents(): Components {
  const components: Components = {
    CheckIcon,
  };
  for (const [name, component] of Object.entries(muiComponents)) {
    if (reactIs.isValidElementType(component)) {
      components[name] = component;
    }
  }
  return components;
}

export const components = getComponents();

function getHints(): Hints {
  const componentNames = Object.keys(components).sort();

  return Object.assign(
    {},
    ...componentNames.map((componentName) => {
      const staticTypesForComponent = staticTypes[componentName];
      if (
        staticTypesForComponent &&
        Object.keys(staticTypesForComponent).length > 0
      ) {
        return {
          [componentName]: {
            attrs: staticTypesForComponent,
          },
        };
      }

      const parsedPropTypes = parsePropTypes(components[componentName]);
      const filteredPropTypes = omit(parsedPropTypes, 'children');
      const propNames = Object.keys(filteredPropTypes);

      return {
        [componentName]: Object.assign(
          {},
          ...propNames.map((propName) => {
            const propType = filteredPropTypes[propName].type;

            return {
              [propName]:
                propType.name === 'oneOf'
                  ? propType.value
                      .filter((x: any) => typeof x === 'string')
                      .map((x: string) => `"${x}"`)
                  : null,
            };
          })
        ),
      };
    })
  );
}

export const hints = getHints();
