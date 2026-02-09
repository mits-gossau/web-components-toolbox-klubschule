// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * @export
 * @class RecentlyViewedList
 * @type {CustomElementConstructor}
 */
export default class RecentlyViewedList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations', {
        detail: { resolve },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }).then(async result => {
      await result.fetch
      this.getTranslation = result.getTranslationSync
      const showPromises = []
      if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
      if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
      Promise.all(showPromises).then(() => (this.hidden = false))
      if (this.deleteEl) this.deleteEl.addEventListener('click', this.deleteElClickEventListener)
    })
    document.body.addEventListener('search-change', this.searchChangeListener)
    document.body.addEventListener('recently-viewed-render-list', this.recentlyViewedRenderList)
    if (this.aInput?.inputFieldPromise) this.aInput.inputFieldPromise.then(inputField => {
      inputField.addEventListener('keyup', this.aInputKeyupEventListener)
      inputField.addEventListener('search', this.aInputKeyupEventListener)
      this.aInputKeyupEventListener()
    })
  }

  disconnectedCallback () {
    document.body.removeEventListener('search-change', this.searchChangeListener)
    document.body.removeEventListener('recently-viewed-render-list', this.recentlyViewedRenderList)
    if (this.aInput?.inputFieldPromise) this.aInput.inputFieldPromise.then(inputField => {
      inputField.removeEventListener('keyup', this.aInputKeyupEventListener)
      inputField.removeEventListener('search', this.aInputKeyupEventListener)
    })
    if (this.deleteEl) this.deleteEl.removeEventListener('click', this.deleteElClickEventListener)
  }

  clickOnListElement = (item, event) => {
    this.dataLayerPush(item)
    if (item.url) window.open(item.url, '_self')
  }

  deleteElClickEventListener = event => {
    event.stopPropagation()
    event.preventDefault()
    this.deleteStorage()
  }

  searchChangeListener = event => {
    if (event.detail?.searchTerm === '') {
      this.removeAttribute('hidden')
      return
    }
    this.aInputKeyupEventListener(event)
  }

  recentlyViewedRenderList = event => this.renderList()

  aInputKeyupEventListener = event => {
    if (!this.aInput?.inputField) return
    this[this.aInput.inputField.value ? 'setAttribute' : 'removeAttribute']('hidden', '')
    setTimeout(() => this[this.aInput?.inputField?.value ? 'setAttribute' : 'removeAttribute']('hidden', ''), 50)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('ul')
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
        padding: 1em 1em 0;
        width: 100%;
      }
      :host([empty]), :host([hidden]) {
        display: none;
      }
      :host .heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        color: var(--mdx-sys-color-neutral-default);
        font: var(--mdx-sys-font-fix-label3);
        margin-bottom: var(--mdx-sys-spacing-flex-2xs, 1em);
      }
      :host .heading > span {
        font-size: 1rem;
      }
      :host .heading > a {
        color: var(--a-color);
        font-size: var(--font-size, 1em);
        font-weight: 400;
        text-decoration: underline;
      }
      :host ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      :host ul li {
        display: flex;
        flex-direction: column;
        padding: 0.5em 0.25em;
        border-radius: 0.25em;
        cursor: pointer;
      }
      :host ul li:hover {
        background-color: var(--m-blue-100);
      }
      :host ul li + li {
        margin-top: 0.25em;
      }
      :host ul li .rv-title {
        font-size: 1em;
        line-height: 1.25em;
        font-weight: 500;
        color: var(--mdx-sys-color-neutral-bold4);
      }
      :host ul li .rv-location {
        font-size: 0.875em;
        line-height: 1.25em;
        color: var(--mdx-sys-color-neutral-default);
        margin-top: 0.125em;
      }
      :host ul li .rv-badge {
        display: inline-block;
        font-size: 0.75em;
        line-height: 1em;
        padding: 0.25em 0.5em;
        border: 1px solid var(--mdx-sys-color-neutral-subtle4, #ccc);
        border-radius: 0.25em;
        margin-top: 0.25em;
        color: var(--mdx-sys-color-neutral-default);
        width: fit-content;
      }
      @media only screen and (max-width: _max-width_) {
        :host .heading {
          flex-direction: row;
        }
        :host .heading > a {
          font-size: var(--font-size-mobile, 0.875em);
        }
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {}

  renderHTML () {
    this.html = /* html */ `
      <div class="heading">
        <span>${this.getTranslation('Search.RecentlyViewed.Title')}</span>
        <a href=#>${this.getTranslation('Search.RecentlyViewed.Delete')}</a>
      </div>
      <div>
        <ul></ul>
      </div>
    `
    this.renderList()
  }

  renderList () {
    const list = this.root.querySelector('ul')
    if (!list) return
    list.replaceChildren(...this.storage.map(item => {
      const listElement = document.createElement('li')
      let locationHtml = ''
      if (item.badge && item.locationName) {
        locationHtml = `<span class="rv-location">${item.locationName}</span><span class="rv-badge">${item.badge}</span>`
      } else if (item.badge) {
        locationHtml = `<span class="rv-badge">${item.badge}</span>`
      } else if (item.locationName) {
        locationHtml = `<span class="rv-location">${item.locationName}</span>`
      }
      listElement.innerHTML = `
        <span class="rv-title">${item.title}</span>
        ${locationHtml}
      `
      listElement.addEventListener('click', event => this.clickOnListElement(item, event))
      return listElement
    }))
    this[list.children.length ? 'removeAttribute' : 'setAttribute']('empty', '')
  }

  get storage () {
    return JSON.parse(localStorage.getItem('recently-viewed-offers') || '[]')
  }

  /**
   * @param {{ title: string, url: string, itemId: string, locationName?: string, badge?: string, price?: number, spartename?: string[], currency?: string }} value
   */
  set storage (value) {
    if (!value || !value.itemId) return
    const currentStorage = this.storage
    const index = currentStorage.findIndex(element => element.itemId === value.itemId)
    if (index >= 0) currentStorage.splice(index, 1)
    if (index !== 0) {
      const arr = [value].concat(currentStorage)
      if (arr.length > 5) arr.length = 5
      localStorage.setItem('recently-viewed-offers', JSON.stringify(arr))
    }
    this.dispatchEvent(new CustomEvent('recently-viewed-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  deleteStorage () {
    localStorage.setItem('recently-viewed-offers', '[]')
    this.dispatchEvent(new CustomEvent('recently-viewed-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  dataLayerPush (item) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        const ecommerceItem = {
          item_name: item.title,
          item_id: item.itemId,
          price: item.price || 0,
          quantity: 1,
          item_variant: item.locationName || '',
          currency: item.currency || 'CHF'
        }
        if (item.spartename) {
          item.spartename.forEach((sparte, i) => {
            ecommerceItem[i === 0 ? 'item_category' : `item_category${i + 1}`] = sparte
          })
        }
        const categoryKey = `item_category${(item.spartename?.length || 0) + 1}`
        ecommerceItem[categoryKey] = 'search_overlay'
        // @ts-ignore
        window.dataLayer.push({
          event: 'select_item',
          ecommerce: {
            items: [ecommerceItem]
          }
        })
      } catch (error) {
        console.error('Failed to push in data layer', error)
      }
    }
  }

  get deleteEl () {
    return this.root.querySelector('.heading > a')
  }

  get aInput () {
    if (this._aInput) return this._aInput
    const dialog = RecentlyViewedList.walksUpDomQueryMatches(this, 'dialog')
    if (dialog?.tagName !== 'DIALOG') return null
    const aInput = dialog.querySelector('a-input')
    if (!aInput?.getAttribute('inputid')) return null
    return (this._aInput = aInput)
  }

  /**
   * Static method to save a viewed offer from outside (e.g. Tile.js)
   * @param {{ title: string, url: string, itemId: string, locationName?: string, badge?: string, price?: number, spartename?: string[], currency?: string }} offerData
   */
  static saveViewedOffer (offerData) {
    if (!offerData || !offerData.itemId) return
    const currentStorage = JSON.parse(localStorage.getItem('recently-viewed-offers') || '[]')
    const index = currentStorage.findIndex(element => element.itemId === offerData.itemId)
    if (index >= 0) currentStorage.splice(index, 1)
    if (index !== 0) {
      const arr = [offerData].concat(currentStorage)
      if (arr.length > 5) arr.length = 5
      localStorage.setItem('recently-viewed-offers', JSON.stringify(arr))
    }
    document.body.dispatchEvent(new CustomEvent('recently-viewed-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
