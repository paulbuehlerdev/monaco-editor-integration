import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { getCSSLanguageService } from 'vscode-css-languageservice';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getSuggestionRange, getSuggestionTrigger } from './monaco-utils';

export function addHtmlStyleCompletions() {
  const cssLanguageService = getCSSLanguageService();

  languages.registerCompletionItemProvider('html', {
    triggerCharacters: [':', ';', ' ', '-'],
    async provideCompletionItems(model, position) {
      const textUntilPos = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const match = textUntilPos.match(/style(?:-\w{2})?\s*=\s*"([^"]*)$/)?.[1];

      if (match === undefined) {
        return { suggestions: [] };
      }

      const cssDoc = TextDocument.create('inmemory://model.css', 'css', 1, `div { ${match} }`);

      const completionList = cssLanguageService.doComplete(
        cssDoc,
        cssDoc.positionAt(cssDoc.getText().length),
        cssLanguageService.parseStylesheet(cssDoc),
      );

      const word = model.getWordUntilPosition(position);
      const trigger = getSuggestionTrigger(textUntilPos, word, [' ', '-', ':', ';']);
      const range = getSuggestionRange(word, position, trigger);

      return {
        suggestions: completionList.items.map((item) => ({
          label: item.label,
          kind: languages.CompletionItemKind.Property,
          insertText: item.insertText || item.label,
          range,
        })),
      };
    },
  });
}
