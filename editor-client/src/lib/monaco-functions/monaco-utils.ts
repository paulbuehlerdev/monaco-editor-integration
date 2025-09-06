import { type editor, Position, Range } from 'monaco-editor/esm/vs/editor/editor.api';

export function getSuggestionTrigger(previousText: string, word: editor.IWordAtPosition, triggerCharacters: string[]) {
  if (word.startColumn <= 1) {
    return null;
  }

  const beforeCursor = previousText.slice(0, word.startColumn - 1);

  return triggerCharacters.find((trigger) => beforeCursor.endsWith(trigger)) ?? null;
}

export function getSuggestionRange(word: editor.IWordAtPosition, position: Position, trigger?: string | null) {
  return new Range(position.lineNumber, word.startColumn - (trigger?.length ?? 0), position.lineNumber, word.endColumn);
}
