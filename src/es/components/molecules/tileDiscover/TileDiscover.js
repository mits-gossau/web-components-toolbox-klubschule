class TileDiscover extends HTMLElement {
  static get observedAttributes() {
    return ['image-src', 'tile-label', 'link-href', 'link-text']
  }

  attributeChangedCallback() {
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="tile-discover">
        <div>
          <img src="${this.getAttribute('image-src') || ''}" height="40" width="40" />
        </div>
        <div>
          <p class="label">${this.getAttribute('tile-label') || ''}</p>
          <p>
            <a href="${this.getAttribute('link-href') || '#'}">
              ${this.getAttribute('link-text') || ''}
              <a-icon-mdx icon-name="ExternalLink" size="1em"></a-icon-mdx>
            </a>
          </p>
        </div>
      </div>
    `
  }
}

customElements.define('tile-discover', TileDiscover)