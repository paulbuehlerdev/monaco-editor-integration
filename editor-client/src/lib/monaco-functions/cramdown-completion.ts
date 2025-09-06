import { languages, Range } from 'monaco-editor/esm/vs/editor/editor.api';

export function addCramdownCompletion(getCramdownClasses: () => string[]) {
  function isInsideKramdownAttribute(lineText: string, col: number) {
    const beforeCursor = lineText.substring(0, col);
    return beforeCursor.includes('{:');
  }

  const triggerCharacters = ['.', '#'];

  return languages.registerCompletionItemProvider('markdown', {
    triggerCharacters,
    provideCompletionItems: function(model, position) {
      const lineText = model.getLineContent(position.lineNumber);
      const col = position.column - 1;

      if (!isInsideKramdownAttribute(lineText, col)) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);

      function getTrigger() {
        const triggerChar = word.startColumn > 1
          ? lineText.charAt(word.startColumn - 2) // -2 because Monaco cols are 1-based
          : null;

        return triggerChar && triggerCharacters.includes(triggerChar) ? triggerChar : null;
      }

      const trigger = getTrigger();

      const range = new Range(
        position.lineNumber,
        word.startColumn - (trigger?.length ?? 0),
        position.lineNumber,
        word.endColumn
      );

      return {
        suggestions:
          getCramdownClasses().map(cramdownClass => ({
            label: cramdownClass,
            kind: languages.CompletionItemKind.Class,
            insertText: cramdownClass,
            detail: `CSS-class ${cramdownClass}`,
            range
          }))
      };
    }
  });
}