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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestBookingsListener = (event) => {
      event.detail.fetch
        .then((data) => {
          this.bookingsData = data.bookings || []
          if (this.modulesLoaded) {
            setTimeout(() => this.renderAppointments(3), 0)
            setTimeout(() => this.renderBookings({ id: '#courses', abo: false }), 0)
            setTimeout(() => this.renderBookings({ id: '#abonnements', abo: true }), 0)
            setTimeout(() => this.renderContinuationCourses(), 0)
          }
        })
        .catch(error => {
          console.error('Error fetching bookings:', error)
        })
    }
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-bookings', this.requestBookingsListener)
    if (!this.bookingsData) this.dispatchEvent(new CustomEvent('request-bookings', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-bookings', this.requestBookingsListener)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div#dashboard')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
      :host h3 {
        color: var(--mdx-sys-color-neutral-bold4);
        font: var(--mdx-sys-font-flex-large-headline3);
      }
      :host .container {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--grid-12er-grid-gap, 1rem);
      }
      :host .container.no-results,
      :host .container.full-width {
        grid-template-columns: 1fr;
      }
      :host #appointments .container .appointment-tile,
      :host .discover .container > * {
        grid-column: span 4;
      }
      :host #courses .container .course-event,
      :host #abonnements .container .course-event {
        grid-column: span 12;
      }
      :host #abonnements a-icon-mdx::part(svg) {
        border: 2px solid black;
        border-radius: 4px;
        padding: 5px;
        margin-right: 5px;
      }
      :host #abonnements ks-m-event::part(head) {
        grid-template-columns: auto;
      }
      @media only screen and (max-width: _max-width_) {
        :host #appointments .container .appointment-tile,
        :host #courses .container .course-event,
        :host .discover .container > * {
          grid-column: span 12;
        }
      }
    `
  }

  renderHTML () {
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
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/tileDiscover/TileDiscover.js`,
        name: 'ks-m-tile-discover'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/event/Event.js`,
        name: 'ks-m-event'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(() => {
      this.modulesLoaded = true
    })

    this.html = /* html */ `
      <div id="dashboard">

        <div id="appointments">
          <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2>
          <div class="container"></div>
        </div>

        <ks-a-spacing type="m-flex"></ks-a-spacing>

        <div id="courses">
          <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine Kurse/Lehrgänge</span></h2>
          <div class="container"></div>
        </div>

        <ks-a-spacing type="m-flex"></ks-a-spacing>

        <div class="discover">
          <h3><span>Unsere Kurse entdecken</span></h3>
          <div class="container">
            <ks-m-tile-discover
              image-src="https://www.klubschule.ch/_campuslogo/logo-de.png"
              tile-label="Klubschule Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
            <ks-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="Klubschule Pro Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
            <ks-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="IBAW Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
          </div>
        </div>

        <ks-a-spacing type="m-flex"></ks-a-spacing>

        <div id="continuation">
          <h2><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> <span>Fortsetzungskurse</span></h2>
          <div class="container no-results">Es finden keine Fortsetzungskurse statt.</div>
        </div>

        <ks-a-spacing type="m-flex"></ks-a-spacing>

        <div class="discover">
          <h3><span>Weitere Kurse entdecken</span></h3>
          <div class="container">
            <ks-m-tile-discover
              image-src="https://www.klubschule.ch/_campuslogo/logo-de.png"
              tile-label="Klubschule Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
            <ks-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="Klubschule Pro Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
            <ks-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="IBAW Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </ks-m-tile-discover>
          </div>  
        </div>

        <ks-a-spacing type="m-flex"></ks-a-spacing>

        <div id="abonnements">
          <h2><a-icon-mdx icon-name="AboPlus" size="0.5em"></a-icon-mdx> <span>Meine Abonnemente</span></h2>
          <div class="container"></div>
        </div>

      </div>
    `
  }

  renderAppointments (count = 3) {
    const appointmentsDiv = this.shadowRoot.querySelector('#appointments .container')
    if (!appointmentsDiv || !this.bookingsData) return

    appointmentsDiv.innerHTML = ''

    // future appointments with course info
    const today = new Date()
    const allAppointments = []
    this.bookingsData.forEach(booking => {
      const futureAppointments = (booking.appointments || []).filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        // @ts-ignore
        return appointmentDate >= today.setHours(0, 0, 0, 0)
      })
      if (futureAppointments.length) {
        futureAppointments.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
        const next = futureAppointments[0]
        allAppointments.push({
          ...next,
          courseTitle: booking.courseTitle,
          courseId: booking.courseId,
          courseLocation: booking.courseLocation,
          roomDescription: booking.roomDescription,
          logoUrl: booking.logoUrl,
          price: booking.price
        })
      }
    })

    // @ts-ignore, sort by appointmentDate ascending
    allAppointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))

    const nextAppointments = allAppointments.slice(0, count)
    if (nextAppointments.length) {
      nextAppointments.forEach(app => {
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
    } else {
      appointmentsDiv.textContent = 'Sie haben keine offenen oder bevorstehenden Termine.'
      appointmentsDiv.classList.add('no-results')
    }
  }

  // render abonnements or booked courses
  renderBookings ({ id = '#courses', abo = false } = {}) {
    const containerDiv = this.shadowRoot.querySelector(`${id} .container`)
    if (!containerDiv || !this.bookingsData) return

    containerDiv.innerHTML = ''

    const filtered = this.bookingsData.filter(course =>
      abo ? course.isSubscription : !course.isSubscription
    )

    filtered.forEach(course => {
      const start = new Date(course.courseStartDate)
      const end = new Date(course.courseEndDate)
      const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''
      const daysEntry = `${abo ? 'Gültigkeitsdauer ' : ''}${formatDate(start)} - ${formatDate(end)}`

      const courseData = {
        course: {
          kurs_typ: course.courseType,
          kurs_id: course.courseId,
          datum_label: course.courseTitle,
          days: [daysEntry],
          location: {
            name: course.courseLocation,
            badge: course.roomDescription || ''
          },
          status: course.courseStatus,
          status_label: course.courseStatusText,
          buttons: [{
            text: abo ? 'Zum Aboportal' : 'Detail ansehen',
            typ: 'secondary',
            event: 'open-booking-detail',
            link: abo ? '#' : `index.html#/booking?courseId=${course.courseId}`
          }],
          icons: []
        },
        sprachid: 'd'
      }

      if (!abo) {
        courseData.course.state_of_booking = 'Gebucht'
        courseData.course.logo_url = course.logoUrl
      }

      const EventElement = customElements.get('ks-m-event')
      // @ts-ignore
      const event = new EventElement()
      event.setAttribute('class', 'course-event')
      if (abo) event.setAttribute('abo-event', '')
      event.setAttribute('data', JSON.stringify(courseData))
      containerDiv.appendChild(event)
    })

    if (!containerDiv.hasChildNodes()) {
      if (abo) this.shadowRoot.querySelector('#abonnements').style.display = 'none'
      containerDiv.textContent = 'Sie haben keine gebuchten Kurse oder Lehrgänge.'
      containerDiv.classList.add('no-results')
    }
  }

  async renderContinuationCourses () {
    const container = this.shadowRoot.querySelector('#continuation .container')
    if (!container) return
    container.innerHTML = ''

    const followUpIds = Array.from(
      new Set(
        (this.bookingsData || [])
          .map(b => b.courseIdFollowUp)
          .filter(id => id && id > 0)
      )
    )

    console.log('followUpIds:', followUpIds)

    if (!followUpIds.length || !container.hasChildNodes()) {
      container.textContent = 'Es finden keine Fortsetzungskurse statt.'
      container.classList.add('no--results')
    }
  }
}
