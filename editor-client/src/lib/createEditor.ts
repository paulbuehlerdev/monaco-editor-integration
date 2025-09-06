import './customMonaco';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { CompletionRegistration, registerCompletion } from 'monacopilot';
import { addContextMenuOptions } from './monaco-functions/context-menu-options';
import { addCramdownCompletion } from './monaco-functions/cramdown-completion';
import { addHtmlSelfClosingTags } from './monaco-functions/html-self-closing-tags';
import { addHtmlStyleCompletions } from './monaco-functions/html-style-completions';
import { addMarkdownFolding } from './monaco-functions/markdown-folding';

const { editor } = monaco;

export const editorLanguages = ['markdown', 'html', 'typescript'] as const;
export type EditorLanguage = (typeof editorLanguages)[number];

type EditorProps = {
  container: HTMLElement;
  value?: string;
  onChange?: (value: string) => void;
  language: EditorLanguage;
};

export type EditorInstance = ReturnType<typeof createEditor>;

addMarkdownFolding();
addHtmlStyleCompletions();

export function createEditor({ container, value, onChange, language }: EditorProps) {
  const model = editor.createModel(value ?? '', language);

  const editorRef = editor.create(container, {
    model,
    theme: 'vs-dark',
    automaticLayout: true,
  });

  addHtmlSelfClosingTags(editorRef);
  addContextMenuOptions(editorRef);

  let completionRegistration: CompletionRegistration | null = null;

  model.onDidChangeContent(() => {
    const text = model.getValue();
    onChange?.(text);
  });

  const getSelectionText = () => {
    const selection = editorRef.getSelection();
    if (!selection) {
      return '';
    }

    return model.getValueInRange(selection);
  };

  const setLanguage = (language: EditorLanguage) => {
    editor.setModelLanguage(model, language);
    if (completionRegistration) {
      // reinit the completions for the new language
      enableCompletions();
    }
  };

  const enableCompletions = () => {
    disableCompletions();

    completionRegistration = registerCompletion(monaco, editorRef, {
      endpoint: 'http://localhost:4100/completion',
      language: model.getLanguageId(),
    });
  };

  const disableCompletions = () => {
    if (!completionRegistration) {
      return;
    }

    completionRegistration.deregister();
    completionRegistration = null;
  };

  const subscribeToSelectionChanges = (callback: (text: string, selection: monaco.Selection) => void) => {
    return editorRef.onDidChangeCursorSelection((event) => {
      const selection = event.selection;

      const selectedText = model.getValueInRange(selection);
      callback(selectedText, selection);
    });
  };

  const subscribeToCurrentLineChanges = (callback: (lineContent: string) => unknown) => {
    return editorRef.onDidChangeCursorPosition((e) => callback(model.getLineContent(e.position.lineNumber)));
  };

  const registerCramdownCompletion: typeof addCramdownCompletion = (props) => {
    return addCramdownCompletion(props);
  };

  return {
    getText: () => model.getValue(),
    setText: (val: string) => model.setValue(val),
    dispose: () => editorRef.dispose(),
    setLanguage,
    getSelectionText,
    enableCompletions,
    disableCompletions,
    subscribeToSelectionChanges,
    subscribeToCurrentLineChanges,
    registerCramdownCompletion,
  };
}
