import * as monaco from 'monaco-editor';

type EditorProps = {
  container: HTMLElement;
  value?: string;
  onChange?: (value: string) => void;
  language: 'markdown' | 'html';
};

export function createEditor({
  container,
  value,
  onChange,
  language,
}: EditorProps) {
  const model = monaco.editor.createModel(value ?? '', 'markdown');

  const editor = monaco.editor.create(container, {
    model,
    language: language,
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
    dispose: () => editor.dispose(),
  };
}
