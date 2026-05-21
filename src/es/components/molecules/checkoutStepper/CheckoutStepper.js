// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */
/* global window */

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
      `${this.cssSelector} > style[_css]`
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
        padding: 0;
        list-style: none;
      }
      .stepper__step,
      .stepper__separator {
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
      .stepper__separator {
        flex: 1;
      }
      .stepper__line {
        background: var(--mdx-sys-color-neutral-bold1);
        height: 1px;
        min-width: 1rem;
        flex: 1;
      }
      .stepper__visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
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

  async renderHTML () {
    const labelClassNameMap = {
      current: 'stepper__label-current',
      done: 'stepper__label-done',
      default: 'stepper__label-default'
    }
    const translations = await this.getTranslations({
      progressLabel: 'Checkout-Fortschritt',
      step: 'Schritt',
      of: 'von',
      current: 'aktuell',
      done: 'abgeschlossen'
    })
    const steps = Array.isArray(this.steps) ? this.steps : []
    const currentStepIndex = steps.findIndex(step => step.status === 'current')
    const progressLabel = this.getAttribute('aria-label') || translations.progressLabel

    this.html = /* html */`
      <nav class="stepper__nav" aria-label="${progressLabel}">
        <ol class="stepper">
          ${steps.map((step, index) => {
            const tag = step.status === 'done' ? 'a' : 'span'
            const href = step.status === 'done' ? `href="${step.link}"` : ''
            const ariaCurrent = step.status === 'current' ? 'aria-current="step"' : ''
            const stepPrefix = `${translations.step} ${index + 1} ${translations.of} ${steps.length}:`
            return /* html */`
            <li class="stepper__step">
              ${step.status === 'done'
                  ? /* html */`
                       <a-icon-mdx class="stepper__step-check" icon-name="Check" size="1rem" aria-hidden="true"></a-icon-mdx>`
                  : ''}
              <${tag} class="${labelClassNameMap[step.status]}" ${href} ${ariaCurrent}>
                <span class="stepper__visually-hidden">${stepPrefix} </span>${step.label}${step.status === 'current' ? `<span class="stepper__visually-hidden">, ${translations.current}</span>` : ''}${step.status === 'done' ? `<span class="stepper__visually-hidden">, ${translations.done}</span>` : ''}
              </${tag}>
            </li>
            ${index < steps.length - 1 ? '<li class="stepper__separator" aria-hidden="true"><div class="stepper__line"></div></li>' : ''}
            `
          }).join('')}
        </ol>
        ${currentStepIndex >= 0 ? `<span class="stepper__visually-hidden" aria-live="polite">${translations.step} ${currentStepIndex + 1} ${translations.of} ${steps.length}: ${steps[currentStepIndex].label}</span>` : ''}
      </nav>`

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  getTranslations (fallbacks) {
    if (this._translations) return Promise.resolve(this._translations)

    const keys = {
      progressLabel: 'Accessibility.Checkout.Stepper.AriaLabel',
      step: 'Accessibility.Checkout.Stepper.Step',
      of: 'Accessibility.Checkout.Stepper.Of',
      current: 'Accessibility.Checkout.Stepper.Current',
      done: 'Accessibility.Checkout.Stepper.Done'
    }

    return new Promise(resolve => {
      let resolved = false
      let hasTranslationProvider = false
      const resolveOnce = translations => {
        if (resolved) return
        resolved = true
        this._translations = translations
        resolve(translations)
      }

      this.dispatchEvent(new CustomEvent(this.getAttribute('request-translations') || 'request-translations', {
        detail: {
          resolve: async result => {
            hasTranslationProvider = true
            try {
              if (result?.fetch) await result.fetch
              resolveOnce(Object.fromEntries(await Promise.all(Object.entries(keys).map(async ([name, key]) => {
                const translation = result?.getTranslation
                  ? await result.getTranslation(key)
                  : result?.getTranslationSync?.(key)
                return [name, !translation || translation === key ? fallbacks[name] : translation]
              }))))
            } catch {
              resolveOnce(fallbacks)
            }
          }
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
      window.setTimeout(() => {
        if (!hasTranslationProvider) resolveOnce(fallbacks)
      }, 300)
    })
  }

  get div () {
    return this.root.querySelector('.stepper__nav')
  }
}
