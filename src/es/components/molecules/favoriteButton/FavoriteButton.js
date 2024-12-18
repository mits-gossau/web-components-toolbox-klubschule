// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class FavoriteButton extends Shadow() {
  #isFavoured
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    try {
      this.gtm_data = this.hasAttribute('course-data') ? JSON.parse(this.getAttribute('course-data')) : null
    } catch (error) {
      console.warn('Wishlist FavoriteButton.js aka. <ks-m-favorite-button> received corrupted course-data and is not going to send the add to wishlist event to GTM:', this)
    }
    // id assembly: courseType_courseId_centerId
    const id = {
      courseType: this.getAttribute('course-type'),
      courseId: this.getAttribute('course-id'),
      centerId: this.getAttribute('center-id'),
      isValid: function () { return !!(this.courseType && this.courseId && this.centerId) }
    }
    // the course attribute trumps the separate attributes
    if (this.hasAttribute('course')) [id.courseType, id.courseId, id.centerId] = this.getAttribute('course').split('_')
    if (!id.isValid()) {
      // grab the course id from the url, if available (NOTE: Experimental, the regex is not reviewed with BE logic but should work find)
      [id.courseType, id.courseId, id.centerId] = location.href.match(/--([\w]{1}_[\d]{3,6}_[\d]{3,6})/)?.[1].split('_') || []
      if (!id.isValid()) console.warn('Favorite button for wishlist has invalid values!', this)
    }

    this.isFavoured = false

    let timeout = null
    this.resizeListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (this.isMobile) {
          this.button?.setAttribute('round', '')
        } else {
          this.button?.removeAttribute('round')
        }
      }, 200)
    }

    this.clickEventListener = event => {
      this.isFavoured = !this.isFavoured
      if (!id.isValid()) return console.warn('Favorite button for wishlist has invalid values!', this)
      this.dispatchEvent(new CustomEvent(this.isFavoured ? 'add-to-wish-list' : 'remove-from-wish-list', {
        detail: {
          language: this.getAttribute('language'),
          courseType: id.courseType,
          courseId: id.courseId,
          centerId: id.centerId
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
      if (this.gtm_data && this.isFavoured) this.dataLayerPush({
        'event': 'add_to_wishlist',
        'ecommerce': {    
            'items': [{ 
            // @ts-ignore
            'item_name': `${this.gtm_data.bezeichnung}`,                
            // @ts-ignore
            'item_id': `${this.getItemId(this.gtm_data)}`, 
            // @ts-ignore
            'price': this.gtm_data.price.oprice || this.gtm_data.price.price,
            'item_category': `${this.gtm_data.spartename?.[0] || ''}`,
            'item_category2': `${this.gtm_data.spartename?.[1] || ''}`,
            'item_category3': `${this.gtm_data.spartename?.[2] || ''}`,
            'item_category4': `${this.gtm_data.spartename?.[3] || ''}`,
            'item_category5': `${this.gtm_data.spartename?.[4] || ''}`, 
            'quantity': 1,
            'item_variant':`${this.gtm_data.location?.center ? this.gtm_data.location.center : this.gtm_data.center ? this.gtm_data.center.bezeichnung_internet : ''}`,
            'index': 0,
            'currency': 'CHF'
          }]
        }
      })
    }

    /** @type {(any)=>void} */
    let wishListResolve = map => map
    /** @type {Promise<void>} */
    this.wishListPromise = new Promise(resolve => (wishListResolve = resolve))
    this.wishListListener = async event => {
      const hasFavouredFunc = entry => (id.courseType === entry.kursTyp && id.courseId === String(entry.kursId) && id.centerId === String(entry.centerId))
      this.isFavoured = (await event.detail.fetch).watchlistEntriesAngebot?.some(hasFavouredFunc) || (await event.detail.fetch).watchlistEntriesVeranstaltung?.some(hasFavouredFunc)
      wishListResolve(true)
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = [this.wishListPromise]
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    this.resizeListener()
    Promise.all(showPromises).then(() => (this.hidden = false))
    self.addEventListener('resize', this.resizeListener)
    this.addEventListener('click', this.clickEventListener)
    document.body.addEventListener('wish-list', this.wishListListener)
    this.dispatchEvent(new CustomEvent('request-wish-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    self.removeEventListener('resize', this.resizeListener)
    this.removeEventListener('click', this.clickEventListener)
    document.body.removeEventListener('wish-list', this.wishListListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.button
  }

  /**
   * renders the css
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      @media only screen and (max-width: _max-width_) {
        :host {
          --button-secondary-icon-left-margin: 0;
          --button-tertiary-icon-left-margin: 0;
        }
        :host > ks-a-button::part(text){
          display: none;
        }
      }
    `
    return Promise.resolve()
  }

  /**
   * Render HTML
   * @return {Promise<void>}
   */
  renderHTML () {
    this.html = ''
    const div = document.createElement('div')
    div.innerHTML = `<ks-a-button ${this.hasAttribute("small") ? 'small' : ''} namespace="${this.hasAttribute("button-typ") ? this.getAttribute("button-typ") : "button-tertiary-"}" color="secondary"></ks-a-button>`
    this.button = div.children[0]
    div.innerHTML = '<a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx>'
    this.icon = div.children[0]
    div.innerHTML = /* html */`<a-translation data-trans-key="${this.getAttribute('off-text') ?? 'Wishlist.Remember'}" part=text></a-translation>`
    this.text = div.children[0]
    if (this.button.shadowRoot) {
      this.button.shadowRoot.appendChild(this.icon)
      this.button.shadowRoot.appendChild(this.text)
    } else {
      this.button.appendChild(this.icon)
      this.button.appendChild(this.text)
    }
    this.html = this.button
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
  }

  get isMobile () {
    return self.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches
  }

  set isFavoured (value) {
    // test at: http://localhost:3000/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/generator/https---int-klubschule-ch-gesundheit-pilates-kurs-pilates--D_91708_2678_394.html
    if (value) {
      this.setAttribute('is-favoured', '')
      this.icon?.setAttribute('icon-name', 'HeartFilled')
      this.text?.setAttribute('data-trans-key', this.getAttribute('on-text') ?? 'Wishlist.Remembered')
    } else {
      this.removeAttribute('is-favoured')
      this.icon?.setAttribute('icon-name', 'Heart')
      this.text?.setAttribute('data-trans-key', this.getAttribute('off-text') ?? 'Wishlist.Remember')
    }
    this.#isFavoured = value
  }

  get isFavoured () {
    return this.#isFavoured
  }

  getItemId (data) {
    const itemId = data.kurs_typ + '_' + data.kurs_id
    const centerId = data.centerid ? `_${data.centerid}` : ''
    const parentId = data.parentkey ? data.parentkey.includes(data.centerid) ? data.parentkey : data.parentkey + centerId : data.parent_kurs_id && data.parent_kurs_typ ? `${data.parent_kurs_typ}_${data.parent_kurs_id}${centerId}` : ''
    return parentId ? `${parentId}--${itemId}` : `${itemId}${centerId}--${itemId}`
  }

  dataLayerPush (value) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(value)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
