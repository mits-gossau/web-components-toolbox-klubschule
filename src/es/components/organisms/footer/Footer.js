import Footer from '../../web-components-toolbox/src/es/components/organisms/footer/Footer.js'

export default class KsFooter extends Footer {
  constructor (options = {}, ...args) {
    super({
      ...options
    }, ...args)
  }

  /**
     * fetches the template
     *
     * @return {Promise<void>}
     */
  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false,
        maxWidth: this.getMobileBreakpoint({})
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true,
        maxWidth: this.getMobileBreakpoint({})
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'footer-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../../../organisms/footer/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
     * renders the m-Teaser css
     *
     * @return {Promise<void>}
     */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */`
            :host {
                display: flex;
                flex-direction: column-reverse;
            }
            :host ks-a-button {
                margin-left: auto;
                padding: 24px;
                width: fit-content;
            }
            :host footer ks-a-button {
                padding: 0;
                width: 100%;
            }
            :host footer ks-a-button:not(:last-child) {
                margin: 16px 0;
            }                
            :host > footer > * {
                margin: 0;
            }
            :host > footer .invert {
                margin: unset;
                padding: var(--content-spacing-mobile) var(--legal-flex-spacing-vertical) 0;
                width: 67%;
            }
            :host > footer .invert.footer-links {
                padding: var(--content-spacing-mobile) var(--content-spacing) 0;
            }
            :host > footer .invert > * {
                margin: 0;
            }
            :host footer>div:first-child {
                display: flex;
                margin: 0;
                width: 100%;
            }
            :host footer>div:first-child .footer-links {
                background-color: var(--legal-background-color);
                text-align: center;
                width: 33%;
                border-left: var(--column-border-width) var(--column-border-color) solid;
            }
            :host footer>div:first-child>.footer-links>div>* {
                text-align: center;
            }
            :host footer>div:first-child>.footer-links>div {
                width: 100%;
            }
            :host footer>div:first-child>.footer-links>div:first-child>*:first-child {
                color: var(--social-headline-color);
                font: var(--social-headline-typography);
            }
            :host footer>div:first-child .footer-links>div:last-child {
                margin: 64px 0 0 0;
            }
            :host footer>div:first-child .footer-links>div:last-child>div,
            :host footer>div:first-child>div.invert>o-wrapper+div>ul>li a {
                color: var(--social-body-color);
                font: var(--social-body-typography);
            }
            :host > footer>div:first-child>.footer-links ul {
                display: flex;
                flex-direction: row;
                margin: var(--legal-spacing-vertical) auto auto;
                width: fit-content;
            }
            :host > footer>div:first-child>.footer-links>div>ul.social-links>li {
                padding: 0;
            }
            :host footer>div:first-child>.footer-links>div>ul.social-links>li:not(:last-child) {
                margin-right: var(--icon-spacing);
            }
            :host footer>div:first-child>div.invert>div>ul>li {
                color: var(--social-body-color);
                list-style: none;
                margin-right: var(--icon-spacing);
                width: fit-content;
            }
            :host footer>div:first-child>div.invert>div>ul>li>a {
                color: var(--social-body-color)
            }
            :host footer>div:first-child>div.invert>o-wrapper,
            :host footer>div:first-child>div.invert>o-wrapper+div {
                width: 100%;
            }
            :host footer>div:first-child>div.invert>o-wrapper+div>ul {
                border-top: 1px solid var(--legal-links-border);
                display: flex;
                flex-direction: row;
                margin-top: var(--content-spacing-mobile);
                margin-bottom: 0;
                padding: var(--legal-links) 0;
            }
            :host footer>div:last-child {
                padding: var(--content-spacing) var(--legal-flex-spacing-vertical);
                width: 100%;
            }
            :host footer>div:last-child .footer-links > .has-copyright > li:last-child {
                margin-left: auto;
            }
            :host footer>div:last-child .footer-links > .has-copyright > li:first-child {
                padding-left: 0;
            }
            :host footer>div:last-child>.footer-links>ul.has-copyright>li>p {
                margin-bottom: 0;
            }
            :host footer>div:last-child p,
            :host footer>div:last-child a, 
            :host footer>div:last-child li {
                font: var(--legal-font);
            }
            :host footer>div:last-child a {
                color: var(--legal-link-color)
            }
            @media only screen and (max-width: _max-width_) {
                :host footer .invert {
                    padding: var(--content-spacing-mobile) var(--content-spacing-mobile-vertical);
                    width: 100%;
                }
                :host > footer .invert.footer-links {
                    padding: var(--content-spacing-mobile) var(--content-spacing);
                }
                :host footer>div:first-child .invert:first-child {
                    padding: var(--wrapper-spacing) var(--content-spacing) 0 var(--content-spacing);
                }
                :host footer>div:first-child ks-a-button:not(:last-child) {
                    margin: 0 0 var(--social-button-spacing) 0;
                }
                :host footer>div:first-child .footer-links {
                    width: 100%;
                    border-left: 0;
                    border-bottom: var(--column-border-width) solid var(--column-border-color);
                }
                :host footer>div:first-child {
                    flex-direction: column-reverse;
                }
                :host footer>div:first-child>div div {
                    margin: 0;
                }
                :host footer>div:first-child>div.invert>o-wrapper+div>ul {
                    padding: var(--legal-spacing-vertical) 0;
                }
                :host footer>div:first-child .footer-links>div>h4{
                    margin: 0 0 var(--h4-margin-mobile) 0;
                }
                :host footer>div:first-child .footer-links .social-links {
                    padding: 0;
                }
                :host footer>div:last-child {
                    margin: var(--content-spacing);
                    padding: 0;
                    width: calc(100% - 2 * var(--content-spacing));
                }
                :host footer>div:last-child ul.has-copyright {
                    padding: 12px 0;
                }
                :host footer>div:last-child .footer-links > .has-copyright > li:last-child {
                    margin-top: var(--content-accordion-item-spacing);
                }
                :host footer>div:last-child .footer-links > ul > li:first-child {
                    margin: auto 0 30px;
                }
                :host > footer o-wrapper[namespace=footer-default-] {
                    margin: 0;
                }
                :host > footer>div>div>* {
                    --content-width-mobile: 100%;
                }
            }
        `
    // return this.fetchTemplate() // dont fetch a second time, since super.renderCSS already calls fetchTemplate
    return result
  }

  renderHTML () {
    super.renderHTML()
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../../../../../atoms/button/Button.js`,
        name: 'ks-a-button'
      }
    ]).then(([iconMdx, button]) => {
      // Add toTheTop Button
      const toTheTopButton = new button.constructorClass({ namespace: 'button-primary-' }) // eslint-disable-line
      toTheTopButton.setAttribute('icon', true)
      toTheTopButton.setAttribute('color', 'secondary')

      const icon = new iconMdx.constructorClass() // eslint-disable-line
      icon.setAttribute('icon-name', 'ArrowUp')
      icon.setAttribute('size', '1rem')

      toTheTopButton.root.appendChild(icon)
      toTheTopButton.addEventListener('click', () => window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      }))

      this.root.appendChild(toTheTopButton)
      // Overwrite ordering by super footer.js
      const copyrightTag = this.root.querySelector('.copyright')
      copyrightTag && copyrightTag.classList.remove('copyright')
    })
  }

  /**
     * should actually be done with the template for o-wrapper namespace="footer-default-" but this has already been done within the razor template, this fix should work without any razor adjustments
     *
     * @param {HTMLElement[] & any} wrappers
     * @returns {HTMLElement[]}
     */
  injectCssIntoWrappers (wrappers) {
    wrappers.forEach(wrapper => wrapper.setCss(/* css */`
            ${this.injectCssIntoWrapperAndDetails()}
            :host m-details {
                --details-default-icon-right-border-bottom-last: var(--footer-default-border-width) solid;
                --details-default-icon-right-border-color-last: var(--footer-default-border-color);
            }
            :host .footer-links-row ul {
                margin-bottom: 0;
            }
            :host .footer-links-row ul.bull li::before {
                background-color: transparent;
                border: 0;
            }
            :host .footer-links-row h4 {
                color: var(--footer-default-social-headline-color);
                font: var(--footer-default-content-accordion-typography);
                margin-bottom: var(--footer-default-legal-links);
            }
            `, undefined, false))

    return wrappers
  }

  injectCssIntoWrapperAndDetails () {
    return /* css */ `
        ${super.injectCssIntoWrapperAndDetails()}
      
        :host {
            --details-default-icon-right-font-weight-strong: normal;
            --details-default-icon-right-icon-width-mobile: var(--details-default-icon-right-icon-width-mobile-custom, var(--footer-default-content-spacing));
        }
        :host .footer-links-row li:not(:last-child) {
            margin-bottom: var(--footer-default-list-item-spacing);
        }
        :host .footer-links-row li > a {
            display: inline-block;
            align-items: center;
            gap: 0.125em;
            flex-wrap: nowrap;
        }
        :host .footer-links-row li > a > a-icon-mdx {
            --icon-mdx-svg-display: block;
            display: inline-block;
            margin-bottom: -0.2em;
        }
    `
  }
}
