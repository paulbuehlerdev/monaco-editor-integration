import { languages, Range } from 'monaco-editor/esm/vs/editor/editor.api';

export function addCramdownCompletion(getCramdownClasses: () => string[]) {
  function isInsideKramdownAttribute(lineText: string, col: number) {
    const beforeCursor = lineText.substring(0, col);
    return beforeCursor.includes('{:');
  }

  return languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: ['.', '#'],
    provideCompletionItems: function(model, position, context) {
      const lineText = model.getLineContent(position.lineNumber);
      const col = position.column - 1;

      if (!isInsideKramdownAttribute(lineText, col)) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = new Range(
        position.lineNumber,
        word.startColumn - (context.triggerCharacter?.length || 0),
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