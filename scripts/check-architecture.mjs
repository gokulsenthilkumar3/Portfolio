import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const sourceRoot = path.join(root, 'src')
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'))
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options
const files = []
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name)
    if (entry.isDirectory()) scan(name)
    else if (/\.tsx?$/.test(name)) files.push(name)
  }
}
scan(sourceRoot)
const known = new Set(files)
const edges = new Map()
const clients = new Set()
const violations = new Set()
const relative = file => path.relative(root, file).replaceAll('\\', '/')

for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  const references = new Set()
  if (source.statements.some(s => ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression) && s.expression.text === 'use client')) clients.add(file)
  function visit(node) {
    let specifier
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) specifier = node.moduleSpecifier.text
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) specifier = node.arguments[0].text
    if (specifier) {
      const resolved = ts.resolveModuleName(specifier, file, options, ts.sys).resolvedModule?.resolvedFileName
      if (resolved && known.has(path.normalize(resolved))) references.add(path.normalize(resolved))
      else if (specifier.startsWith('@/') || specifier.startsWith('.')) {
        if (!/\.(css|json|png|jpg|svg)$/.test(specifier)) violations.add('Unresolved import: ' + relative(file) + ' → ' + specifier)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  edges.set(file, references)
}

const entries = files.filter(f => /^src\/app\/.+\/(page|layout|route|opengraph-image|loading|error|not-found)\.tsx?$/.test(relative(f)) || /^src\/app\/(page|layout|not-found|robots|sitemap)\.tsx?$/.test(relative(f)) || relative(f) === 'src/proxy.ts')
const reachable = new Set()
function walk(file, seen, onVisit) {
  if (seen.has(file)) return
  seen.add(file)
  onVisit?.(file)
  for (const target of edges.get(file) || []) walk(target, seen, onVisit)
}
for (const entry of entries) walk(entry, reachable)
for (const file of files) if (!reachable.has(file)) violations.add('Unreachable source file: ' + relative(file))
for (const client of clients) walk(client, new Set(), file => {
  if (relative(file).startsWith('src/lib/server/') || relative(file).startsWith('src/lib/admin/')) violations.add('Client/server boundary: ' + relative(client) + ' reaches ' + relative(file))
})

const done = new Set()
const stack = []
function cycles(file) {
  if (stack.includes(file)) {
    violations.add('Import cycle: ' + [...stack.slice(stack.indexOf(file)), file].map(relative).join(' → '))
    return
  }
  if (done.has(file)) return
  stack.push(file)
  for (const target of edges.get(file) || []) cycles(target)
  stack.pop()
  done.add(file)
}
for (const entry of entries) cycles(entry)
if (violations.size) {
  console.error(Array.from(violations).join('\n'))
  process.exitCode = 1
} else console.log('Architecture OK: ' + files.length + ' source files, ' + entries.length + ' framework entries; no unreachable files, unresolved local imports, import cycles or client/server boundary violations.')
