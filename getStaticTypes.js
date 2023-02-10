const fastGlob = require('fast-glob');

const stringRegex = /^"(.*)"$/;
const extractEnumValues = (propType) => {
  if (propType.name === 'enum' && propType.value && propType.value.length > 0) {
    return propType.value
      .filter(({ value }) => stringRegex.test(value))
      .map(({ value }) => value.replace(stringRegex, '$1'));
  }
  return [];
};

function getStaticTypes() {
  const typeScriptFiles = ['**/*.{ts,tsx}'];
  const moduleName = '@mui/material';
  const resolvedModulePath = require.resolve(moduleName);
  // ensures the path is at the root of the module
  // for example, @mui/material resolves to [moduleRoot]/node/index.js
  const cwd = resolvedModulePath.substring(
    0,
    resolvedModulePath.indexOf(moduleName) + moduleName.length
  );

  try {
    const files = fastGlob.sync(typeScriptFiles, {
      cwd,
      absolute: true,
    });
    const results = require('react-docgen-typescript')
      .withCompilerOptions(
        {
          noErrorTruncation: true,
        },
        {
          componentNameResolver: (_exp, source) => {
            const matches = source.fileName.match(/\/(\w+)\.d\.ts/);
            return typeof matches[1] === 'string' ? matches[1] : undefined;
          },
          propFilter: (prop) => {
            return prop.name !== 'children' && !prop.name.startsWith('aria-');
          },
          shouldExtractValuesFromUnion: true,
          shouldExtractLiteralValuesFromEnum: true,
          shouldRemoveUndefinedFromOptional: true,
        }
      )
      .parse(files);

    const staticTypes = results.reduce((acc, result) => {
      if (result.displayName[0].toLocaleUpperCase() === result.displayName[0]) {
        acc[result.displayName] = Object.entries(result.props ?? {}).reduce(
          (props, [propName, prop]) => {
            props[propName] = extractEnumValues(prop.type);
            return props;
          },
          {}
        );
      }
      return acc;
    }, {});
    return staticTypes;
  } catch (err) {
    console.error('Error parsing static types.');
    console.error(err);
    return {};
  }
}

module.exports = getStaticTypes;
