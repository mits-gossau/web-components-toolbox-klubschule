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
    })
    document.body.addEventListener('request-with-facet', this.requestWithFacetListener)
    if (this.useKeyUpNavigation) {
      this.activeListItemIndex = -2
      this.currentDialog = this.getRootNode().querySelector('dialog')
      this.currentDialog.addEventListener('keydown', this.navigateOnListElement)
    }
  }

  disconnectedCallback() {
    document.body.removeEventListener('request-with-facet', this.requestWithFacetListener)
    if (this.useKeyUpNavigation) this.currentDialog.removeEventListener('keydown', this.navigateOnListElement)
  }

  clickOnListElement = (item) => {
    // TODO: trigger search
    //this.dataLayerPush(item)
  }

  requestWithFacetListener = event => {
    if (event.detail?.key === 'input-search' && event.detail.value) this.storage = escapeHTML(event.detail.value)
  }

  renderCSS() {
    super.renderCSS()
    if (this.parentElement.classList.contains('container')) {
      this.parentElement.setAttribute('style', 'flex-wrap: wrap; gap: 0;')
      this.css = /* css */`
        :host {
          width: 100%;
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
    if (!this.list) this.html = /* html */ `
      <div>
        <ul></ul>
      </div>  
    `
    // render list items
    this.list.replaceChildren(...this.storage.map(item => {
      const listElement = document.createElement('li')
      listElement.innerHTML = `
        <a-icon-mdx icon-name="Clock" size="1em"></a-icon-mdx><span>${item}</span>
      `
      listElement.addEventListener('click', event => this.clickOnListElement(item))
      return listElement
    }))
  }

  get list() {
    return this.root.querySelector('ul')
  }

  get storage () {
    return JSON.parse(localStorage.getItem('history-complete-list') || '[]')
  }

  set storage (value) {
    const currentStorage = this.storage
    // this component exists at multiple (two) locations and must not do the same logic twice
    const lowerCaseValue = value.toLowerCase()
    let index
    if ((index = currentStorage.findIndex(element => element.toLowerCase() === lowerCaseValue)) > 0) currentStorage.splice(index, 1)
    if (index !== 0) {
      const arr = [value].concat(currentStorage)
      // maximum length of 5 items
      arr.length = 5
      localStorage.setItem('history-complete-list', JSON.stringify(arr))
    }
    this.renderHTML()
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
}
