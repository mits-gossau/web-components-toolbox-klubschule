// @ts-check
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

    if (this.useKeyUpNavigation) {
      this.activeListItemIndex = -2
      this.currentDialog = this.getRootNode().querySelector('dialog')
      this.currentDialog.addEventListener('keydown', this.navigateOnListElement)
    }
  }

  disconnectedCallback() {
    if (this.useKeyUpNavigation) {
      this.currentDialog.removeEventListener('keydown', this.navigateOnListElement)
    }
  }

  clickOnListElement = (item) => {
    //this.dataLayerPush(item)
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
    this.html = /* html */ `
      <div>
        <ul></ul>
      </div>  
    `
    const items = [{term: 'hello'}] // TODO: get from localStorage
    // render list items
    this.list.replaceChildren(...items.map(item => {
      const listElement = document.createElement('li')
      listElement.innerHTML = `
        <a-icon-mdx icon-name="Clock" size="1em"></a-icon-mdx><span>${item.term || item.text}</span>
      `
      listElement.addEventListener('click', event => this.clickOnListElement(item))
      return listElement
    }))
  }

  get list() {
    return this.root.querySelector('ul')
  }

  navigateOnListElement = (event) => {
    this.ulListItems = Array.from(this.list.querySelectorAll('li'))
    if (event.key === "Enter") {
      const currentActiveLiItem = this.ulListItems?.find((li) => li.classList.contains('active'))
      if (currentActiveLiItem) {
        this.ulListItems?.forEach((li) => li.classList.remove('active'))
        currentActiveLiItem.click()
      } else if (!currentActiveLiItem && this.ulListItems[0].getAttribute('id') !== 'user-location') {
        this.ulListItems[0].click()
      }
    } else {
      const maxLength = this.ulListItems.length - 2
      this.ulListItems.forEach((li) => li.classList.remove('active'))

      if (this.ulListItems.length > 1) {
        switch (event.key) {
          case "ArrowUp":
            if (this.activeListItemIndex === -2) {
              this.ulListItems[0].classList.add('active')
              this.activeListItemIndex = 0
            } else if (this.activeListItemIndex === 0) {
              this.activeListItemIndex = maxLength + 1
              this.ulListItems[this.activeListItemIndex].classList.add('active')
            }
            else {
              this.activeListItemIndex = this.activeListItemIndex - 1
              this.ulListItems[this.activeListItemIndex].classList.add('active')
            }
            break;
          case "ArrowDown":
            if (this.activeListItemIndex === -2) {
              this.ulListItems[0].classList.add('active')
              this.activeListItemIndex = 0
            }
            else if (this.activeListItemIndex > maxLength) {
              this.activeListItemIndex = 0
              this.ulListItems[this.activeListItemIndex].classList.add('active')
            }
            else {
              this.activeListItemIndex = this.activeListItemIndex + 1
              this.ulListItems[this.activeListItemIndex].classList.add('active')
            }
            break;
        }
      }
    }
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
