// @ts-check
import Index from './Index.js'

/**
 * Dashboard
 *
 * @export
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends Index {
  /**
   * @param {Object} options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-dashboard-fake-me', this.requestFakeMeListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-dashboard-fake-me', this.requestFakeMeListener)
  }

  requestFakeMeListener = (event) => {
    event.detail.fetch.then((data) => {
      console.log('FakeMe data:', data)
    })
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }
    ])
    this.html = /* html */ `
      <o-grid namespace="grid-12er-">
        <div col-lg="12" col-md="12" col-sm="12">
          <h1>Dashboard</h1>
        </div>
        <div col-lg="12" col-md="12" col-sm="12">
          <!-- <ks-a-button
            color="secondary"
            namespace="button-primary-"
            request-event-name="request-dashboard-fake-me"
            tag='[dashboard-fake-me]'>
            FakeMe
          </ks-a-button> -->
          <ks-a-button
            color="secondary"
            namespace="button-primary-"
            request-event-name="request-dashboard-subscriptions"
            tag='[dashboard-subscriptions]'>
            Subscriptions
          </ks-a-button>
        </div>
      </o-grid>`
  }

  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
  }
}
