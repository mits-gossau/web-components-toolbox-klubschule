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

  renderBookingsTiles(limit = 6, offset = 0) {
    const bookingsDiv = this.shadowRoot.querySelector('#bookings .container-bookings')
    if (!bookingsDiv || !this.bookingsData) return
    
    // clear on first load
    if (offset === 0) bookingsDiv.innerHTML = ''

    // all appointments with course info
    const allAppointments = []
    this.bookingsData.forEach(booking => {
      (booking.appointments || []).forEach(appointment => {
        allAppointments.push({
          ...appointment,
          courseTitle: booking.courseTitle,
          courseId: booking.courseId,
          courseLocation: booking.courseLocation,
          roomDescription: booking.roomDescription,
          logoUrl: booking.logoUrl,
          price: booking.price,
        })
      })
    })

    // sort by appointmentDate ascending
    // @ts-ignore
    allAppointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))

    // slice for pagination
    const visibleAppointments = allAppointments.slice(offset, offset + limit)

    if (visibleAppointments.length) {
      visibleAppointments.forEach(app => {
        const TileElement = customElements.get('ks-m-tile')
        // @ts-ignore
        const tile = new TileElement()
        tile.setAttribute('class', 'booking-tile')
        tile.setAttribute('namespace', 'tile-booking-')
        tile.setAttribute('data', JSON.stringify({
          title: app.courseTitle,
          nextAppointment: app.appointmentDateFormatted,
          location: {
            iconName: 'Location',
            name: app.courseLocation
          },
          room: {
            iconName: 'Monitor',
            name: app.roomDescription || ''
          },
          icons: [],
          buttons: [{
            text: 'Detail ansehen',
            typ: 'secondary',
            event: 'open-booking-detail',
            link: `index.html#/booking?courseId=${app.courseId}`
          }],
          price: {
            amount: app.price?.amount || app.price || ''
          }
        }))
        bookingsDiv.appendChild(tile)
      })

      // more loading
      const container = this.shadowRoot.querySelector('#bookings')
      let moreBtnWrapper = container.querySelector('.more-bookings-wrapper')
      if (moreBtnWrapper) moreBtnWrapper.remove()

      if (offset + limit < allAppointments.length) {
        moreBtnWrapper = document.createElement('div')
        moreBtnWrapper.className = 'more-bookings-wrapper'
        moreBtnWrapper.style = 'text-align:center;margin-top:2rem;'

        const moreBtn = document.createElement('span')
        moreBtn.innerHTML = /* html */`
          <ks-a-button namespace="button-primary-" color="secondary">
            <span class="more-text">Weitere laden</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right"></a-icon-mdx>
          </ks-a-button>
        `
        moreBtn.onclick = () => this.renderBookingsTiles(limit, offset + limit)
        moreBtnWrapper.appendChild(moreBtn)
        container.appendChild(moreBtnWrapper)
      }
    } else {
      bookingsDiv.textContent = 'No Bookings'
    }
  }
}
