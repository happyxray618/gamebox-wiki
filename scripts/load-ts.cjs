// Minimal TypeScript loader for local validation scripts, using the installed compiler.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...args) {
  if (request.startsWith('@/')) request = path.join(__dirname, '..', request.slice(2));
  return originalResolve.call(this, request, parent, ...args);
};
require.extensions['.ts'] = function(module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  module._compile(output, filename);
};
