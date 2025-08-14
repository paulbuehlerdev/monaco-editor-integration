import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { createEditor, EditorInstance, EditorLanguage } from './createEditor';
import 'monaco-editor/min/vs/editor/editor.main.css';
import './monaco-editor.scss';

export type EditorInitEvent = CustomEvent<EditorInstance>;
export const EditorInitEventName = 'editor-init' as const;

@customElement('monaco-editor')
export class MonacoEditorComponent extends LitElement {
  static get is() {
    return 'monaco-editor';
  }

  @property() language!: EditorLanguage;

  override createRenderRoot() {
    return this;
  }

  editorContainerRef = createRef<HTMLDivElement>();

  override firstUpdated() {
    const container = this.editorContainerRef.value;
    if (!container) {
      console.error('Editor container reference is not set.');
      return;
    }

    const editor = createEditor({
      language: this.language,
      container
    });

    this.dispatchEvent(
      new CustomEvent<EditorInitEvent["detail"]>(EditorInitEventName, {
        detail: editor,
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    return html`
      <div
        class="editor-container"
        ${ref(this.editorContainerRef)}
      ></div>`;
  }
}
