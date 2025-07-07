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
    document.body.addEventListener('update-subscriptions', this.requestSubscriptionsListener)
    this.dispatchEvent(new CustomEvent('request-dashboard-subscriptions', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-dashboard-fake-me', this.requestFakeMeListener)
    document.body.removeEventListener('update-subscriptions', this.requestSubscriptionsListener)
  }

  requestFakeMeListener = (event) => {
    event.detail.fetch.then((data) => {
      console.log('FakeMe data:', data)
    })
  }

  requestSubscriptionsListener = (event) => {
    event.detail.fetch
      .then((data) => {
        console.log('Subscriptions:', data)
      
        const subscriptionsDiv = this.root.querySelector('.container-subscriptions')
        console.log(subscriptionsDiv)
        if (subscriptionsDiv) {
          subscriptionsDiv.innerHTML = ''

          // Expired Subscriptions
          if (data.expiredSubscriptions?.length) {
            const expiredTitle = document.createElement('h3')
            expiredTitle.textContent = 'Expired Subscriptions'
            subscriptionsDiv.appendChild(expiredTitle)
            data.expiredSubscriptions.forEach(sub => {
              const p = document.createElement('p')
              p.textContent = sub.subscriptionDescription
              subscriptionsDiv.appendChild(p)
            })
          }

          // Active Subscriptions
          if (data.activeSubscriptions?.length) {
            const activeTitle = document.createElement('h3')
            activeTitle.textContent = 'Active Subscriptions'
            subscriptionsDiv.appendChild(activeTitle)
            data.activeSubscriptions.forEach(sub => {
              const p = document.createElement('p')
              p.textContent = sub.subscriptionDescription
              subscriptionsDiv.appendChild(p)
            })
          }

          // Falls keine Abos vorhanden sind
          if (!data.activeSubscriptions?.length && !data.expiredSubscriptions?.length) {
            subscriptionsDiv.textContent = 'No Subscriptions'
          }
        }
      })
      .catch(error => {
        console.error('Error fetching subscriptions:', error)
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
        </div>
        <div col-lg="12" col-md="12" col-sm="12">
          <h2>Subscriptions</h2>
          <div class="container-subscriptions"></div>
        </div>
      </o-grid>
      `
  }

  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
      }

      :host .spacing {
        height: 20px;
      }
    `
  }
}
