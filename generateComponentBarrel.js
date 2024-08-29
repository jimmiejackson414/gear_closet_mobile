const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-undef
const componentsDir = path.join(__dirname, 'components/ui');
const barrelFile = path.join(componentsDir, 'index.ts');

// Function to extract named exports from a file
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const exportRegex = /export\s+{([^}]+)}/g;
  const matches = [...content.matchAll(exportRegex)];
  return matches.flatMap(match =>
    match[1]
      .split(',')
      .map(exp => exp.trim())
      .filter(exp => exp)
      .map(exp => exp === 'createIconUI' ? 'createIcon' : exp), // Rename createIconUI to createIcon
  );
}

// Function to read the components directory and generate the barrel file
async function generateBarrelFile() {
  try {
    const files = await fs.promises.readdir(componentsDir);
    console.log('Files in components directory:', files);

    const imports = files
      .filter(file => fs.statSync(path.join(componentsDir, file)).isDirectory())
      .filter(dir => dir !== 'gluestack-ui-provider' && dir !== 'utils') // Exclude the specific folder
      .flatMap(dir => {
        const dirPath = path.join(componentsDir, dir);
        const indexPath = path.join(dirPath, 'index.tsx');
        if (fs.existsSync(indexPath)) {
          const exports = extractExports(indexPath);
          console.log(`Exports found in ${indexPath}:`, exports);
          return exports.length > 0 ? exports.map(exp => `export { ${exp} } from './${dir}';`) : [];
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