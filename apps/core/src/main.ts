// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#user-content-creating-and-printing-a-typescript-ast
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

function createLiteralFor(value: any) {
  if (value === null) return ts.factory.createNull();

  switch (typeof value) {
    case 'string':
      return ts.factory.createStringLiteral(value);
    case 'boolean':
      return value ? ts.factory.createTrue() : ts.factory.createFalse();
    case 'object':
      if (Array.isArray(value)) {
        return ts.factory.createArrayLiteralExpression(
          value.map((element) => createLiteralFor(element))
        );
      } else {
        return createObjectFromObject(value);
      }
    default:
      return ts.factory.createStringLiteral('not yet implemented');
  }
}

function createObjectFromObject(fragment: object) {
  const properties = Object.entries(fragment).map(([key, value]) => {
    return ts.factory.createPropertyAssignment(key, createLiteralFor(value));
  });
  return ts.factory.createObjectLiteralExpression(properties);
}

function createFragmentDeclaration(
  fragment: object
): [ts.Identifier, ts.ParameterDeclaration] {
  const identifier = ts.factory.createIdentifier(fragment['name']);
  const expression = ts.factory.createParameterDeclaration(
    [
      ts.factory.createToken(ts.SyntaxKind.ExportKeyword),
      ts.factory.createToken(ts.SyntaxKind.ConstKeyword),
    ],
    undefined,
    identifier,
    undefined,
    undefined,
    ts.factory.createAsExpression(
      createObjectFromObject(fragment),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.ConstKeyword as any)
    )
  );

  return [identifier, expression];
}

function createContractFileForAbi(abi: object[]) {
  const fragmentDeclarationIdentifiers = [];
  const fragmentDeclarations = abi.map((fragmentObject) => {
    const [identifier, declaration] = createFragmentDeclaration(fragmentObject);
    fragmentDeclarationIdentifiers.push(identifier);
    return declaration;
  });

  if (fragmentDeclarationIdentifiers.length === 0) return [];

  const exportDefault = ts.factory.createExportAssignment(
    [ts.factory.createToken(ts.SyntaxKind.DefaultKeyword)],
    false,
    ts.factory.createAsExpression(
      ts.factory.createArrayLiteralExpression(fragmentDeclarationIdentifiers),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.ConstKeyword as any)
    )
  );

  return [...fragmentDeclarations, exportDefault];
}

function convert(
  outputPath: string,
  filePaths: string[],
  options: ts.CompilerOptions
): void {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  for (const filePath of filePaths) {
    try {
      const fileName = path.basename(filePath, path.extname(filePath));
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      if (!data['abi']) continue;

      const lineNodes = createContractFileForAbi(data['abi']);
      if (lineNodes.length === 0) {
        console.error('Empty:', filePath);
        continue;
      }

      const resultFile = ts.createSourceFile(
        'someFileName.ts',
        '',
        ts.ScriptTarget.Latest,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
      );

      const file = ts.createSourceFile(
        `${outputPath}/${fileName}.ts`,
        '',
        ts.ScriptTarget.ESNext,
        false,
        ts.ScriptKind.TS
      );
      printer.printFile(file);
    } catch (exception) {
      console.error('Unable to convert:', filePath);
    }
  }
}
if (process.argv.length > 2) {
  convert(process.argv[2], process.argv.slice(3), {
    esModuleInterop: true,
    resolveJsonModule: true,
  });
}
console.log('testing');
