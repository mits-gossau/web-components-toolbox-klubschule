// @ts-check
import Button from '../../web-components-toolbox/src/es/components/atoms/button/Button.js'
import { LOADING_FINISHED_EVENT } from '../../web-components-toolbox/src/es/components/molecules/simpleForm/SimpleForm.js'

/**
 * Creates an Button
 * https://www.figma.com/file/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?type=design&node-id=6-4853&mode=design&t=nLXc9nA9gjQUslCi-0
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class KsButton extends Button {
  connectedCallback() {
    super.connectedCallback()
    // set the default label if exists
    if (this.hasAttribute('default-label')) {
      this.buttonSpan = this.root.querySelector('button > span')
      this.buttonSpan.classList.remove('hide')
      this.buttonSpan.textContent = this.getAttribute('default-label') || 'No added placeholder'
    }
    if (this.getAttribute('answer-event-name')) document.body.addEventListener(this.getAttribute('answer-event-name'), this.answerEventListener)

    if (this.hasAttribute('ellipsis-text') && !this.buttonSpan.classList.contains('ellipsis-text')) {
      this.buttonSpan.classList.add('ellipsis-text')
    }

    this.formSubmitLoadingListener = (e) => {
      const temp = document.createElement('div')
      temp.innerHTML = '<mdx-component class="icon-right"><mdx-spinner size="small"></mdx-spinner></mdx-component>'
      const spinner = temp.querySelector('mdx-component')
      this.button.append(spinner)
    }

    this.simpleFormResponseListener = (e) => {
      this.button.querySelector('mdx-component')?.remove()
    }

    if ((this.getAttribute('type') === 'submit') && this.hasAttribute('with-submit-loading')) {
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../organisms/MdxComponent.js`,
          name: 'mdx-component'
        }
      ])
      this.closestForm = this.closest('form')
      this.closestForm?.addEventListener('submit', this.formSubmitLoadingListener)

      /* when there is a simple form check the response event to clean up the spinner */
      this.closestSimpleForm = this.closest('m-simple-form-validation, m-simple-form')
      if (this.closestSimpleForm) {
        console.log('found closest simple form')
        this.closestSimpleForm.addEventListener(LOADING_FINISHED_EVENT, this.simpleFormResponseListener)
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.getAttribute('answer-event-name')) document.body.removeEventListener(this.getAttribute('answer-event-name'), this.answerEventListener)
    if (this.closestForm) {
      this.closestForm.removeEventListener('submit', this.formSubmitLoadingListener)
    }
    if (this.closestSimpleForm) {
      this.button.removeEventListener(this.responseEventName, this.simpleFormResponseListener)
    }
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate() {
    if (!this.hasAttribute('color') && !this.hasAttribute('justify-content') && !this.hasAttribute('small') && !this.hasAttribute('big')) return super.fetchTemplate()
    const replaces = this.buttonTagName === 'a'
      ? [{
        pattern: '([^-=]{1})button',
        flags: 'g',
        replacement: '$1a'
      }]
      : []
    switch (this.getAttribute('namespace')) {
      case 'button-primary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./primary-/primary-.css`,
          namespace: false,
          replaces
        },
        {
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
          namespace: false,
          replaces
        }]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
        })
      case 'button-secondary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./secondary-/secondary-.css`,
          namespace: false,
          replaces
        },
        {
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
          namespace: false,
          replaces
        }]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
        })
      case 'button-tertiary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./tertiary-/tertiary-.css`,
          namespace: false,
          replaces
        },
        {
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
          namespace: false,
          replaces
        }]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
        })
      case 'button-quaternary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./quaternary-/quaternary-.css`,
          namespace: false,
          replaces
        },
        {
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
          namespace: false,
          replaces
        }]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
        })
      default:
        return super.fetchTemplate()
    }
  }

  answerEventListener = async event => {
    this.removeBtn = this.getRootNode().querySelector("a-button[id='clear']")
    if (this.removeBtn) this.removeBtn.style.display = 'none'
    let searchTerm = event.detail.searchTerm
    if (searchTerm && this.removeBtn) {
      this.buttonSpan.classList.remove('hide')
      this.removeBtn.style.display = 'inline'
      this.buttonSpan.textContent = searchTerm
    } else if (this.removeBtn) {
      this.buttonSpan.textContent = this.getAttribute('default-label')
    }
  }
}
