// @ts-check
import Index from './Index.js'

/**
 * Bookings
 *
 * @export
 * @class Bookings
 * @type {CustomElementConstructor}
 */
export default class Bookings extends Index {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestBookingsListener = (event) => {
      event.detail.fetch
        .then((data) => {
          this.bookingsData = data.bookings || [] 
          if (this.modulesLoaded) {
            setTimeout(() => this.renderBookingsTiles(), 0)
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
    document.body.addEventListener('update-bookings', this.requestBookingsListener)
    this.dispatchEvent(new CustomEvent('request-bookings', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback() {
    document.body.removeEventListener('update-bookings', this.requestBookingsListener)
  }

  shouldRenderHTML() {
    return !this.root.querySelector('div#bookings')
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS() {
    this.css = /* css */`
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
      :host .container-bookings {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--grid-12er-grid-gap, 1rem);
      }
      :host .container-bookings .booking-tile {
        grid-column: span 4;
      }
      @media only screen and (max-width: _max-width_) {
        :host .container-bookings .booking-tile {
          grid-column: span 12;
        }
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
        path: `${this.importMetaUrl}../../components/molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      }
    ]).then(() => {
      this.modulesLoaded = true
    })

    this.html = /* html */ `
      <div id="bookings">
        <h2><a-icon-mdx icon-name="calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2>
        <div class="container-bookings"></div>
      </div>
    `
  }

  renderBookingsTiles() {
    const bookingsDiv = this.shadowRoot.querySelector('#bookings .container-bookings')
    if (!bookingsDiv || !this.bookingsData) return
    bookingsDiv.innerHTML = ''
    if (this.bookingsData.length) {
      this.bookingsData.forEach(booking => {
        const TileElement = customElements.get('ks-m-tile')
        // @ts-ignore
        const tile = new TileElement()
        tile.setAttribute('class', 'booking-tile')
        tile.setAttribute('namespace', 'tile-booking-')
        tile.setAttribute('data', JSON.stringify({
          title: booking.courseTitle,
          nextAppointment: booking.appointments?.find(a => a.isNext)?.appointmentDateFormatted || '',
          location: {
            iconName: 'Location',
            name: booking.courseLocation
          },
          room: {
            iconName: 'Monitor',
            name: booking.roomDescription || ''
          },
          icons: [],
          buttons: [{
            text: 'Detail ansehen',
            typ: 'secondary',
            event: 'open-booking-detail',
            link: `index.html#/booking?courseId=${booking.courseId}`
          }],
          price: {
            amount: booking.price?.amount || booking.price || ''
          }
        }))
        bookingsDiv.appendChild(tile)
      })
    } else {
      bookingsDiv.textContent = 'No Bookings'
    }
  }
}
