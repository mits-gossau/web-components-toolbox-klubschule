// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class ContentStage extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.title = this.querySelector('h1').innerText
    this.subtitle = this.querySelector('p').innerText
    this.imageSrc = this.getAttribute('image-src')
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.renderHTML()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
            background-color:#0053A6; 
            margin: 0; 
            width: 100%;
        }
        :host section > div {
            display: contents; 
            color: white; 
            height: auto; 
            margin: 3rem 1rem 2rem calc(4rem/3);
        }
        :host h1 {
            color: white; 
            line-height: 1.5; 
            font-size: calc(8em/3);
            margin-top: 1rem; 
            margin-bottom: 32px; 
        }
        :host p {
            font-size: calc(10em/9);
        }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'content-stage-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }
        ])
      default:
    }
  }

  renderHTML () {
    // this.html = ''

    this.html = /* html */ `
        <o-grid namespace="grid-2colums2rows-" first-container-vertical first-column-with="66%">
            <section>
                <div has-background>
                    <h1>${this.title}</h1>
                    <p>${this.subtitle}</p>
                </div>
                <aside>
                    <div slot="image" style="background-image:url('${this.imageSrc}'); background-position: center center; background-size: cover; height:100%; min-height: 280px;"></div>
                </aside>
            </section>
        </o-grid>
    `
  }
}
