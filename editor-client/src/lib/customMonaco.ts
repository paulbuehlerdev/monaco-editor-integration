// Only import the necessary parts of Monaco Editor to reduce bundle size
// https://github.com/vdesjs/vite-plugin-monaco-editor/blob/master/test/src/mona/customMonaco.ts
import 'monaco-editor/esm/vs/editor/editor.all.js';

import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case "html":
        return new HtmlWorker();
      default:
        return new EditorWorker();
    }
  }
};

// when using the editor, import directly from 'monaco-editor/esm/vs/editor/editor.api'
// this allows tree-shaking to work properly