// Only import the necessary parts of Monaco Editor to reduce bundle size
// https://github.com/vdesjs/vite-plugin-monaco-editor/blob/master/test/src/mona/customMonaco.ts
import 'monaco-editor/esm/vs/editor/editor.all.js';

import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export { monaco }