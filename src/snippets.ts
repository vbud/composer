import { capitalize, flatten } from 'lodash';

interface SnippetDefinition {
  name: string;
  code: string;
}

export const componentSnippets = {
  Alert: {
    'default variant': ['error', 'warning', 'info', 'success'].map(
      (severity) => ({
        name: `${severity}`,
        code: `<Alert severity="${severity}">${capitalize(
          severity
        )} alert — check it out!</Alert>`,
      })
    ),
    'outlined variant': ['error', 'warning', 'info', 'success'].map(
      (severity) => ({
        name: `outlined - ${severity}`,
        code: `<Alert variant="outlined" severity="${severity}">${capitalize(
          severity
        )} alert — check it out!</Alert>`,
      })
    ),
    'filled variant': ['error', 'warning', 'info', 'success'].map(
      (severity) => ({
        name: `filled - ${severity}`,
        code: `<Alert variant="filled" severity="${severity}">${capitalize(
          severity
        )} alert — check it out!</Alert>`,
      })
    ),
    'with description': ['error', 'warning', 'info', 'success'].map(
      (severity) => ({
        name: `standard - ${severity} - description`,
        code: `<Alert severity="${severity}">
  <AlertTitle>${capitalize(severity)}</AlertTitle>
  ${capitalize(severity)} alert — check it out!
</Alert>`,
      })
    ),
    'icon configuration': [
      {
        name: `icon prop`,
        code: `<Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
  This is a success alert — check it out!
</Alert>`,
      },
      {
        name: `iconMapping prop`,
        code: `<Alert
  iconMapping={{
    success: <CheckIcon fontSize="inherit" />,
  }}
>
  This is a success alert — check it out!
</Alert>`,
      },
      {
        name: `no icon`,
        code: ` <Alert icon={false} severity="success">
  This is a success alert — check it out!
</Alert>`,
      },
    ],
  },
  Button: [
    {
      name: 'text',
      code: '<Button variant="text">Text</Button>',
    },
    {
      name: 'contained',
      code: '<Button variant="contained">Contained</Button>',
    },
    {
      name: 'outlined',
      code: '<Button variant="outlined">Outlined</Button>',
    },
  ],
  Chip: [
    {
      name: 'filled',
      code: '<Chip label="Filled" />',
    },
    {
      name: 'outlined',
      code: '<Chip label="Outlined" variant="outlined" />',
    },
    {
      name: 'clickable',
      code: '<Chip label="Clickable" onClick={() => {}} />',
    },
    {
      name: 'deletable',
      code: '<Chip label="Deletable" onDelete={() => {}} />',
    },
  ],
  Select: [
    {
      name: 'basic',
      code: `
  <FormControl fullWidth>
    <InputLabel>Age</InputLabel>
    <Select value={10} label="Age">
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
  </FormControl>`,
    },
  ],
  Stack: [
    {
      name: 'row',
      code: `
  <Stack direction="row" spacing={2}>
    <Button>Item 1</Button>
    <Button>Item 2</Button>
    <Button>Item 3</Button>
  </Stack>`,
    },
    {
      name: 'column',
      code: `
  <Stack direction="column" spacing={2}>
    <Button>Item 1</Button>
    <Button>Item 2</Button>
    <Button>Item 3</Button>
  </Stack>`,
    },
  ],
  Table: [
    {
      name: 'basic',
      code: `
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Dessert (100g serving)</TableCell>
          <TableCell align="right">Calories</TableCell>
          <TableCell align="right">Fat (g)</TableCell>
          <TableCell align="right">Carbs (g)</TableCell>
          <TableCell align="right">Protein (g)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          ["Frozen yoghurt", 159, 6.0, 24, 4.0],
          ["Ice cream sandwich", 237, 9.0, 37, 4.3],
          ["Eclair", 262, 16.0, 24, 6.0],
          ["Cupcake", 305, 3.7, 67, 4.3],
          ["Gingerbread", 356, 16.0, 49, 3.9],
        ].map(([name, calories, fat, carbs, protein]) => (
          <TableRow key={name}>
            <TableCell component="th" scope="row">
              {name}
            </TableCell>
            <TableCell align="right">{calories}</TableCell>
            <TableCell align="right">{fat}</TableCell>
            <TableCell align="right">{carbs}</TableCell>
            <TableCell align="right">{protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>`,
    },
    {
      name: 'dense',
      code: `
  <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Dessert (100g serving)</TableCell>
          <TableCell align="right">Calories</TableCell>
          <TableCell align="right">Fat (g)</TableCell>
          <TableCell align="right">Carbs (g)</TableCell>
          <TableCell align="right">Protein (g)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          ["Frozen yoghurt", 159, 6.0, 24, 4.0],
          ["Ice cream sandwich", 237, 9.0, 37, 4.3],
          ["Eclair", 262, 16.0, 24, 6.0],
          ["Cupcake", 305, 3.7, 67, 4.3],
          ["Gingerbread", 356, 16.0, 49, 3.9],
        ].map(([name, calories, fat, carbs, protein]) => (
          <TableRow key={name}>
            <TableCell component="th" scope="row">
              {name}
            </TableCell>
            <TableCell align="right">{calories}</TableCell>
            <TableCell align="right">{fat}</TableCell>
            <TableCell align="right">{carbs}</TableCell>
            <TableCell align="right">{protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>`,
    },
  ],
  Tabs: [
    {
      name: 'basic',
      code: `
  <Tabs value={0}>
    <Tab label="Item One" />
    <Tab label="Item Two" />
    <Tab label="Item Three" />
  </Tabs>`,
    },
  ],
  Tooltip: [
    {
      name: 'basic',
      code: `
  <Tooltip title="Tooltip">
    <Button>Button</Button>
  </Tooltip>`,
    },
    {
      name: 'arrow',
      code: `
  <Tooltip title="Tooltip with arrow" arrow>
    <Button>Button</Button>
  </Tooltip>`,
    },
  ],
} as const;

type ComponentName = keyof typeof componentSnippets;

export interface Snippet {
  componentName: ComponentName;
  name: string;
  code: string;
}

const snippetsFromDefinitions = (
  snippetDefinitions: SnippetDefinition[],
  componentName: ComponentName
) =>
  snippetDefinitions.map(({ name, code }) => ({
    name,
    code,
    componentName,
  }));

export const snippets = Object.entries(componentSnippets).reduce(
  (acc: Snippet[], [componentName, snippetDefinitions]) => {
    if (Array.isArray(snippetDefinitions)) {
      return acc.concat(
        snippetsFromDefinitions(
          snippetDefinitions,
          componentName as ComponentName
        )
      );
    }
    return snippetsFromDefinitions(
      flatten(Object.values(snippetDefinitions)),
      componentName as ComponentName
    );
  },
  []
);
