// @ts-check
import SystemNotification from '../../web-components-toolbox/src/es/components/molecules/systemNotification/SystemNotification.js'

export default class KsSystemNotification extends SystemNotification {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  shouldRenderHTML () {
    return !this.root.querySelector('.system-notification')
  }

  renderCSS () {
    this.css = /* css */ `
      :host {
        background-color: var(--background-color);
        display: block;
        padding: var(--item-padding);
        border-radius: var(--item-border-radius);
      }
      :host .close-btn {
        position: absolute;
        top: -5px;
        right: -5px;
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        color: var(--icon-color, #333);
        cursor: pointer;
        z-index: 2;
      }
      :host .system-notification {
        position: relative;
        display: flex;
        gap: var(--icon-spacing);
      }
      :host .description {
        margin: auto 0;
      }
      :host .description,
      :host .description p,
      :host .icon span {
        font: var(--typography);
      }
      :host .icon {
        margin: auto 0;
        height: var(--icon-size);
        width: var(--icon-size);
        box-sizing: content-box;
        padding: var(--icon-padding);
        background-color: ${this.hasAttribute('with-icon-background') ? 'var(--icon-background-color)' : 'transparent'};
        border: var(--icon-border-width) solid ${this.hasAttribute('no-border') ? 'transparent' : 'var(--icon-border-color)'};
        border-radius: 3px;
        color: var(--icon-color);
        display: flex;
      }
      :host([icon-blue]) .icon {
        height: var(--icon-size-custom, var(--icon-size));
        width: var(--icon-size-custom, var(--icon-size));
        padding: 0;
        background-color: transparent;
        border: 0 none;
        border-radius: 0;        
      }
      :host([icon-blue]) .icon a-icon-mdx {
        cursor: auto;
      }
      :host([icon-blue]) .icon a-icon-mdx svg {
        fill: var(--mdx-sys-color-primary-subtle1);
      }
      :host .description .notification-title {
        font-weight: 500; 
        font-size: 1.5rem; 
        margin-bottom: 1rem;
      }
      :host .description .notification-text {
        font-size: 1rem;
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    const baseStyles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    let allStyles
    switch (this.getAttribute('namespace')) {
      case 'system-notification-default-':
        allStyles = [{
          path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/default-/default-.css`,
          namespace: false
        }, ...baseStyles]

        return this.fetchCSS(allStyles).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
        })
      case 'system-notification-error-':
        allStyles = [
          {
            path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false,
            replaces: [{
              pattern: '--system-notification-default-',
              flags: 'g',
              replacement: '--system-notification-error-'
            }]
          },
          {
            path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/error-/error-.css`,
            namespace: false
          },
          ...baseStyles
        ]

        return this.fetchCSS(allStyles).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
        })
      case 'system-notification-neutral-':
        allStyles = [
          {
            path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false,
            replaces: [{
              pattern: '--system-notification-default-',
              flags: 'g',
              replacement: '--system-notification-neutral-'
            }]
          },
          {
            path: `${this.importMetaUrl}../../../../../../molecules/systemNotification/neutral-/neutral-.css`,
            namespace: false
          },
          ...baseStyles
        ]

        return this.fetchCSS(allStyles).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
        })
      default:
        return this.fetchCSS(baseStyles)
    }
  }

  renderHTML () {
    const isCloseable = this.hasAttribute('is-closeable')
    const isIconPlain = this.hasAttribute('icon-plain')
    const iconName = this.getAttribute('icon-name') || ''
    const iconBadge = this.getAttribute('icon-badge') || ''
    const iconSize = this.getAttribute('icon-size') || '1em'
    const iconNamespace = this.hasAttribute('icon-blue') ? 'icon-mdx-ks-blue-' : 'icon-mdx-ks-'
    const description = this.innerHTML || ''

    this.html = /* html */ `
    <div class="system-notification" role="alert">
      ${isCloseable ? /* html */ `<button class="close-btn" type="button" aria-label="Schliessen">&times;</button>` : ''}
      ${isIconPlain ? /* html */ `<span><a-icon-mdx icon-name="${iconName}" size="${iconSize}" /></span>` : this.getIconHTML({ iconBadge, iconName, iconNamespace, iconSize })}
      ${description ? /* html */ `<div class="description">${description}</div>` : ''}
    </div>
    `

    setTimeout(() => {
      const btn = this.root.querySelector('.close-btn')
      if (btn) btn.addEventListener('click', () => {this.style.display = 'none', this.dispatchEvent(new CustomEvent('close-notification', { bubbles: true, composed: true }))})
    }, 0)

    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  getIconHTML({ iconBadge, iconName, iconNamespace, iconSize }) {
    if (!iconBadge && !iconName) return ''
    return /* html */`
      <div class="icon">
        ${iconBadge ? `<span>${iconBadge}</span>` : ''}
        ${iconName ? `<a-icon-mdx namespace="${iconNamespace}" icon-name="${iconName}" size="${iconSize}" />` : ''}
      </div>
    `
  }

  get iconSize () {
    return this.getAttribute('icon-size') || '1em'
  }
}
