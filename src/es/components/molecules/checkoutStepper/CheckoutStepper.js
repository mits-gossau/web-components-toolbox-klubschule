// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class CheckoutStepper extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.steps = CheckoutStepper.parseAttribute(this.getAttribute('steps'))
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.div
  }

  renderCSS () {
    this.css = /* css */ `
      :host(ks-m-checkout-stepper) {
        display: block !important;
        margin: 0 !important;
        width: 100% !important;
        background: var(--mdx-sys-color-accent-6-subtle1);
        padding: var(--mdx-sys-spacing-flex-large-s) var(--mdx-sys-spacing-fix-s);
        border-top: 1px solid var(--mdx-sys-color-neutral-subtle3);
        border-bottom: 1px solid var(--mdx-sys-color-neutral-subtle3);
      }

      .stepper,
      .stepper * {
        box-sizing: border-box;
      }
      .stepper {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        position: relative;
        max-width: var(--body-section-default-width);
        margin: auto;
        flex-wrap: wrap;
      }
      .stepper__step {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        max-width: 18.75rem;

        font-family: var(--mdx-sys-font-fix-body2-font-family);
        font-size: var(--mdx-sys-font-fix-body2-font-size);
        font-weight: var(--mdx-sys-font-fix-body2-font-weight);
        line-height: var(--mdx-sys-font-fix-body2-line-height);
        letter-spacing: var(--mdx-sys-font-fix-body2-letter-spacing);
      }
      .stepper__check {
        flex-shrink: 0;
        width: 1rem;
        height: 1rem;
        position: relative;
        overflow: visible;
      }
      .stepper__line {
        background: var(--mdx-sys-color-neutral-bold1);
        height: 1px;
        min-width: 1rem;
        flex: 1;
      }
      .stepper__step-check {
        color: var(--mdx-sys-color-success-default);
      }
      .stepper__label-done {
        color: var(--mdx-sys-color-success-default);
        text-decoration: none;
      }
      .stepper__label-current {
        color: var(--mdx-sys-color-neutral-default);
        cursor: default;

        font-family: var(--mdx-sys-font-fix-label3-font-family);
        font-size: var(--mdx-sys-font-fix-label3-font-size);
        font-weight: var(--mdx-sys-font-fix-label3-font-weight);
        line-height: var(--mdx-sys-font-fix-label3-line-height);
        letter-spacing: var(--mdx-sys-font-fix-label3-letter-spacing);
      }
      .stepper__label-default {
        color: var(--mdx-sys-color-neutral-bold1);
        cursor: not-allowed;
      }

      @media screen and (max-width: _max-width_) {
        .stepper {
          gap: var(--mdx-sys-spacing-fix-2xs);
          max-width: 100%;
        }
      }
    `
  }

  renderHTML () {
    const labelClassNameMap = {
      current: 'stepper__label-current',
      done: 'stepper__label-done',
      default: 'stepper__label-default'
    }

    this.html = /* html */`
      <div class="stepper">

        ${this.steps?.map((step) => {
          const tag = step.status === 'done' ? 'a' : 'div'
          const href = step.status === 'done' ? `href="${step.link}"` : ''

          return /* html */`
          <div class="stepper__step">
            ${step.status === 'done'
                ? /* html */`
                    <a-icon-mdx class="stepper__step-check" icon-name="Check" size="1rem"></a-icon-mdx>`
                : ''}
            <${tag} class="${labelClassNameMap[step.status]}" ${href}>${step.label}</${tag}>
          </div>
          `
        }).join(
          /* html */`
            <div class="stepper__line"></div>`
        )}
      </div>`

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get div () {
    return this.root.querySelector('div')
  }
}
