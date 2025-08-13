import './customMonaco';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { registerCompletion } from 'monacopilot';

const { editor } = monaco;

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

  const completionRegistration = registerCompletion(monaco, editorRef, {
    endpoint: 'http://localhost:3000/completion',
    language: language ?? 'markdown'
  });

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
    completionRegistration.updateOptions((options) => ({
      ...options,
      language
    }));
  };

  return {
    getText: () => model.getValue(),
    setText: (val: string) => model.setValue(val),
    dispose: () => editorRef.dispose(),
    setLanguage,
    getSelectionText
  };
}
