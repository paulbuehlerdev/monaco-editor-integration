import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './editor-testbed.scss?inline';

@customElement('editor-testbed')
class EditorTestbed extends LitElement {
  static get is() {
    return 'editor-testbed';
  }

  static override styles = [unsafeCSS(style)];

  override render() {
    return html` <div>editor-testbed</div> `;
  }
}
