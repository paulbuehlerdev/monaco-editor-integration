import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { IDisposable, Selection } from 'monaco-editor';
import { EditorInstance, EditorLanguage, editorLanguages } from './createEditor';
import './editor-testbed.scss';
import { EditorInitEvent, EditorInitEventName } from './monaco-editor';

const defaultLanguage: EditorLanguage = 'html';

@customElement('editor-testbed')
class EditorTestbed extends LitElement {
  static get is() {
    return 'editor-testbed';
  }

  override createRenderRoot() {
    return this;
  }

  @state()
  private editor!: EditorInstance;

  private selectionChangesSubscription: IDisposable | null = null;

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(EditorInitEventName, (e) => {
      const event = e as EditorInitEvent;
      this.editor = event.detail;

      this.editor.subscribeToSelectionChanges((text, selection) => {
        this.selectionText = text ?? '';
        this.selectionState = selection;
      });

      this.editor.subscribeToCurrentLineChanges((lineContent) => {
        const match = lineContent.match(/!\[.*?]\((.*?)(?:\s+".*?")?\)/);
        this.currentImagePreview = match?.[1] ?? null;
      });

      this.editor.registerCramdownCompletion({
        getCramdownClasses: () => {
          return Array.from(this.cssClassesText.matchAll(/\.\w+/g), (m) => m[0]);
        },
        getCramdownLayouts: () => {
          return Array.from(this.cssClassesText.matchAll(/(^\w+)|(\s\w+)/g), (m) => m[0]?.trim());
        },
      });
    });
  }

  override disconnectedCallback() {
    this.selectionChangesSubscription?.dispose();
  }

  @state()
  private textFromEditor: string = '';

  @state()
  private textToEditor: string = '';

  @state()
  private selectionText: string = '';

  @state()
  private selectionState: Selection | null = null;

  @state()
  private currentImagePreview: string | null = null;

  @state()
  private cssClassesText: string = '';

  private handleGetTextFromEditor() {
    this.textFromEditor = this.editor?.getText();
  }

  private handleSetEditorLanguage(e: Event) {
    const language = (e.target as HTMLSelectElement).value as EditorLanguage;
    this.editor.setLanguage(language);
  }

  private handleSetTextToEditor() {
    this.editor.setText(this.textToEditor);
  }

  private handleToggleCompletions(enabled: boolean) {
    if (enabled) {
      this.editor.enableCompletions();
    } else {
      this.editor.disableCompletions();
    }
  }

  override render() {
    return html`
      <div class="testbed-container">
        <div class="testbed-title">
          <h2>Editor Testbed</h2>

          <select @change=${this.handleSetEditorLanguage}>
            ${editorLanguages.map(
              (language) =>
                html` <option ?selected=${language === defaultLanguage} value="${language}">${language}</option>`,
            )}
          </select>

          <label>
            <input
              type="checkbox"
              @click=${(e: Event) => this.handleToggleCompletions((e.target as HTMLInputElement).checked)}
            />
            Enable Copilot
          </label>
        </div>
        <monaco-editor language="${defaultLanguage}"></monaco-editor>
        ${this.editor &&
        html` <div class="controls-container">
          <textarea
            disabled
            .value=${this.textFromEditor}
            @input=${(e: Event) => (this.textFromEditor = (e.target as HTMLTextAreaElement).value)}
            rows="4"
          ></textarea>
          <button class="btn btn-secondary" @click=${this.handleGetTextFromEditor}>Get text from editor</button>

          <textarea
            .value=${this.textToEditor}
            @input=${(e: Event) => (this.textToEditor = (e.target as HTMLTextAreaElement).value)}
            rows="4"
          ></textarea>
          <button class="btn btn-secondary" @click=${this.handleSetTextToEditor}>Set text to editor</button>

          <textarea
            disabled
            .value=${this.selectionText}
            @input=${(e: Event) => (this.selectionText = (e.target as HTMLTextAreaElement).value)}
            rows="4"
          ></textarea>
          <div class="stack">
            <span> Current selection </span>
            <span>
              ${this.selectionState && !this.selectionState.isEmpty()
                ? `Line: ${this.selectionState.startLineNumber}, Column: ${this.selectionState.startColumn} - Line: ${this.selectionState.endLineNumber}, Column: ${this.selectionState.endColumn}`
                : 'No selection'}
            </span>
          </div>

          ${this.currentImagePreview
            ? html`<img class="preview-image" alt="preview image" src="${this.currentImagePreview}" />`
            : html` <div class="preview-image"></div>`}

          <div class="stack">
            <span>Current image preview</span>
            <span>Click inside markdown image to preview</span>
          </div>

          <textarea
            .value=${this.cssClassesText}
            @input=${(e: Event) => (this.cssClassesText = (e.target as HTMLTextAreaElement).value)}
            rows="2"
          ></textarea>

          <div class="stack">
            <span>Cramdown autocompletion</span>
            <span>Add css classes</span>
            <span>Add html tags for layout=</span>
          </div>
        </div>`}
      </div>
    `;
  }
}
