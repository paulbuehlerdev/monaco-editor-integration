import 'monaco-editor/esm/vs/editor/editor.all.js';

import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';

import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import 'monaco-editor/esm/vs/language/css/monaco.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

export const editorLanguages = ['markdown', 'html'] as const;
export type EditorLanguage = (typeof editorLanguages)[number];

type EditorProps = {
  container: HTMLElement;
  value?: string;
  onChange?: (value: string) => void;
  language?: EditorLanguage;
};

export type EditorInstance = ReturnType<typeof createEditor>;

export function createEditor({
                               container,
                               value,
                               onChange,
                               language
                             }: EditorProps) {
  const model = editor.createModel(value ?? '', language);

  const editorRef = editor.create(container, {
    model,
    theme: 'vs-dark',
    automaticLayout: true
  });

  model.onDidChangeContent(() => {
    const text = model.getValue();
    onChange?.(text);
  });

  return {
    getText: () => model.getValue(),
    setText: (val: string) => model.setValue(val),
    dispose: () => editorRef.dispose(),
    setLanguage: (language: EditorLanguage) =>
      editor.setModelLanguage(model, language)
  };
}
