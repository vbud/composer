const req = require.context('.', true, /([a-zA-Z]+)\.snippets\.tsx?$/);

interface SnippetDefinition {
  name: string;
  code: string;
}

export type Snippet = SnippetDefinition & {
  componentName: string;
};

function getSnippets() {
  const snippets: Snippet[] = [];
  const foundComponents = new Set<string>();

  req.keys().forEach((filename: string) => {
    const matches = filename.match(/([a-zA-Z]+)\.snippets\.tsx?$/);
    if (!matches) return;

    const componentName = matches[0];
    // require.context can return multiple paths to the same file, so we check
    // to see if we have already processed the file before continuing
    if (foundComponents.has(componentName)) return;

    const snippetDefinitions: SnippetDefinition[] =
      req(filename).snippets ?? [];

    snippetDefinitions.forEach(({ name, code }) =>
      snippets.push({
        componentName: matches[1],
        name,
        code,
      })
    );

    foundComponents.add(componentName);
  });

  return snippets;
}

export const snippets = getSnippets();
