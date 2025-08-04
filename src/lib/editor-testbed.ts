import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  EditorInstance,
  EditorLanguage,
  editorLanguages
} from './createEditor';
import { EditorInitEvent, EditorInitEventName } from './monaco-editor';
import './editor-testbed.scss';

const defaultLanguage: EditorLanguage = 'html';

@customElement('editor-testbed')
class EditorTestbed extends LitElement {
  static get is() {
    return 'editor-testbed';
  }

  createRenderRoot() {
    return this;
  }

  @state()
  private editor!: EditorInstance;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener(EditorInitEventName, (e) => {
      const event = e as EditorInitEvent;
      this.editor = event.detail;
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
                html`
                  <option
                    ?selected=${language === defaultLanguage}
                    value="${language}"
                  >
                    ${language}
                  </option>`
            )}
          </select>
        </h2>
        <monaco-editor language="${defaultLanguage}"></monaco-editor>
        ${this.editor &&
        html`
          <div class="controls-container">
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
