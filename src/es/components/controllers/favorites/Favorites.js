// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Favorites extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    const favoriteButton = this.root.querySelector('ks-a-button')
    const onHtml = `<a-icon-mdx icon-name="HeartFilled" size="1em" class="icon-left"></a-icon-mdx> ${this.getAttribute('on-text') || 'Gemerkt'}`
    const offHtml = `<a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx> ${this.getAttribute('off-text') || 'Merken'}`
    let isFavoured = false

    favoriteButton.innerHTML = offHtml

    this.favoritesClickListener = () => {
      console.log('favoriteButton', isFavoured, favoriteButton.shadowRoot.querySelector('button').innerHTML)
      isFavoured = !isFavoured
      if (isFavoured) {
          favoriteButton.shadowRoot.querySelector('button').innerHTML = onHtml
      } else {
          favoriteButton.shadowRoot.querySelector('button').innerHTML = offHtml
      }
    }
  }

  connectedCallback () {
    this.addEventListener('click', this.favoritesClickListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.favoritesClickListener)
  }
}
