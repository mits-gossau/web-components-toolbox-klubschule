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
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

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

        :host div {
          display: flex;
        }

        :host ul {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        :host ul li {
          display: flex;
          align-items: center;
          padding: var(--li-item-padding, 0.4em 0.25em);
          border-radius: var(--li-item-border-radius, 0.25em);
        }

        :host ul li:hover,
        :host ul li.active  {
          cursor: pointer;
          background-color: var(--m-blue-100); 
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

        :host .content {
          display: flex;
          flex-direction: column;
          width: 50%;
        }

        :host .heading {
          font-size: 0.875em;
          line-height: 1em;
          font-weight: 500;
          margin-bottom: 1em;
        }

        :host .list {
          width: 100%;
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
          font-size: 1em;
          line-height: 1.125em;
          font-weight: 500;
        }

        :host .text {
          font-size: 1em;
          line-height: 1.25em;
        }

        :host .title + .text {
          margin-top: 0.25em;
        }

        :host a {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.125em;
          line-height: 1.25em;
          font-weight: 500;
          color: var(--mdx-sys-color-primary-default); ;
        }

        :host a a-icon-mdx {
          margin-left: 0.25em;
          color: var(--mdx-sys-color-primary-default); ;
        }

        :host .list + a {
          margin-top: 1em;
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
        fetch.then(
          (/**
            * @type {{total: number,success: boolean, searchText: string, items: import("../../controllers/autoComplete/AutoComplete.js").Item[], cms: []}}
            */
            { total, success, searchText, items, cms }
          ) => {
            const listItems = items.map(item => {
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

  navigateOnListElement = (event) => {
    this.ulListItems = Array.from(this.list.querySelectorAll('li'))
    if (event.key === "Enter") {
      const currentActiveLiItem = this.ulListItems?.find((li) => li.classList.contains('active'))
      if (currentActiveLiItem) {
        this.ulListItems?.forEach((li) => li.classList.remove('active'))
        currentActiveLiItem.click()
      } else {
        if (this.ulListItems && this.ulListItems[0] && !this.ulListItems[0].hasAttribute('id')) {
          this.ulListItems[0].click()
        }
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
}
