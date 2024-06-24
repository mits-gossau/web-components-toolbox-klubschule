// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class FavoriteButton extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    // id assembly: courseType_courseId_centerId
    const id = {
      courseType: this.getAttribute('course-type'),
      courseId: this.getAttribute('course-id'),
      centerId: this.getAttribute('center-id'),
      isValid: function() {return !!(this.courseType && this.courseId && this.centerId)}
    }
    // the course attribute trumps the separate attributes
    if (this.hasAttribute('course')) [id.courseType, id.courseId, id.centerId] = this.getAttribute('course').split('_')
    if (!id.isValid()) {
      // grab the course id from the url, if available (NOTE: Experimental, the regex is not reviewed with BE logic but should work find)
      [id.courseType, id.courseId, id.centerId] = location.href.match(/--([\w]{1}_[\d]{3,6}_[\d]{3,6})/)?.[1].split('_') || []
      if (!id.isValid()) console.warn('Favorite button for wishlist has invalid values!', this)
    }
    
    let isFavoured = false

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

    this.favoritesClickListener = event => {
      this.setFavoured((isFavoured = !isFavoured))
      if (!id.isValid()) return console.warn('Favorite button for wishlist has invalid values!', this)
      this.dispatchEvent(new CustomEvent(isFavoured ? 'add-to-wish-list' : 'remove-from-wish-list', {
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
    }

    /** @type {(any)=>void} */
    let wishListResolve = map => map
    /** @type {Promise<void>} */
    this.wishListPromise = new Promise(resolve => (wishListResolve = resolve))
    this.wishListListener = async event => {
      this.setFavoured((isFavoured = (await event.detail.fetch).watchlistEntries.some(entry => (id.courseType === entry.kursTyp && id.courseId === String(entry.kursId) && id.centerId === String(entry.centerId)))))
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
    this.addEventListener('click', this.favoritesClickListener)
    document.body.addEventListener('wish-list', this.wishListListener)
    this.dispatchEvent(new CustomEvent('request-wish-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    self.removeEventListener('resize', this.resizeListener)
    this.removeEventListener('click', this.favoritesClickListener)
    document.body.removeEventListener('wish-list', this.wishListListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
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
    div.innerHTML = /* html */`<ks-a-button namespace="button-tertiary-" color="secondary"></ks-a-button>`
    this.button = div.children[0]
    div.innerHTML = /* html */`<a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx>`
    this.icon = div.children[0]
    div.innerHTML = /* html */`<a-translation data-trans-key="${this.getAttribute('off-text') ?? 'Wishlist.Remember'}" part=text></a-translation>`
    this.text = div.children[0]
    this.button.appendChild(this.icon)
    this.button.appendChild(this.text)
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

  setFavoured (value) {
    if (value) {
      this.icon?.setAttribute('icon-name', 'HeartFilled')
      this.text?.setAttribute('data-trans-key', this.getAttribute('on-text') ?? 'Wishlist.Remembered')
    } else {
      this.icon?.setAttribute('icon-name', 'Heart')
      this.text?.setAttribute('data-trans-key', this.getAttribute('off-text') ?? 'Wishlist.Remember')
    }
  }

  get isMobile () {
    return self.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches
  }
}
