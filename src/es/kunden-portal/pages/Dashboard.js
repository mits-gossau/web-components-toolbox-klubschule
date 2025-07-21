// @ts-check
import Index from './Index.js'

/**
 * Dashboard
 *
 * @export
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends Index {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestBookingsListener = (event) => {
      event.detail.fetch
        .then((data) => {
          this.bookingsData = data.bookings || []
          if (this.modulesLoaded) {
            setTimeout(() => this.renderAppointmentsTiles(), 0)
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
    if (!this.bookingsData) this.dispatchEvent(new CustomEvent('request-bookings', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback() {
    document.body.removeEventListener('update-bookings', this.requestBookingsListener)
  }

  shouldRenderHTML() {
    return !this.root.querySelector('div#dashboard')
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
      :host .container-appointments {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--grid-12er-grid-gap, 1rem);
      }
      :host .container-appointments .appointment-tile {
        grid-column: span 4;
      }
      @media only screen and (max-width: _max-width_) {
        :host .container-appointments .appointment-tile {
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
        path: `${this.importMetaUrl}../../components/atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      }
    ]).then(() => {
      this.modulesLoaded = true
    })

    this.html = /* html */ `
      <div id="dashboard">
        <div id="appointments">
          <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2>
          <div class="container-appointments"></div>
        </div>
        <ks-a-spacing type="m-flex"></ks-a-spacing>
        <div id="bookings">
          <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine Kurse/Lehrgänge</span></h2>
          <div class="container-bookings"></div>
        </div>
      </div>
    `
  }

  renderAppointmentsTiles(limit = 6, offset = Number(sessionStorage.getItem('appointmentsOffset')) || 0) {
    const appointmentsDiv = this.shadowRoot.querySelector('#appointments .container-appointments')
    if (!appointmentsDiv || !this.bookingsData) return

    if (offset === 0) appointmentsDiv.innerHTML = ''

    // future appointments with course info
    const today = new Date()
    const allAppointments = []
    this.bookingsData.forEach(booking => {
      (booking.appointments || []).forEach(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        // @ts-ignore
        if (appointmentDate >= today.setHours(0, 0, 0, 0)) {
          allAppointments.push({
            ...appointment,
            courseTitle: booking.courseTitle,
            courseId: booking.courseId,
            courseLocation: booking.courseLocation,
            roomDescription: booking.roomDescription,
            logoUrl: booking.logoUrl,
            price: booking.price,
          })
        }
      })
    })

    // @ts-ignore, sort by appointmentDate ascending
    allAppointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))

    // slice for loading more appointments
    const visibleAppointments = allAppointments.slice(offset, offset + limit)

    if (visibleAppointments.length) {
      visibleAppointments.forEach(app => {
        const TileElement = customElements.get('ks-m-tile')
        // @ts-ignore
        const tile = new TileElement()
        tile.setAttribute('class', 'appointment-tile')
        tile.setAttribute('namespace', 'tile-appointment-')
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
        appointmentsDiv.appendChild(tile)
      })

      // load more
      const container = this.shadowRoot.querySelector('#appointments')
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
        moreBtn.onclick = () => {
          sessionStorage.setItem('appointmentsOffset', String(offset + limit))
          this.renderAppointmentsTiles(limit, offset + limit)
        }
        moreBtnWrapper.appendChild(moreBtn)
        container.appendChild(moreBtnWrapper)
      }

      // load less
      if (offset > 0) {
        let lessBtnWrapper = container.querySelector('.less-bookings-wrapper')
        if (lessBtnWrapper) lessBtnWrapper.remove()

        lessBtnWrapper = document.createElement('div')
        lessBtnWrapper.className = 'less-bookings-wrapper'
        lessBtnWrapper.style = 'text-align:center;margin-top:1rem;'

        const lessBtn = document.createElement('span')
        lessBtn.innerHTML = /* html */`
          <ks-a-button namespace="button-primary-" color="secondary">
            <span class="less-text">Weniger anzeigen</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowUpRight" size="1em" class="icon-right"></a-icon-mdx>
          </ks-a-button>
        `
        lessBtn.onclick = () => {
          sessionStorage.removeItem('appointmentsOffset')
          lessBtn.innerHTML = ''
          this.renderAppointmentsTiles(limit, 0)
        }
        lessBtnWrapper.appendChild(lessBtn)
        container.appendChild(lessBtnWrapper)
      }

    } else {
      appointmentsDiv.textContent = 'No Bookings'
      sessionStorage.removeItem('appointmentsOffset')
    }
  }

  renderBookingsTiles() {
    const bookingsDiv = this.shadowRoot.querySelector('#bookings .container-bookings')
    if (!bookingsDiv || !this.bookingsData) return

    bookingsDiv.innerHTML = ''

    const allBookings = []
    this.bookingsData.forEach(booking => {
      allBookings.push({
        "title": booking.courseTitle,
        "location": {
          "iconName": "Location",
          "name": booking.courseLocation
        },
        "kurs_typ": booking.courseType,
        "kurs_id": booking.courseId,
        "buttons": [{
          "text": "Detail ansehen",
          "typ": "secondary",
          "event": "open-booking-detail",
          "link": `index.html#/booking?courseId=${booking.courseId}`
        }],
      })
    })

    // @ts-ignore, sort by appointmentDate ascending
    allBookings.sort((a, b) => new Date(a.courseStartDate) - new Date(b.courseStartDate))

    if (allBookings.length) {
      allBookings.forEach(booking => {
        const TileElement = customElements.get('ks-m-tile')
        // @ts-ignore
        const tile = new TileElement()
        tile.setAttribute('class', 'booking-tile')
        tile.setAttribute('namespace', 'tile-default-')
        tile.setAttribute('data', JSON.stringify({
          title: booking.title,
          location: booking.location,
          icons: [],
          buttons: booking.buttons,
          kurs_typ: booking.kurs_typ,
          kurs_id: booking.kurs_id,
          price: {
            amount: booking.price?.amount || booking.price || ''
          }
        })
        )
        bookingsDiv.appendChild(tile)
      })
    } else {
      bookingsDiv.textContent = 'No Bookings'
      sessionStorage.removeItem('appointmentsOffset')
    }
  }
}
