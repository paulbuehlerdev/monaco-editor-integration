import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import monacoStyle from 'monaco-editor/min/vs/editor/editor.main.css?inline';
import { createEditor, EditorInstance } from './createEditor';
import style from './editor-testbed.scss?inline';

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

    this.editor = createEditor({
      container,
    });
  }

  @state()
  private textFromEditor: string = '';

  private handleGetTextFromEditor() {
    this.textFromEditor = this.editor?.getText();
  }

  override render() {
    return html`
      <div class="testbed-container">
        <h2>Editor Testbed</h2>
        <div class="editor-container" ${ref(this.editorContainerRef)}></div>

        ${
          this.editor &&
          html` <div class="controls-container">
            <textarea
              disabled
              .value=${this.textFromEditor}
              @input=${(e: Event) =>
                (this.textFromEditor = (e.target as HTMLTextAreaElement).value)}
              rows="5"
              cols="30"
            ></textarea>
            <button @click=${this.handleGetTextFromEditor}>
              Get text from editor
            </button>
          </div>`
        }
      </div>
      </div>
    `;
  }
}
