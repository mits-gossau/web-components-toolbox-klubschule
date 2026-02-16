// @ts-check
import AutoCompleteList from '../autoCompleteList/AutoCompleteList.js'

/**
 * @export
 * @class RecentlyViewedList
 * @type {CustomElementConstructor}
 */
export default class RecentlyViewedList extends AutoCompleteList {
  connectedCallback () {
    if (this._initialized) {
      this.hidden = false
      this.bindAInput()
      return
    }
    this.hidden = true
    const translationFallbacks = {
      'Search.RecentlyViewed.Title': 'Zuletzt angesehen',
      'Search.RecentlyViewed.Delete': 'Verlauf löschen'
    }
    const initComponent = () => {
      if (this._initialized) return
      this._initialized = true
      const originalGetTranslation = this.getTranslation
      this.getTranslation = key => {
        const translated = originalGetTranslation ? originalGetTranslation(key) : key
        return (translated === key && translationFallbacks[key]) ? translationFallbacks[key] : translated
      }
      const showPromises = []
      if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
      if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
      Promise.all(showPromises).then(() => (this.hidden = false))
      if (this.deleteEl) this.deleteEl.addEventListener('click', this.deleteElClickEventListener)
    }
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
      initComponent()
    })
    if (this.hasAttribute('mock')) this.initMockData()
    setTimeout(() => initComponent(), 300)
    document.body.addEventListener('search-change', this.searchChangeListener)
    document.body.addEventListener('recently-viewed-render-list', this.recentlyViewedRenderList)
    document.body.addEventListener('history-complete-render-list', this.recentlyViewedRenderList)
    this.bindAInput()
  }

  bindAInput () {
    if (this.aInput?.inputFieldPromise) {
      this.aInput.inputFieldPromise.then(inputField => {
        inputField.addEventListener('keyup', this.aInputKeyupEventListener)
        inputField.addEventListener('search', this.aInputKeyupEventListener)
        this.aInputKeyupEventListener()
      })
    } else {
      // Retry: m-dialog may not have created its <dialog> yet
      setTimeout(() => {
        if (!this._aInput && this.isConnected) this.bindAInput()
      }, 100)
    }
  }

  disconnectedCallback () {
    document.body.removeEventListener('search-change', this.searchChangeListener)
    document.body.removeEventListener('recently-viewed-render-list', this.recentlyViewedRenderList)
    document.body.removeEventListener('history-complete-render-list', this.recentlyViewedRenderList)
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

  recentlyViewedRenderList = event => {
    this.requestServerItems().then(() => this.renderList())
  }

  aInputKeyupEventListener = event => {
    if (!this.aInput?.inputField) return
    this[this.aInput.inputField.value ? 'setAttribute' : 'removeAttribute']('hidden', '')
    setTimeout(() => this[this.aInput?.inputField?.value ? 'setAttribute' : 'removeAttribute']('hidden', ''), 50)
  }

  renderCSS () {
    super.renderCSS()
    if (this.parentElement?.classList.contains('container')) {
      this.parentElement.setAttribute('style', 'flex-wrap: wrap; gap: 0;')
    }
    this.css = /* css */`
      :host {
        padding: 1em 1em 0;
        width: 100%;
      }
      :host([has-separator]) .heading {
        border-top: 1px solid var(--mdx-sys-color-neutral-subtle4, #ccc);
        padding-top: 1em;
      }
      :host([empty]), :host([hidden]) {
        display: none;
      }
      :host .heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
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
      :host ul li {
        flex-direction: column;
        align-items: flex-start;
      }
      :host ul li .rv-title {
        font-size: 1em;
        line-height: 1.25em;
        font-weight: 500;
        color: var(--mdx-sys-color-neutral-bold4);
      }
      :host ul li .rv-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
        margin-top: 0.125em;
      }
      :host ul li .rv-meta .rv-location {
        margin-top: 0;
      }
      :host ul li .rv-meta .rv-badge {
        margin-top: 0;
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
  }

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
    this.requestServerItems().then(() => this.renderList())
  }

  renderList () {
    const list = this.root.querySelector('ul')
    if (!list) return
    list.replaceChildren(...this.storage.map(item => {
      const listElement = document.createElement('li')
      let locationHtml = ''
      if (item.badge && item.locationName) {
        locationHtml = `<div class="rv-meta"><span class="rv-location">${item.locationName}</span><span class="rv-badge">${item.badge}</span></div>`
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
    const historyAbove = this.previousElementSibling?.tagName === 'KS-M-HISTORY-COMPLETE-LIST'
    const hasHistory = historyAbove && JSON.parse(localStorage.getItem('history-complete-list') || '[]').length > 0
    this[list.children.length && hasHistory ? 'setAttribute' : 'removeAttribute']('has-separator', '')
  }

  requestServerItems () {
    let resolved = false
    return new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-recently-viewed-storage', {
        detail: {
          resolve: value => {
            resolved = true
            resolve(value)
          }
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
      if (!resolved) resolve(null)
    }).then(serverItems => {
      this._serverItems = serverItems
    })
  }

  get storage () {
    if (this._serverItems) return this._serverItems
    return JSON.parse(localStorage.getItem('recently-viewed-offers') || '[]')
  }

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
    this.dispatchEvent(new CustomEvent('recently-viewed-clear', {
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
    // Walk up the DOM to find the dialog, crossing shadow DOM boundaries
    let el = this
    let dialog = null
    while (el) {
      if (el.tagName === 'DIALOG') {
        dialog = el
        break
      }
      el = el.parentNode instanceof ShadowRoot ? el.parentNode.host : el.parentNode
    }
    if (!dialog) return null
    const aInput = dialog.querySelector('a-input')
    if (!aInput?.getAttribute('inputid')) return null
    return (this._aInput = aInput)
  }

  initMockData () {
    if (!this.storage.length) {
      localStorage.setItem('recently-viewed-offers', JSON.stringify([
        { title: 'Pilates - Privatunterricht', url: '#', itemId: 'D_97041_1013--D_97041', locationName: 'Chur', badge: '', price: 325, spartename: ['Gesundheit', 'Pilates', 'Pilates Variationen'], currency: 'CHF' },
        { title: 'Englisch Niveau B1', url: '#', itemId: 'D_92100_2665--D_92100', locationName: 'Zürich', badge: '', price: 690, spartename: ['Sprachen', 'Englisch'], currency: 'CHF' },
        { title: 'Yoga für Einsteiger*innen', url: '#', itemId: 'D_95072_1016--D_95072', locationName: '', badge: 'Online', price: 180, spartename: ['Gesundheit', 'Yoga'], currency: 'CHF' },
        { title: 'Webdesign Grundlagen', url: '#', itemId: 'D_88300_1013--D_88300', locationName: 'Bern', badge: 'Blended', price: 1200, spartename: ['Informatik', 'Webdesign'], currency: 'CHF' },
        { title: 'Italienisch Niveau A1', url: '#', itemId: 'D_91050_2659--D_91050', locationName: 'Luzern', badge: '', price: 550, spartename: ['Sprachen', 'Italienisch'], currency: 'CHF' }
      ]))
    }
  }
}
