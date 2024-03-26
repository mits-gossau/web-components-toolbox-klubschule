// @ts-check
import SystemNotification from '../../web-components-toolbox/src/es/components/molecules/systemNotification/SystemNotification.js'

export default class KsSystemNotification extends SystemNotification {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
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
        background-color: var(--background-color);
        display: block;
        padding: var(--item-padding);
        border-radius: var(--item-border-radius);
      }
      :host .system-notification {
        display: flex;
        gap: var(--icon-spacing);
      }
      :host .description,
      :host .description p,
      :host .icon span {
        font: var(--typography);
      }
      :host .icon {
        margin: auto 0;
        height: ${this.iconSize};
        box-sizing: content-box;
        padding: var(--icon-padding);
        background-color: var(--icon-background-color);
        border: ${this.getAttribute('border-color') ? 'var(--icon-border-width) solid var(--icon-border-color)' : 'unset'};
        border-radius: 3px;
        color: var(--icon-color);
        display: flex;
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    const baseStyles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false,
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true,
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'system-notification-default-':
        const styles = [{
          path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/default-/default-.css`,
          namespace: false
        }, ...baseStyles]
        return this.fetchCSS(styles).then(fetchCSSParams => {
            // make template ${code} accessible aka. set the variables in the literal string
            fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
          })
      default:
        return this.fetchCSS(baseStyles)
    }
  }

  renderHTML () {
    const iconName = this.getAttribute('icon-name') || ''
    const iconBadge = this.getAttribute('icon-badge') || ''
    console.log(iconName, iconBadge)
    const description = this.innerHTML || ''
    this.html = /* html */ `
    <div class="system-notification" role="alert">
      <div class="icon">
        ${iconBadge ? (
          /* html */ `<span>${iconBadge}</span>`
        ) : ''}
        ${iconName ? (
          /* html */ `<a-icon-mdx namespace="icon-mdx-ks-" icon-name="${iconName}" size="${this.iconSize}" />`
        ) : ''}
      </div>
      ${description ? /* html */ `
        <div class="description">${description}</div>
      ` : ''}
    </div>
    `

    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])

  }

  get iconSize() {
    return this.getAttribute('icon-size') || '1em'
  }
}
