import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import monacoStyle from 'monaco-editor/min/vs/editor/editor.main.css?inline';
import {
  createEditor,
  EditorInstance,
  EditorLanguage,
  editorLanguages,
} from './createEditor';
import style from './editor-testbed.scss?inline';

const defaultLanguage: EditorLanguage = 'html';

@customElement('editor-testbed')
class EditorTestbed extends LitElement {
  static get is() {
    return 'editor-testbed';
  }

  static override styles = [unsafeCSS(style), unsafeCSS(monacoStyle)];

  editorContainerRef = createRef<HTMLDivElement>();

  @state()
  editor!: EditorInstance;

  override firstUpdated() {
    const container = this.editorContainerRef.value;
    if (!container) {
      console.error('Editor container reference is not set.');
      return;
    }

    const editor = createEditor({
      language: defaultLanguage,
      container,
    });

    requestAnimationFrame(() => {
      this.editor = editor;
    });
  }

  @state()
  private textFromEditor: string = '';

  @state()
  private textToEditor: string = '';

  private handleGetTextFromEditor() {
    this.textFromEditor = this.editor?.getText();
  }

  private handleSetEditorLanguage(e: Event) {
    const language = (e.target as HTMLSelectElement).value;
    this.editor.setLanguage(language);
  }

  private handleSetTextToEditor() {
    this.editor.setText(this.textToEditor);
  }

  override render() {
    return html`
      <div class="testbed-container">
        <h2 class="testbed-title">
          <span> Editor Testbed </span>

          <select @change=${this.handleSetEditorLanguage}>
            ${editorLanguages.map(
              (language) =>
                html` <option
                  ?selected=${language === defaultLanguage}
                  value="${language}"
                >
                  ${language}
                </option>`,
            )}
          </select>
        </h2>
        <div class="editor-container" ${ref(this.editorContainerRef)}></div>
        ${this.editor &&
        html` <div class="controls-container">
          <textarea
            disabled
            .value=${this.textFromEditor}
            @input=${(e: Event) =>
              (this.textFromEditor = (e.target as HTMLTextAreaElement).value)}
            rows="5"
          ></textarea>
          <button
            class="btn btn-secondary"
            @click=${this.handleGetTextFromEditor}
          >
            Get text from editor
          </button>
          <textarea
            .value=${this.textToEditor}
            @input=${(e: Event) =>
              (this.textToEditor = (e.target as HTMLTextAreaElement).value)}
            rows="5"
          ></textarea>
          <button
            class="btn btn-secondary"
            @click=${this.handleSetTextToEditor}
          >
            Set text to editor
          </button>
        </div>`}
      </div>
    `;
  }
}
