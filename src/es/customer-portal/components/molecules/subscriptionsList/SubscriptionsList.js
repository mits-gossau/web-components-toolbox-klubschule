// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
 * @export
 * @class SubscriptionsList
 * @type {CustomElementConstructor}
 */
export default class SubscriptionsList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscriptions') || 'update-subscriptions', this.subscriptionsListener)
    this.dispatchEvent(new CustomEvent(this.dataset.requestSubscription || 'request-subscriptions',
      {
        detail: {
          subscriptionType: '',
          userId: ''
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscriptions') || 'update-subscriptions', this.subscriptionsListener)
  }

  subscriptionsListener = (event) => {
    this.renderHTML(event.detail.fetch)
  }

  shouldRenderCSS () {
    return this.hasAttribute('id') ? !this.root.querySelector(`:host > style[_css], #${this.getAttribute('id')} > style[_css]`) : !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`) 
  }

  renderCSS () {
    this.css = /* css */`
      :host .list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {}
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'subscriptions-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML (fetch) {
    this.html = ''
    this.renderLoading()
    fetch.then(subscriptions => {
      if (subscriptions.errorCode !== 0) {
        throw new Error(`${subscriptions.errorMessage}`)
      }
      const fetchModules = this.fetchModules([
        {
          path: `${this.importMetaUrl}'../../../tile/Tile.js`,
          name: 'm-tile'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
          name: 'o-grid'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
          name: 'm-dialog'
        },
        {
          path: `${this.importMetaUrl}../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        },
        {
          path: `${this.importMetaUrl}../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        },
        {
          path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
          name: 'a-translation'
        }
      ])
      Promise.all([fetchModules]).then((children) => {
        this.html = ''
        const subscriptionList = this.renderSubscriptionsList(subscriptions, children[0][0])
        this.html = /* html */ `
          <o-grid namespace="grid-12er-">
            <div col-lg="12" col-md="12" col-sm="12">
              <ks-a-heading tag="h1" mode="false">
                <a-translation data-trans-key="CP.cpActiveSubscription"></a-translation>
              </ks-a-heading>
            </div>    
          </o-grid>
          <div class="list-wrapper">
            ${subscriptionList.list.join('')}
          </div>
        `
        return this.html
      })
    }).catch(e => {
      // TODO: Handle error
      console.error(e)
    })
  }

  renderLoading () {
    this.html = '<mdx-component><mdx-spinner size="large"></mdx-spinner></mdx-component>'
  }

  renderSubscriptionsList (subscriptions, tileComponent) {
    const { activeSubscriptions } = subscriptions
    const list = []
    activeSubscriptions.forEach(subscription => {
      const tile = this.makeTileComponent(tileComponent, subscription)
      list.push(tile.outerHTML)
    })
    return {
      list
    }
  }

  makeTileComponent (tile, subscription) {
    const subscriptionData = this.cleanAndStringifyData(subscription)
    const tileComponent = new tile.constructorClass({ namespace: 'tile-subscriptions-' }) // eslint-disable-line
    tileComponent.setAttribute('data', `${subscriptionData}`)
    tileComponent.setAttribute('data-id', `${subscription.subscriptionId}`)
    tileComponent.setAttribute('data-selected-subscription', '{}')
    tileComponent.setAttribute('data-list-type', this.dataset.listType || '')
    return tileComponent
  }

  cleanAndStringifyData (data) {
    const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
    return escapeForHtml(JSON.stringify(data))
  }
}
