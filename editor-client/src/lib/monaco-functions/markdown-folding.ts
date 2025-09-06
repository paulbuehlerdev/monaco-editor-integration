import { languages } from 'monaco-editor/esm/vs/editor/editor.api';

export function addMarkdownFolding() {
  languages.registerFoldingRangeProvider('markdown', {
    provideFoldingRanges(model) {
      const ranges = [];
      const lines = model.getLineCount();

      for (let lineNumber = 1; lineNumber <= lines; lineNumber++) {
        const lineContent = model.getLineContent(lineNumber);
        const headingMatch = /^(#{1,6})\s+/.exec(lineContent);

        if (headingMatch) {
          const level = headingMatch[1].length;
          let endLine = lineNumber + 1;

          // Look ahead until a heading of same or higher level is found
          while (endLine <= lines) {
            const nextLine = model.getLineContent(endLine);
            const nextHeading = /^(#{1,6})\s+/.exec(nextLine);

            if (nextHeading && nextHeading[1].length <= level) {
              break;
            }
            endLine++;
          }

          if (endLine - 1 > lineNumber) {
            ranges.push({
              start: lineNumber,
              end: endLine - 1,
              kind: languages.FoldingRangeKind.Region
            });
          }
        }
      }

      return ranges;
    }
  });
}