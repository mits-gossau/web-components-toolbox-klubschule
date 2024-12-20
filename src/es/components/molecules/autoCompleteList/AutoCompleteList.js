// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class AutoCompleteList extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.useKeyUpNavigation = this.hasAttribute('use-keyup-navigation')
    this.locateMe = this.shadowRoot.querySelector('#user-location')
    this.autoCompleteListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback() {
    if (this.locateMe) {
      this.locateMe.addEventListener('click', this.clickOnLocateMe)
    }

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

    document.body.addEventListener(this.getAttribute('auto-complete') || 'auto-complete', this.autoCompleteListener)

    if (this.useKeyUpNavigation) {
      this.activeListItemIndex = -2
      this.currentDialog = this.getRootNode().querySelector('dialog')
      this.currentDialog.addEventListener('keydown', this.navigateOnListElement)
    }
  }

  disconnectedCallback() {
    if (this.locateMe) {
      this.locateMe.removeEventListener('click', this.clickOnLocateMe)
    }
    if (this.useKeyUpNavigation) {
      this.currentDialog.removeEventListener('keydown', this.navigateOnListElement)
    }
    document.body.removeEventListener(this.getAttribute('auto-complete') || 'auto-complete', this.autoCompleteListener)
  }

  clickOnLocateMe = () => {
    if (navigator.geolocation) {
      // TODO trigger Filtering
      navigator.geolocation.getCurrentPosition((position) => {
        // Todo dispatch filter event with lat/lng
        /** @type {import("../../controllers/autoCompleteLocation/AutoCompleteLocation.js").LocationCoordinates} */
        this.dispatchEvent(new CustomEvent('client-location-coords', {
          detail: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  clickOnListElement = (item) => {
    this.dataLayerPush(item)
    this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete-selection') || 'auto-complete-location-selection', {
      /** @type {import("../../controllers/autoCompleteLocation/AutoCompleteLocation.js").LocationSelectionItem} */
      detail: {
        description: item.term || item.text,
        selected: item.placeId
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  clickOnListElementContent = (item) => {
    // clean up item.title from html tags
    const temp = document.createElement('div')
    temp.innerHTML = item.title
    item.title = temp.textContent || temp.innerText || ''

    item.type = 'content'
    item.description = item.title
    this.dataLayerPush(item)
  }

  shouldRenderCSS() {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.list
  }

  renderCSS() {
    this.css = /* css */ `
        :host {
          padding-top: 1em;
          padding-left: 1em;
        }

        :host ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        :host > div {
          display: flex;
        }

        :host > div > ul {
          flex: 1;
        }

        :host > div:only-child > ul {
          width: 100%;
          flex-basis: 100%;
        }

        :host ul li {
          display: flex;
          align-items: center;
          padding: var(--li-item-padding, 0.4em 0.25em);
          border-radius: var(--li-item-border-radius, 0.25em);
        }

        :host ul li:hover  {
          cursor: pointer;
          background-color: var(--m-blue-100); 
        }
        
        :host ul li.active  {
          cursor: pointer;
          background-color: var(--m-blue-200); 
        }


        :host ul li + li {
          margin-top: 0.25em;
        }

        :host a-icon-mdx {
          --icon-mdx-ks-color-hover: var(--mdx-base-color-grey-950);
        }

        :host a-icon-mdx + span {
          margin-left: 1em;
        }

        :host span {
          font-size: 1em;
          line-height: 1.25em;
        }

        :host > div > .content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        :host > div > ul + :host > div > .content {
          width: 50%;
        }

        :host .heading {
          color: var(--mdx-sys-color-neutral-default);
          font: var(--mdx-sys-font-fix-label3);
          margin-bottom: var(--mdx-sys-spacing-flex-2xs, 1em);
        }

        :host .list {
          width: 100%;
        }

        :host .list li {
          padding: 0;
        }

        :host .list li + li {
          margin-top: var(--mdx-sys-spacing-flex-xs, 1.125em);;
        }

        :host .list li .text {
          display: -webkit-box;
          max-width: 100%;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :host .list li:hover .text {
          color: var(--mdx-base-color-grey-950);;
        }

        :host .list li div {
          display: flex;
          flex-direction: column;
        }

        :host a-picture + div {
          margin-left: 1em;
        }

        :host .title {
          display: block !important;
          color: var(--mdx-sys-color-neutral-bold4);
          font: var(--mdx-sys-font-fix-label2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :host .title strong {
          display: inline-block;
        }

        :host .text {
          font-size: 1em;
          line-height: 1.25em;
        }

        :host .title + .text {
          margin-top: 0.25em;
        }

        :host .content ul + a {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.125em;
          line-height: 1.25em;
          font-weight: 500;
          color: var(--mdx-sys-color-primary-default); ;
        }

        :host .content ul + a a-icon-mdx {
          margin-left: 0.25em;
          color: var(--mdx-sys-color-primary-default); ;
        }

        :host .list + a {
          margin-top: 1em;
        }

        :host .content .list a {
          display: flex;
          align-items: flex-start;
          padding: var(--li-item-padding, 0.4em 0.25em);
          border-radius: var(--li-item-border-radius, 0.25em);
          /* remove all css definitions from before */
          padding: 0;
          margin: 0;
          text-decoration: none;
          color: var(--color);
          font-weight: 400;
          gap: var(--mdx-sys-spacing-flex-s, 1em);
          width: 100%;
          justify-content: space-between;
        }

        :host .responsive-picture {
          width: 56px;
          min-width: 56px;
        }

        @media only screen and (max-width: _max-width_) {
          :host div {
            flex-direction: column;
          }

          :host ul,
          :host .content {
            width: 100%;
          }

          :host ul + .content {
            margin-top: 3em;
          }

          :host .responsive-picture {
            width: 64px;
          }
        }
    `
    return this.fetchTemplate()
  }

  fetchTemplate() {
    switch (this.getAttribute('namespace')) {
      case 'auto-complete-list-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }
        ])
      default:
    }
  }

  /**
   *
   *
   * @param {Promise<import("../../controllers/autoComplete/AutoComplete.js").fetchAutoCompleteEventDetail>|null} [fetch=null]
   * @return {void}
   */
  renderHTML(fetch = null) {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(children => {
      if (fetch) {
        if (this.useKeyUpNavigation) this.activeListItemIndex = -2
        fetch.then(
          (/**
            * @type {{total: number,success: boolean, searchText: string, contentItems: import("../../controllers/autoComplete/AutoComplete.js").ContentItem[], items: import("../../controllers/autoComplete/AutoComplete.js").Item[], sprachid: string, cms: []}}
            */
            { total, success, searchText, contentItems, items, sprachid, cms }
          ) => {
            // render list items
            const listItems = items.map(item => {
              // @ts-ignore
              item.searchText = searchText
              const listElement = document.createElement('li')
              listElement.innerHTML = `
                <a-icon-mdx icon-name="${item.typ === 1
                  ? 'Search'
                  : item.typ === 2
                    ? 'ArrowRight'
                    : 'Location'}" size="1em"></a-icon-mdx><span>${item.term || item.text}</span>
              `
              if (this.hasAttribute('auto-complete-selection')) {
                listElement.addEventListener('click', () => this.clickOnListElement(item))
              }
              return listElement
            })
            this.list.replaceChildren(...listItems)

            // render content items
            if (this.hasAttribute('with-auto-complete-content')) {
              let displayShowAllResultsLink = false
              if (this.content) this.content.remove() // delete existing content items
              if (contentItems === null || !contentItems.length) return
              if (contentItems.length > 4) {
                contentItems = contentItems.slice(0, 4)
                displayShowAllResultsLink = true
              }
              let searchBaseUrl = "/suche/"
              if (sprachid === "f") searchBaseUrl = "/fr/recherche/"
              if (sprachid === "i") searchBaseUrl = "/it/ricerca/"
              const prefix = location.hostname === 'localhost' ? 'https://dev.klubschule.ch' : ''
              const inputSearch = ['offers-page', 'error-page', 'home-page', 'header']
                .map(page => this.getRootNode().querySelector(`[inputid="${page}-input-search"]`))
                .find(element => element) || ''
              const inputSearchValue = inputSearch?.shadowRoot?.querySelector('input').value || ''
              const suffix = '?q=' + inputSearchValue + '&tab=content2'
              const contentItemsElement = document.createElement('div')
              contentItemsElement.classList.add('content')
              const contentUnsortedList = document.createElement('ul')
              contentUnsortedList.classList.add('list')
              const contentHeadline = document.createElement('div')
              contentHeadline.classList.add('heading')
              contentHeadline.textContent = this.getTranslation('Search.Autocomplete.MoreContent')
              contentItemsElement.appendChild(contentHeadline)
              contentItems.forEach(contentItem => {
                const listItem = document.createElement('li')
                listItem.innerHTML = /* html */`
                  <a href="${prefix + contentItem.link}">
                    <div>
                      <div class="title">${contentItem.title}</div>
                      ${contentItem.text ? `<div class="text">${contentItem.text}</div>` : ''}
                    </div>
                    ${contentItem.image?.src ? `<a-picture class="responsive-picture" defaultSource="${prefix + contentItem.image.src}" alt="${contentItem.image.alt}" namespace="picture-cover-" aspect-ratio="1"></a-picture>` : ''}
                  </a>
                `
                // @ts-ignore
                contentItem.searchText = searchText
                listItem.addEventListener('click', () => this.clickOnListElementContent(contentItem))
                contentUnsortedList.appendChild(listItem)
              })
              contentItemsElement.appendChild(contentUnsortedList)
              if (displayShowAllResultsLink) {
                const showAllResults = document.createElement('a')
                showAllResults.href = searchBaseUrl + suffix
                showAllResults.innerHTML = `${this.getTranslation('Search.Autocomplete.ShowAllResults')} <a-icon-mdx icon-name="ArrowRight" size="1em"></a-icon-mdx>`
                contentItemsElement.appendChild(showAllResults)
              }
              this.list.after(contentItemsElement)
            }
          })
      } else {
        if (this.hasAttribute('auto-complete-location')) {
          this.list.replaceChildren(this.locateMe)
        } else {
          this.html = /* html */ `
              <div>
                <ul></ul>
              </div>  
          `
          Array.from(this.list.children).forEach(node => {
            if (node.tagName === 'LI') this.list.appendChild(node)
          })
        }
      }
    })
  }

  get list() {
    return this.root.querySelector('ul')
  }

  get content() {
    return this.root.querySelector('.content')
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
    // GTM Tracking of autocomplete
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push({
          'auswahl': item.term || (item.type !== 'enter' && item.type !== 'search-click' ? item.description : ''),
          'event': 'autocomplete_click',
          'suchtext': item.searchText || (item.type === 'enter' || item.type === 'search-click' ? item.description : ''),
          'typ': item.type === 'content' ? 'Content' : 'Begriff'
        })
      } catch (error) {
        console.error('Failed to push in data layer', error)
      }
    }
  }
}
