// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class ContentStage extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
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
        :host {}
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
    this.html = ''
    // const fetchModules = this.fetchModules([
    //   {
    //     path: `${this.importMetaUrl}'../../../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
    //     name: 'a-grid'
    //   }
    // ])

    const title = this.root.querySelector('h1').innerText;
    const subtitle = this.root.querySelector('p').innerText;
    const imageSrc = this.getAttribute('image-src');

    this.html = /* html */ `
        <o-grid namespace="grid-2colums2rows-" first-container-vertical first-column-with="66%" style="background-color:#0053A6; margin: 0; width: 100%;">
            <section>
                <div style="display: contents; color: white; height: auto; margin: 3rem 1rem 2rem calc(4rem/3);">
                    <h1 style="color: white; line-height: 1.5; margin-top: 1rem; margin-bottom: 32px; font-size: calc(8em/3);">${title}</h1>
                    <p style="font-size: calc(10em/9);">${subtitle}</p>
                </div>
                <aside>
                    <div slot="image" style="background-image:url('${imageSrc}'); background-position: center center; background-size: cover; height:100%; min-height: 280px;"></div>
                </aside>
            </section>
        </o-grid>
    `

    Array.from(this.root.children).forEach(node => {
      this.list.appendChild(node)
    })
  }
}
