// @ts-check
import { escapeHTML } from '../../web-components-toolbox/src/es/helpers/Helpers.js'
import AutoCompleteList from '../autoCompleteList/AutoCompleteList.js'

export default class HistoryCompleteList extends AutoCompleteList {
  connectedCallback() {
    this.hidden = true
    new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations',
        {
          detail: {
            resolve
          },
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
      this.deleteEl.addEventListener('click', this.deleteElClickEventListener)
    })
    document.body.addEventListener('request-with-facet', this.requestWithFacetListener)
    document.body.addEventListener('search-change', this.searchChangeListener)
    document.body.addEventListener('history-complete-render-list', this.historyCompleteRenderList)
    if (this.aInput) this.aInput.inputFieldPromise.then(inputField => {
      inputField.addEventListener('keyup', this.aInputKeyupEventListener)
      this.aInputKeyupEventListener()
    })
    if (this.useKeyUpNavigation) {
      this.activeListItemIndex = -2
      this.currentDialog = this.getRootNode().querySelector('dialog')
      this.currentDialog.addEventListener('keydown', this.navigateOnListElement)
    }
  }

  disconnectedCallback() {
    document.body.removeEventListener('request-with-facet', this.requestWithFacetListener)
    document.body.removeEventListener('search-change', this.searchChangeListener)
    document.body.removeEventListener('history-complete-render-list', this.historyCompleteRenderList)
    this.aInput.inputFieldPromise.then(inputField => inputField.removeEventListener('keyup', this.aInputKeyupEventListener))
    if (this.useKeyUpNavigation) this.currentDialog.removeEventListener('keydown', this.navigateOnListElement)
    this.deleteEl.removeEventListener('click', this.deleteElClickEventListener)
  }

  clickOnListElement = (item, event) => {
    if (this.aInput.inputField) {
      this.aInput.inputField.value = item
      this.aInput.searchButton.click()
      this.aInputKeyupEventListener(event)
    }
    //this.dataLayerPush(item)
  }

  deleteElClickEventListener = event => {
    event.stopPropagation()
    event.preventDefault()
    this.deleteStorage()
  }

  searchChangeListener = event => this.aInputKeyupEventListener(event)

  requestWithFacetListener = event => {
    if (event.detail?.key === 'input-search' && event.detail.value) this.storage = event.detail.value
  }

  historyCompleteRenderList = event => this.renderList()

  aInputKeyupEventListener = event => {
    this[this.aInput.inputField.value ? 'setAttribute' : 'removeAttribute']('hidden', '')
    setTimeout(() => this[this.aInput.inputField.value ? 'setAttribute' : 'removeAttribute']('hidden', ''), 50)
  }

  renderCSS() {
    super.renderCSS()
    if (this.parentElement.classList.contains('container')) {
      this.parentElement.setAttribute('style', 'flex-wrap: wrap; gap: 0;')
      this.css = /* css */`
        :host {
          padding-right: 1em;
          width: 100%;
        }
        :host([empty]), :host([hidden]) {
          display: none;
        }
        :host .heading {
          align-items: end;
          justify-content: space-between;
        }
        :host .heading > a {
          color: var(--a-color);
          font-size: var(--font-size);
          text-decoration: underline;
        }
        @media only screen and (max-width: _max-width_) {
          :host .heading {
            flex-direction: row;
          }
          :host .heading > a {
            font-size: var(--font-size-mobile);
          }
        }
      `
    }
  }

  /**
   *
   *
   * @return {void}
   */
  renderHTML() {
    if (this.useKeyUpNavigation) this.activeListItemIndex = -2
    this.html = /* html */ `
      <div class="heading">
        <span>${this.getTranslation('Search.History.LastSearched')}</span>
        <a href=#>${this.getTranslation('Search.History.Delete')}</a>
      </div>
      <div>
        <ul></ul>
      </div>  
    `
    this.renderList()
  }

  /**
   *
   *
   * @return {void}
   */
  renderList() {
    // render list items
    this.list.replaceChildren(...this.storage.map(item => {
      const listElement = document.createElement('li')
      listElement.innerHTML = `
        <a-icon-mdx icon-name="Clock" size="1em"></a-icon-mdx><span>${item}</span>
      `
      listElement.addEventListener('click', event => this.clickOnListElement(item, event))
      return listElement
    }))
    this[this.list.children.length ? 'removeAttribute' : 'setAttribute']('empty', '')
  }

  get storage () {
    return JSON.parse(localStorage.getItem('history-complete-list') || '[]')
  }

  set storage (value) {
    value = escapeHTML(value)
    const currentStorage = this.storage
    // this component exists at multiple (two) locations and must not do the same logic twice
    const lowerCaseValue = value.toLowerCase()
    let index
    if ((index = currentStorage.findIndex(element => element.toLowerCase() === lowerCaseValue)) > 0) currentStorage.splice(index, 1)
    if (index !== 0) {
      const arr = [value].concat(currentStorage)
      // maximum length of 5 items
      if (arr.length > 5) arr.length = 5
      localStorage.setItem('history-complete-list', JSON.stringify(arr))
    }
    this.dispatchEvent(new CustomEvent('history-complete-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  deleteStorage () {
    localStorage.setItem('history-complete-list', '[]')
    this.dispatchEvent(new CustomEvent('history-complete-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  dataLayerPush(item) {
    // GTM Tracking of search_history
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push({
          'auswahl': item.term || (item.type !== 'enter' && item.type !== 'search-click' ? item.description : ''),
          'event': 'search_history_click',
          'suchtext': item.searchText || (item.type === 'enter' || item.type === 'search-click' ? item.description : ''),
          'typ': item.type === 'content' ? 'Content' : 'Begriff'
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
    // @ts-ignore
    return this._aInput || (this._aInput = HistoryCompleteList.walksUpDomQueryMatches(this, 'dialog').querySelector('a-input'))
  }
}
