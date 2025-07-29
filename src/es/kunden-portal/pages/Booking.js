// @ts-check
import Index from './Index.js'

/**
 * Booking
 *
 * @export
 * @class Booking
 * @type {CustomElementConstructor}
 */
export default class Booking extends Index {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestBookingListener = (event) => {
      event.detail.fetch
        .then((data) => {
          this.bookingData = data || []
          if (this.modulesLoaded) {
            setTimeout(() => this.renderBooking(), 0)
          }
        })
        .catch(error => {
          console.error('Error fetching bookings:', error)
        })
    }
  }

  connectedCallback() {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-booking', this.requestBookingListener)
    this.dispatchEvent(new CustomEvent('request-booking', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback() {
    document.body.removeEventListener('update-booking', this.requestBookingListener)
  }

  shouldRenderHTML() {
    return !this.root.querySelector('div#booking')
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS() {
    this.css = /* css */`
      :host #top-stage {
        cursor: pointer;
        background-color: var(--mdx-sys-color-primary-default);
        color: white;
        padding: 24px 96px 24px 24px;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw - 120px);
      }
      :host #top-stage > a-icon-mdx {
        display: inline-block;
        position: relative;
        top: 2px;
      }
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
    `
  }

  renderHTML() {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(() => {
      this.modulesLoaded = true
    })

    this.html = /* html */`
      <div id="top-stage" onclick="window.history.back()">
        <a-icon-mdx icon-name="ArrowLeft" size="1em" color="white"></a-icon-mdx> Meine Kurse / Lehrgänge
      </div>
      <div id="body-stage">
        <div id="booking">
          <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Kurs Details</span></h2>
          <div class="container-booking"></div>
        </div>
      </div>
    `

    // improve positioning
    setTimeout(() => {
      const topStage = this.root.querySelector('#top-stage')
      const bodyStage = this.root.querySelector('#body-stage')
      if (topStage && bodyStage) {
        const height = topStage.offsetHeight
        bodyStage.style.marginTop = `${height}px`
      }
    }, 0)
  }

  renderBooking() {
    const bookingDiv = this.shadowRoot.querySelector('#booking .container-booking')
    if (!bookingDiv || !this.bookingData) return
    bookingDiv.innerHTML = ''
    bookingDiv.innerHTML = this.bookingData.course.courseTitle
  }
}
