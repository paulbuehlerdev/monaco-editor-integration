import { editor, languages, Position, type IDisposable } from 'monaco-editor/esm/vs/editor/editor.api';
import { getSuggestionRange, getSuggestionTrigger } from './monaco-utils';
import ITextModel = editor.ITextModel;

export function addCramdownCompletion({
  getCramdownClasses,
  getCramdownLayouts,
}: {
  getCramdownClasses: () => string[];
  getCramdownLayouts: () => string[];
}): IDisposable {
  function isInsideKramdownAttribute(lineText: string, position: Position) {
    const beforeCursor = lineText.substring(0, position.column - 1);
    return beforeCursor.includes('{:');
  }

  function isCramdownLayout(lineText: string, position: Position) {
    const beforeCursor = lineText.substring(0, position.column - 1);
    return !!beforeCursor.match(/layout=\w*$/);
  }

  function getLine(model: ITextModel, position: Position) {
    return {
      lineText: model.getLineContent(position.lineNumber),
      word: model.getWordUntilPosition(position),
    };
  }

  const cramdownProviderTriggerCharacters = ['.', '#'];
  const cramdownProvider = languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: cramdownProviderTriggerCharacters,
    provideCompletionItems: function (model, position) {
      const { word, lineText } = getLine(model, position);

      if (!isInsideKramdownAttribute(lineText, position) || isCramdownLayout(lineText, position)) {
        return { suggestions: [] };
      }

      const trigger = getSuggestionTrigger(lineText, word, cramdownProviderTriggerCharacters);
      const range = getSuggestionRange(word, position, trigger);

      return {
        suggestions: getCramdownClasses().map((cramdownClass) => ({
          label: cramdownClass,
          kind: languages.CompletionItemKind.Class,
          insertText: cramdownClass,
          detail: `CSS-class ${cramdownClass}`,
          range,
        })),
      };
    },
  });

  const cramdownLayoutProviderTriggerCharacters = ['='];
  const cramdownLayoutProvider = languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: cramdownLayoutProviderTriggerCharacters,
    provideCompletionItems: function (model, position) {
      const { word, lineText } = getLine(model, position);

      if (!isInsideKramdownAttribute(lineText, position) || !isCramdownLayout(lineText, position)) {
        return { suggestions: [] };
      }

      const trigger = getSuggestionTrigger(lineText, word, cramdownLayoutProviderTriggerCharacters);
      const range = getSuggestionRange(word, position, trigger);

      return {
        suggestions: getCramdownLayouts().map((cramdownLayout) => ({
          label: cramdownLayout,
          kind: languages.CompletionItemKind.EnumMember,
          insertText: cramdownLayout,
          detail: `Layout ${cramdownLayout}`,
          range,
        })),
      };
    },
  });

  return {
    dispose() {
      cramdownProvider.dispose();
      cramdownLayoutProvider.dispose();
    },
  };
}
