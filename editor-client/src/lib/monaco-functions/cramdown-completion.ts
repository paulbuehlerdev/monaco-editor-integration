import { editor, languages, Position, Range, type IDisposable } from 'monaco-editor/esm/vs/editor/editor.api';
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

  function getTrigger(lineText: string, word: editor.IWordAtPosition) {
    if (word.startColumn <= 1) {
      return null;
    }

    const beforeCursor = lineText.slice(0, word.startColumn - 1);

    return cramdownProviderTriggerCharacters.find((trigger) => beforeCursor.endsWith(trigger)) ?? null;
  }

  function getLine(model: ITextModel, position: Position) {
    return {
      lineText: model.getLineContent(position.lineNumber),
      word: model.getWordUntilPosition(position),
    };
  }

  function getRange(lineText: string, word: editor.IWordAtPosition, position: Position) {
    const trigger = getTrigger(lineText, word);
    return new Range(
      position.lineNumber,
      word.startColumn - (trigger?.length ?? 0),
      position.lineNumber,
      word.endColumn,
    );
  }

  const cramdownProviderTriggerCharacters = ['.', '#'];
  const cramdownProvider = languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: cramdownProviderTriggerCharacters,
    provideCompletionItems: function (model, position) {
      const { word, lineText } = getLine(model, position);

      if (!isInsideKramdownAttribute(lineText, position) || isCramdownLayout(lineText, position)) {
        return { suggestions: [] };
      }

      const range = getRange(lineText, word, position);

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

      const range = getRange(lineText, word, position);

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
