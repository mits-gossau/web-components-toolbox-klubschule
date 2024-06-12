// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class FavoriteButton extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    const icon = this.root.querySelector('a-icon-mdx')
    const text = this.root.querySelector('span')
    let isFavoured = false

    this.favoritesClickListener = () => {
      isFavoured = !isFavoured
      if (isFavoured) {
        icon.setAttribute('icon-name', 'HeartFilled')
        text.innerHTML = this.getAttribute('on-text') || 'Gemerkt'
      } else {
        icon.setAttribute('icon-name', 'Heart')
        text.innerHTML = this.getAttribute('off-text') || 'Merken'
      }
    }
  }

  connectedCallback () {
    this.addEventListener('click', this.favoritesClickListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.favoritesClickListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`) 
  }
}
