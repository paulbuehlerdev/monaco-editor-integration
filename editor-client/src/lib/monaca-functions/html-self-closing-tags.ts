import { editor, Selection } from 'monaco-editor/esm/vs/editor/editor.api';

// https://github.com/microsoft/monaco-editor/issues/221#issuecomment-1625456462

export function addHtmlSelfClosingTags(editorRef: editor.IStandaloneCodeEditor) {
  return editorRef.onKeyDown((event) => {
    const enabledLanguages = ['html', 'markdown', 'javascript', 'typescript']; // enable js & ts for jsx & tsx

    const model = editorRef.getModel();
    if (!model || !enabledLanguages.includes(model.getLanguageId())) {
      return;
    }

    const isSelfClosing = (tag: string) =>
      [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
        'circle',
        'ellipse',
        'line',
        'path',
        'polygon',
        'polyline',
        'rect',
        'stop',
        'use'
      ].includes(tag);

    // when the user enters '>'
    if (event.browserEvent.key === '>') {
      const currentSelections = editorRef.getSelections() ?? [];

      const edits: editor.IIdentifiedSingleEditOperation[] = [];
      const newSelections: Selection[] = [];
      // potentially insert the ending tag at each of the selections
      for (const selection of currentSelections) {
        // shift the selection over by one to account for the new character
        newSelections.push(
          new Selection(
            selection.selectionStartLineNumber,
            selection.selectionStartColumn + 1,
            selection.endLineNumber,
            selection.endColumn + 1
          )
        );
        // grab the content before the cursor
        const contentBeforeChange = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn
        });

        // if ends with a HTML tag we are currently closing
        const match = contentBeforeChange.match(/<([\w-]+)(?![^>]*\/>)[^>]*$/);
        if (!match) {
          continue;
        }

        const [fullMatch, tag] = match;

        // skip self-closing tags like <br> or <img>
        if (isSelfClosing(tag) || fullMatch.trim().endsWith('/')) {
          continue;
        }

        // add in the closing tag
        edits.push({
          range: {
            startLineNumber: selection.endLineNumber,
            startColumn: selection.endColumn + 1, // add 1 to offset for the inserting '>' character
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 1
          },
          text: `</${tag}>`
        });
      }

      // wait for next tick to avoid it being an invalid operation
      setTimeout(() => {
        editorRef.executeEdits(model.getValue(), edits, newSelections);
      }, 0);
    }
  });
}