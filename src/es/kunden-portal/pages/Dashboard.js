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
            setTimeout(() => this.renderAppointments(), 0)
            setTimeout(() => this.renderCourses(), 0)
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
      :host #appointments .container .appointment-tile {
        grid-column: span 4;
      }
      :host #courses .container .course-event {
        grid-column: span 12;
      }



      :host #discover .container .tile {
         grid-column: span 4;
      }
      :host .tile-discover {
        display: grid;
        grid-template-columns: fit-content(100%) 1fr;
        gap: 24px;
        background-color: white;
        border: 1px solid #737373;
        padding: 24px;
      }
      :host .tile-discover > div:last-child p {
        margin: 0;
        padding: 0;
      }
      :host .tile-discover > div:last-child p.label {
        color: var(--mdx-sys-color-neutral-bold4);
        font: var(--mdx-sys-font-fix-body1);
      }
      :host .tile-discover > div:last-child a {
        color: #0053A6;
        text-decoration: none;
      }
      :host .tile-discover > div:last-child a-icon-mdx {
        color: #0053A6;
        display: inline-block;
        position: relative;
        top: 2px;
      }



      @media only screen and (max-width: _max-width_) {
        :host #appointments .container .appointment-tile,
        :host #courses .container .course-event,
        :host #discover .container .tile {
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
        <div id="discover">
          <h3><span>Unsere Kurse entdecken</span></h3>
          <div class="container">
            <div class="tile tile-discover">
              <div>
                <img src="https://picsum.photos/40/40" height="40" width="40" />
              </div>
              <div>
                <p class="label">Klubschule Kurse<p>
                <p><a href="#">Kurse entdecken <a-icon-mdx icon-name="ExternalLink" size="1em"></a-icon-mdx></a><p>
              </div>
            </div>
            <div class="tile tile-discover">
              <div>
                <img src="https://picsum.photos/40/40" height="40" width="40" />
              </div>
              <div>
                <p class="label">Klubschule Pro Kurse<p>
                <p><a href="#">Kurse entdecken <a-icon-mdx icon-name="ExternalLink" size="1em"></a-icon-mdx></a><p>
              </div>
            </div>
            <div class="tile tile-discover">
              <div>
                <img src="https://picsum.photos/40/40" height="40" width="40" />
              </div>
              <div>
                <p class="label">IBAW Kurse<p>
                <p><a href="#">Kurse entdecken <a-icon-mdx icon-name="ExternalLink" size="1em"></a-icon-mdx></a><p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderAppointments(limit = 6, offset = Number(sessionStorage.getItem('appointmentsOffset')) || 0) {
    const appointmentsDiv = this.shadowRoot.querySelector('#appointments .container')
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
          this.renderAppointments(limit, offset + limit)
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
          this.renderAppointments(limit, 0)
        }
        lessBtnWrapper.appendChild(lessBtn)
        container.appendChild(lessBtnWrapper)
      }

    } else {
      appointmentsDiv.textContent = 'Sie haben keine offenen oder bevorstehenden Termine.'
      appointmentsDiv.classList.add('no-results')
      sessionStorage.removeItem('appointmentsOffset')
    }
  }

  renderCourses() {
    const coursesDiv = this.shadowRoot.querySelector('#courses .container')
    if (!coursesDiv || !this.bookingsData) return
    
    coursesDiv.innerHTML = ''

    this.bookingsData.forEach(course => {
      // Format days entry from start and end date
      const start = new Date(course.courseStartDate)
      const end = new Date(course.courseEndDate)
      const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth()+1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''
      const daysEntry = `${formatDate(start)} - ${formatDate(end)}`

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
          state_of_booking: 'Gebucht',
          logo_url: course.logoUrl,
          status: course.courseAppointmentStatus,
          status_label: course.courseAppointmentStatusText,
          buttons: [{
            text: 'Detail ansehen',
            typ: 'secondary',
            event: 'open-booking-detail',
            link: `index.html#/booking?courseId=${course.courseId}`
          }],
          icons: [],
        },
        sprachid: 'd'
      }

      const EventElement = customElements.get('ks-m-event')
      // @ts-ignore
      const event = new EventElement()
      event.setAttribute('class', 'course-event')
      event.setAttribute('data', JSON.stringify(courseData))
      coursesDiv.appendChild(event)
    })

    if (!coursesDiv.hasChildNodes()) {
      coursesDiv.textContent = 'Sie haben keine gebuchten Kurse oder Lehrgänge.'
      coursesDiv.classList.add('no-results')
      sessionStorage.removeItem('appointmentsOffset')
    }
  }
}