/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-undef
const componentsDir = path.join(__dirname, '../components/ui');
const barrelFile = path.join(componentsDir, 'index.ts');

// Function to extract named exports from a file
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const namedExportRegex = /export\s+(?:const|function|class)\s+(\w+)/g;
  const defaultExportRegex = /export\s+default\s+(\w+)/g;
  const objectExportRegex = /export\s+{([^}]+)}/g;
  const aliasExportRegex = /export\s+{([^}]+)\s+as\s+([^}]+)};/g;

  const namedExports = [...content.matchAll(namedExportRegex)].map(match => match[1]);
  const defaultExports = [...content.matchAll(defaultExportRegex)].map(match => match[1]);
  const objectExports = [...content.matchAll(objectExportRegex)]
    .flatMap(match => match[1].split(',')
      .map(exp => exp.trim())
      .filter(exp => !exp.includes(' as ')));
  const aliasExports = [...content.matchAll(aliasExportRegex)].map(match => ({
    original: match[1].trim(),
    alias: match[2].trim(),
  }));

  return {
    namedExports, defaultExports, objectExports, aliasExports,
  };
}

// Function to read the components directory and generate the barrel file
async function generateBarrelFile() {
  try {
    const files = await fs.promises.readdir(componentsDir);
    console.log('Files in components directory:', files);

    const imports = files
      .filter(file => fs.statSync(path.join(componentsDir, file))
        .isDirectory())
      .filter(dir => dir !== 'gluestack-ui-provider' && dir !== 'utils') // Exclude the specific folder
      .flatMap(dir => {
        const dirPath = path.join(componentsDir, dir);
        const indexPath = path.join(dirPath, 'index.tsx');
        if (fs.existsSync(indexPath)) {
          const {
            namedExports, defaultExports, objectExports, aliasExports,
          } = extractExports(indexPath);
          console.log(`Exports found in ${indexPath}:`, {
            namedExports, defaultExports, objectExports, aliasExports,
          });

          const exportStatements = [
            ...namedExports.map(exp => `export { ${exp} } from './${dir}';`),
            ...defaultExports.map(exp => `export { default as ${exp} } from './${dir}';`),
            ...objectExports.map(exp => `export { ${exp} } from './${dir}';`),
            ...aliasExports.map(({ original, alias }) => `export { ${alias} } from './${dir}';`),
          ];

          return exportStatements.filter(statement => !statement.includes('{  }'));
        }
        console.log(`${indexPath} does not exist.`);
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