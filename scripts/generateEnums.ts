import * as fs from 'fs';
import path from 'path';
import ts from 'typescript';

// Function to transform enum names to PascalCase and remove '_enum' suffix
function transformEnumName(name: string): string {
  return name
    .replace(/_enum$/, '') // Remove '_enum' suffix
    .split('_')
    .map(part => part.charAt(0)
      .toUpperCase() + part.slice(1))
    .join('');
}

// Function to parse and extract enums from Database['public']['Enums']
function extractEnums(content: string): Record<string, string[]> {
  const sourceFile = ts.createSourceFile('types.ts', content, ts.ScriptTarget.Latest, true);
  const enums: Record<string, string[]> = {};

  function visit(node: ts.Node) {
    if (
      ts.isPropertySignature(node) &&
      node.name.getText() === 'Enums' &&
      node.type &&
      ts.isTypeLiteralNode(node.type)
    ) {
      node.type.members.forEach(member => {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          ts.isUnionTypeNode(member.type)
        ) {
          const enumName = transformEnumName(member.name.getText());
          const enumValues = member.type.types
            .map(type => {
              if (ts.isLiteralTypeNode(type) && type.literal && ts.isStringLiteral(type.literal)) {
                return type.literal.text;
              }
              return null;
            })
            .filter(Boolean);

          enums[enumName] = enumValues.filter(value => value !== null) as string[];
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return enums;
}

// Function to create enum strings
function createEnumStrings(enums: Record<string, string[]>): string {
  return Object.entries(enums)
    .map(([enumName, enumValues]) => {
      const enumMembers = enumValues.map(value => `${value} = "${value}"`)
        .join(',\n  ');
      return `export enum ${enumName} {\n  ${enumMembers}\n}`;
    })
    .join('\n\n');
}

// Read the types.ts file
const dirname = __dirname;
const filePath = path.resolve(dirname, '../types/index.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract enums
const extractedEnums = extractEnums(fileContent);

// Create enum strings
const enumStrings = createEnumStrings(extractedEnums);

// Write enums to a new file
fs.appendFileSync(filePath, '\n' + enumStrings);