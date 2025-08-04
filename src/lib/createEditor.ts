import * as monaco from 'monaco-editor';

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
  language,
}: EditorProps) {
  const model = monaco.editor.createModel(value ?? '', language);

  const editorRef = monaco.editor.create(container, {
    model,
    theme: 'vs-dark',
    automaticLayout: true,
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
      monaco.editor.setModelLanguage(model, language),
  };
}
