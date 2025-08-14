import './customMonaco';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { CompletionRegistration, registerCompletion } from 'monacopilot';

const { editor } = monaco;

export const editorLanguages = ['markdown', 'html'] as const;
export type EditorLanguage = (typeof editorLanguages)[number];

type EditorProps = {
  container: HTMLElement;
  value?: string;
  onChange?: (value: string) => void;
  language: EditorLanguage;
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

  editorRef.addAction({
    id: 'insert-smiley',
    label: '😊 Smiley einfügen',
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.5,
    run: function(ed) {
      const pos = ed.getPosition();
      if (!pos) {
        return;
      }

      ed.executeEdits('', [{
        range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
        text: '😊'
      }]);
    }
  });

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

    completionRegistration?.updateOptions((options) => ({
      ...options,
      language
    }));
  };

  const enableCompletions = () => {
    if (completionRegistration) {
      return;
    }

    completionRegistration = registerCompletion(monaco, editorRef, {
      endpoint: 'http://localhost:4100/completion',
      language
    });
  };

  const disableCompletions = () => {
    if (!completionRegistration) {
      return;
    }

    completionRegistration.deregister();
    completionRegistration = null;
  };

  return {
    getText: () => model.getValue(),
    setText: (val: string) => model.setValue(val),
    dispose: () => editorRef.dispose(),
    setLanguage,
    getSelectionText,
    enableCompletions,
    disableCompletions
  };
}
