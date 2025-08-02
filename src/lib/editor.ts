import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './editor.scss?inline';

@customElement('nte-editor')
class Editor extends LitElement {
  static get is() {
    return 'nte-editor';
  }

  static override styles = [unsafeCSS(style)];

  override render() {
    return html` <div>hello world</div> `;
  }
}
