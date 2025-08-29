// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Documents
* @type {CustomElementConstructor}
*/
export default class Documents extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.documents = []
  }

  static get observedAttributes() {
    return ['documents']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'documents') {
      try {
        this.documents = typeof newValue === 'string' ? JSON.parse(newValue) : newValue
      } catch {
        this.documents = []
      }
      this.renderHTML()
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('#documents')
  }

  renderCSS() {
    this.css = /* css */`
      :host #documents table {
        width: calc(100% - 8px);
        border-collapse: collapse;
        background: #fff;
        border-bottom: 1px solid #000;
        font-size: 14px;
      }
      :host #documents tr {
        background: #fff !important;
        border-top: 1px solid #000;
      }
      :host #documents td {
        padding: 8px 0;
        border: none;
        vertical-align: middle;
      }
      :host #documents td:first-child {
        padding-right: 8px;
      }
      :host #documents td:nth-child(2) {
        text-align: right;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: flex-end;
        height: 100%;
      }
      :host #documents td:nth-child(2) a {
        margin-left: 8px;
        display: inline-block;
        margin: 0 -8px 0 0;
        padding: 0 8px;
      }
      :host #documents td:nth-child(2) div {
        height: 100%;
      }
      :host #documents strong {
        font-weight: 500;
      }
    `
  }

  renderHTML() {
    if (!this.documents || !Array.isArray(this.documents) || this.documents.length === 0) {
      this.html = ''
      return
    }
    this.html = /* html */`
      <div id="documents">
        <table>
          ${this.documents.map(doc => /* html */`
            <tr>
              <td><strong>${doc.label || ''}</strong></td>
              <td>
                <span>${doc.type || ''}</span>
                ${doc.url ? /* html */`<a href="${doc.url}" target="_blank" rel="noopener">
                  <a-icon-mdx icon-name="Download" size="1.5em" color="0053a6"></a-icon-mdx>
                </a>` : ''}
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    `
  }

  set documentsData(val) {
    this.documents = val || []
    this.renderHTML()
  }

  get documentsData() {
    return this.documents
  }
}