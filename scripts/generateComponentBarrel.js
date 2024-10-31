/* eslint-env node */
const fs = require('fs');
const path = require('path');

// Get the directory argument from the command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide a directory to generate the barrel file for.');
  process.exit(1);
}

// Map simplified arguments to their respective directory paths
const dirMapping = {
  icons: 'lib/icons',
  ui: 'components/ui',
};

const targetDir = dirMapping[args[0]];
if (!targetDir) {
  console.error('Invalid directory argument. Use "icons" or "ui".');
  process.exit(1);
}

const componentsDir = path.join(__dirname, '..', targetDir);
const barrelFile = path.join(componentsDir, 'index.ts');

// Function to extract named exports and type exports from a file
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const namedExportRegex = /export\s+(?:const|function|class|{[^}]+})\s+(\w+)|export\s+{([^}]+)}/g;
  const typeExportRegex = /export\s+type\s+{?\s*(\w+)\s*}?/g;

  const namedExports = [...content.matchAll(namedExportRegex)].flatMap(match => (match[1] || match[2]).split(',')
    .map(exp => exp.trim()));
  const typeExports = [...content.matchAll(typeExportRegex)].flatMap(match => match[1].split(',')
    .map(exp => exp.trim()));

  return { namedExports, typeExports };
}

// Function to read the components directory and generate the barrel file
async function generateBarrelFile() {
  try {
    const files = await fs.promises.readdir(componentsDir);
    console.log('Files in components directory:', files);

    const imports = files
      .filter(file => file !== 'index.ts' && file !== 'index.tsx' && file !== 'iconWithClassName.ts') // Exclude the barrel file itself and iconWithClassName helper file
      .flatMap(file => {
        const filePath = path.join(componentsDir, file);
        if (fs.statSync(filePath)
          .isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
          const { namedExports, typeExports } = extractExports(filePath);
          console.log(`Exports found in ${filePath}:`, { namedExports, typeExports });

          const exportStatements = [
            ...namedExports.map(exp => `export { ${exp} } from './${path.basename(file, path.extname(file))}';`),
            ...typeExports.map(exp => `export type { ${exp} } from './${path.basename(file, path.extname(file))}';`),
          ];

          return exportStatements.filter(statement => !statement.includes('{  }'));
        }
        console.log(`${filePath} is not a valid TypeScript file.`);
        return [];
      })
      .join('\n');

    const importCount = imports ? imports.split('\n').length : 0;
    console.log(`Generated ${importCount} imports:`, imports);

    await fs.promises.writeFile(barrelFile, imports);
    console.log('Barrel file created successfully!');
  } catch (err) {
    console.error('Error generating barrel file:', err);
  }
}

// Run the script
generateBarrelFile();