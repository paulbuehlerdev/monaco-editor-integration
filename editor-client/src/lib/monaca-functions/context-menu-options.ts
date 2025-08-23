import { editor, Range } from 'monaco-editor/esm/vs/editor/editor.api';

export function addContextMenuOptions(editor: editor.IStandaloneCodeEditor) {
  return editor.addAction({
    id: 'insert-smiley',
    label: '😊 Smiley einfügen',
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.5,
    run: function(ed) {
      const pos = ed.getPosition();
      if (!pos) {
        return;
      }

      ed.executeEdits('', [{
        range: new Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
        text: '😊'
      }]);
    }
  });
}