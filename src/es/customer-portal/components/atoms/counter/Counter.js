// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Counter
* @type {CustomElementConstructor}
*/
export default class Counter extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options, mode: 'false' }, ...args)
    this.counter = 0
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('update-counter') || 'update-counter', this.updateCounterListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-counter') || 'update-counter', this.updateCounterListener)
  }

  /**
   * Listen to counter update event
   * @param {{ detail: { counter: any; type: string; }}} event
   */
  updateCounterListener = (event) => {
    let counter = event.detail.counter
    if (event.detail.type === 'decrement') {
      counter = this.counter - 1
    }
    this.counter = counter
    this.renderHTML(this.counter)
  }

  /**
   * Render HTML
   * @param {number} counter
   * @returns void
   */
  renderHTML (counter) {
    const { headingType, listType, bookedSubscriptionsText, appointmentsText } = this.dataset
    this.element = this.root.querySelector(headingType) || document.createElement(headingType)
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
    Promise.all([fetchModules]).then((child) => {
      let txt = appointmentsText
      if (listType === 'booked-appointments') txt = bookedSubscriptionsText
      this.element.innerText = `${counter} `
      // translation atom component
      const translation = new child[0][0].constructorClass() // eslint-disable-line
      translation.dataset.transKey = txt
      this.element.append(translation)
      this.html = this.element
    })
  }
}
