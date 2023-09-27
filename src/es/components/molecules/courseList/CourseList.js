// @ts-check

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

export default class CourseList extends Shadow() {
  /**
   * @param options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    // TODO: Replace with attribute value
    this.courseNamespace = 'course-default-'

    this.answerEventNameListener = event => {
      this.renderHTML('loading')
      event.detail.fetch.then(courseData => this.renderHTML(courseData)).catch(error => {
        this.html = ''
        this.html = `<span style="color:var(--color-error);">${error}</span>`
      })
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    /*
    // TODO: Initial list request
    this.dispatchEvent(new CustomEvent(this.getAttribute('request-event-name') || 'request-event-name',
      {
        detail: {
          type: 'get-active-order-items'
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
    */
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */ `
    :host {
      align-items: var(--align, stretch);
      display: var(--display, flex);
      flex-direction:var(--flex-direction, row);
      flex-wrap: var(--flex-wrap, wrap);
      gap:var(--gap, 0.75em);
      justify-content: var(--justify-content, space-between);
    }
    :host > m-load-template-tag {
      flex: var(--m-load-template-tag-flex, 1 1 12em);
    }
    :host .filter {
      align-self: var(--filter-align-self, center);
      flex: var(--filter-flex, inherit);
      min-height: var(--filter-min-height, 1em);
      width: var(--filter-width, 100%);
    }
    @media only screen and (max-width: _max-width_) {
      :host {
        flex-direction:var(--flex-direction-mobile, row);
        gap:var(--gap-mobile, 0.5em);
      }
      :host > m-load-template-tag {
        min-height: var(--m-load-template-tag-min-height-mobile, auto);
        min-width: var(--m-load-template-tag-min-width-mobile, 12em);
      }
    }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: false
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'course-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * renderHTML
   * @param {any} courseData - An array of course data objects.
   * @returns {Promise<void>} The function `renderHTML` returns a Promise.
   */
  async renderHTML (courseData) {
    if (!courseData) {
      this.html = ''
      this.html = `${this.getAttribute('no-courses-found-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}`
      return Promise.resolve()
    }
    let courseListHeight = this.offsetHeight
    this.html = ''
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../web-components-toolbox/src/es/components/atoms/loading/Loading.js`,
        name: 'a-loading'
      }
    ])

    // TODO: Loading behavior
    // // @ts-ignore
    // if (courseData === 'loading') {
    //   this.html = '<a-loading z-index="1"></a-loading>'
    //   const setStyleTextContent = () => {
    //     this.style.textContent = /* css */`
    //       :host {
    //         min-height: ${courseListHeight}px;
    //       }
    //     `
    //   }
    //   let initialTimeoutId = null
    //   if (!courseListHeight) {
    //     initialTimeoutId = setTimeout(() => {
    //       courseListHeight = this.offsetHeight
    //       setStyleTextContent()
    //     }, 1000)
    //   }
    //   setStyleTextContent()
    //   let timeoutId = null
    //   let pictureLoadEventListener
    //   this.addEventListener('picture-load', (pictureLoadEventListener = event => {
    //     clearTimeout(timeoutId)
    //     timeoutId = setTimeout(() => {
    //       clearTimeout(initialTimeoutId)
    //       this.style.textContent = ''
    //       this.removeEventListener('picture-load', pictureLoadEventListener)
    //     }, 200)
    //   }))
    //   return Promise.resolve()
    // }
    return Promise.all([courseData, fetchModules]).then(() => {
      this.html = '<p>' + JSON.stringify(courseData) + '</p>'
    })
  }

  /**
   * The function returns a style element if it exists, otherwise it creates a new style element and
   * returns it.
   * @returns {HTMLElement} The code is returning the value of `this._style` if it exists, otherwise it is creating a
   * new `<style>` element, setting its `protected` attribute to `true`, and returning it.
   */
  get style () {
    return this._style || (this._style = (() => {
      const style = document.createElement('style')
      style.setAttribute('protected', 'true')
      return style
    })())
  }
}
