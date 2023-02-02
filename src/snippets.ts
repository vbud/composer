const componentSnippets = {
  Alert: [
    {
      name: 'error',
      code: '<Alert severity="error">This is an error alert — check it out!</Alert>',
    },
    {
      name: 'warning',
      code: '<Alert severity="warning">This is a warning alert — check it out!</Alert>',
    },
    {
      name: 'info',
      code: '<Alert severity="info">This is an info alert — check it out!</Alert>',
    },
    {
      name: 'success',
      code: '<Alert severity="success">This is a success alert — check it out!</Alert>',
    },
  ],
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

export interface Snippet {
  componentName: keyof typeof componentSnippets;
  name: string;
  code: string;
}

export const snippets = Object.entries(componentSnippets).reduce(
  (acc: Snippet[], [componentName, snippetDefinitions]) => {
    snippetDefinitions.forEach(({ name, code }) =>
      acc.push({
        name,
        code,
        componentName: componentName as Snippet['componentName'],
      })
    );
    return acc;
  },
  []
);
