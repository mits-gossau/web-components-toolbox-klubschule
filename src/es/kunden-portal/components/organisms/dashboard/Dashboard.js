// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

export default class Dashboard extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener('update-bookings', this.updatenBooknigsListener)
    this.dispatchEvent(new CustomEvent('request-bookings',
      {
        detail: {
          log: 'Requesting bookings from Dashboard component'
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-bookings', this.updatenBooknigsListener)
  }

  updatenBooknigsListener = (event) => {
    this.renderHTML(event.detail.fetch)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('kp-o-dashboard')
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
      }
      @media only screen and (max-width: _max-width_) {}
    }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'dashboard-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML (fetch) {
    if (!fetch && !fetch?.then) return

    const gridSkeleton = /* html */`
        <o-grid namespace="grid-12er-">
          <style>
           .container-appointments {
              background-color: yellow;
              display:flex;
              gap:1em;
            }
            .container-discover {
              display:flex;
              gap: 1em;
              padding-bottom: 1em;
            }
            .container-courses {
              display:flex;
              flex-direction: column;
              gap: 1em;
            }
            .container-abonnements {
              display:flex;
              flex-direction: column;
              gap: 1em;
            }
          </style>
          <div col-lg="12" col-md="12" col-sm="12">
            ${this.renderAreaWrapper('nextAppointments')}
          </div>
          <div col-lg="12" col-md="12" col-sm="12">
            ${this.renderAreaWrapper('courses')}
          </div>
          <div col-lg="12" col-md="12" col-sm="12">
            ${this.renderAreaWrapper('continuations')}
          </div>
          <div col-lg="12" col-md="12" col-sm="12">
            ${this.renderAreaWrapper('abonnements')}
          </div>
        </o-grid>
    `
    this.html = gridSkeleton

    const modulePromise = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../../../../src/es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}'../../../../molecules/tile/Tile.js`,
        name: 'kp-m-tile'
      },
      {
        path: `${this.importMetaUrl}'../../../../molecules/event/Event.js`,
        name: 'kp-m-event'
      },
      {
        path: `${this.importMetaUrl}'../../../../molecules/tileDiscover/TileDiscover.js`,
        name: 'kp-m-tile-discover'
      }
    ])

    Promise.all([modulePromise, fetch]).then(([modules, fetch]) => {
      // const bookings = { bookings: fetch.bookings || [] }
      // get data for each area
      const nextAppointmensData = this.getNextAppointmentsData(fetch.bookings, 3)
      const appointmentsData = this.getAppointmensData(fetch.bookings)
      const continuationsData = this.getContinuationsData(fetch.bookings)
      const abonnementsData = this.getAbonnementsData(fetch.bookings)

      // get needed modules
      const tileModule = modules.find(m => m.name === 'kp-m-tile')
      const eventTileModule = modules.find(m => m.name === 'kp-m-event')

      if (tileModule?.constructorClass && eventTileModule?.constructorClass) {
        // nächsten Termine
        this.renderNextAppointments(nextAppointmensData, tileModule, this.appointmentsDiv)
        // meine Kurse/lehrgänge
        this.renderBookings(appointmentsData, eventTileModule, this.coursesDiv)
        // meine Fortsetzungen
        this.renderContinuations(continuationsData, eventTileModule, this.continuationsDiv)
        // meine Abonnements
        this.renderAbbonements({ id: '#abonnements', abo: true }, fetch, tileModule, this.abonnementsDiv, abonnementsData)
      }
    })
  }

  renderAreaWrapper (area) {
    switch (area) {
      case 'nextAppointments':
        return /* html */ `
          <div id="appointments" class="appointments">
            <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2>
            <div class="container-appointments"></div>
        </div>`
      case 'courses':
        return /* html */ `
          <div id="courses" class="courses">
            <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine Kurse/Lehrgänge</span></h2>
            ${this.renderDiscoverTile()}
            <div class="container-courses"></div>
        </div>
        </div>`
      case 'continuations':
        return /* html */ `
          <div id="continuation">
            <h2><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> <span>Fortsetzungskurse</span></h2>
            <!--<div class="container no-results">Es finden keine Fortsetzungskurse statt.</div>-->
            <div id="continuations" class="container-continuations"></div>
            ${this.renderDiscoverMoreTile()}
          </div>`
      case 'abonnements':
        return /* html */ `
          <div id="abonnements">
            <h2><a-icon-mdx icon-name="AboPlus" size="0.5em"></a-icon-mdx> <span>Meine Abonnemente</span></h2>
            <div class="container-abonnements"></div>
          </div>`
      default:
        return ''
    }
  }

  renderContinuations (bookingsData, tileComponent, containerDiv) {
    if (!containerDiv || !bookingsData) return

    if (bookingsData.length === 0) {
      containerDiv.textContent = 'Es finden keine Fortsetzungskurse statt.'
      containerDiv.classList.add('no--results')
      return
    }
    bookingsData.forEach(course => {
      // TODO: render html for continuation courses
    })
  }

  renderAbbonements ({ id = '#abonnements', abo = true } = {}, bookingsData, tileComponent, containerDiv, abonnements) {
    if (!containerDiv || !abonnements) return

    if (abonnements.length === 0) {
      containerDiv.textContent = 'Sie haben keine Abonnemente.'
      containerDiv.classList.add('no-results')
      return
    }

    abonnements.forEach(course => {
      const start = new Date(course.courseStartDate)
      const end = new Date(course.courseEndDate)
      const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''
      const daysEntry = `${abo ? 'Gültigkeitsdauer ' : ''}${formatDate(start)} - ${formatDate(end)}`

      const courseData = {
        type: 'abonnement',
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

      // @ts-ignore
      const event = new tileComponent.constructorClass({ namespace: 'tile-appointment-' })
      event.setAttribute('class', 'course-event')
      event.setAttribute('abo-event', '')
      event.setAttribute('data', JSON.stringify(courseData))
      containerDiv.appendChild(event)
    })
  }

  renderDiscoverTile () {
    return /* html */ `
      <div class="discover">
        <h3><span>Unsere Kurse entdecken</span></h3>
        <div class="container-discover">
          <kp-m-tile-discover
            image-src="https://www.klubschule.ch/_campuslogo/logo-de.png"
            tile-label="Klubschule Kurse"
            link-href="#"
            link-text="Kurse entdecken">
          </kp-m-tile-discover>
          <kp-m-tile-discover
            image-src="https://picsum.photos/40/40"
            tile-label="Klubschule Pro Kurse"
            link-href="#"
            link-text="Kurse entdecken">
          </kp-m-tile-discover>
          <kp-m-tile-discover
            image-src="https://picsum.photos/40/40"
            tile-label="IBAW Kurse"
            link-href="#"
            link-text="Kurse entdecken">
          </kp-m-tile-discover>
        </div>
      </div>`
  }

  renderDiscoverMoreTile () {
    return /* html */ `
    <div class="discover">
          <h3><span>Weitere Kurse entdecken</span></h3>
          <div class="container-discover">
            <kp-m-tile-discover
              image-src="https://www.klubschule.ch/_campuslogo/logo-de.png"
              tile-label="Klubschule Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </kp-m-tile-discover>
            <kp-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="Klubschule Pro Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </kp-m-tile-discover>
            <kp-m-tile-discover
              image-src="https://picsum.photos/40/40"
              tile-label="IBAW Kurse"
              link-href="#"
              link-text="Kurse entdecken">
            </kp-m-tile-discover>
          </div>
        </div>
    `
  }

  renderNextAppointments (bookingsData, tileComponent, containerDiv, nextAppointmentsData, count = 3) {
    if (!containerDiv || !bookingsData) return

    if (bookingsData.length === 0) {
      containerDiv.textContent = 'Sie haben keine offenen oder bevorstehenden Termine.'
      containerDiv.classList.add('no-results')
      return
    }

    bookingsData.forEach(app => {
      const event = new tileComponent.constructorClass({ namespace: 'tile-appointment-' })
      event.setAttribute('class', 'appointment-tile')
      event.setAttribute('namespace', 'tile-appointment-')
      event.setAttribute('data', JSON.stringify({
        type: 'appointment',
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
      }
      ))
      containerDiv.appendChild(event)
    })
  }

  // render abonnements or booked courses
  renderBookings (bookingsData, eventTileComponent, containerDiv, abo = false) {
    if (!containerDiv || !bookingsData) return

    if (bookingsData.length === 0) {
      containerDiv.textContent = 'Sie haben keine gebuchten Kurse oder Lehrgänge.'
      containerDiv.classList.add('no-results')
      return
    }

    bookingsData.forEach(course => {
      debugger
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

      // TODO: remove if not needed
      if (!abo) {
        courseData.course.state_of_booking = 'Gebucht'
        courseData.course.logo_url = course.logoUrl
      }

      // @ts-ignore
      const event = new eventTileComponent.constructorClass({})
      event.setAttribute('class', 'course-event')
      // TODO: remove abo-event attribute if not needed
      if (abo) event.setAttribute('abo-event', '')
      event.setAttribute('data', JSON.stringify(courseData))
      containerDiv.appendChild(event)
    })
  }

  getNextAppointmentsData (bookingsData, count = 3) {
    const appointments = bookingsData.filter(course => course.appointments && course.appointments.length > 0)
    const dates = []

    // create a list of all appointments per course
    // the list is sorted by appointment date (earliest first)
    // only keep the appointment date, no other information
    // this is done to find the next appointment (newest one in the future)
    appointments.flatMap(course => {
      const sortedAppointments = course.appointments
        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
        .map(app => ({ appointmentDate: app.appointmentDate }))
      dates.push({
        courseId: course.courseId,
        appointments: sortedAppointments
      })
    })

    // find the next three upcoming appointments for each course
    const newestAppointments = dates
      .map(({ courseId, appointments }) => {
        // find the first future appointment for the course
        const upcomingAppointment = appointments.find(({ appointmentDate }) => new Date(appointmentDate) > new Date())
        return { courseId, upcomingAppointment }
      })
      // filter out courses without upcoming appointments
      .filter(({ upcomingAppointment }) => upcomingAppointment)
      // sort by the soonest upcoming appointment date
      .sort((a, b) => new Date(a.upcomingAppointment.appointmentDate).getTime() - new Date(b.upcomingAppointment.appointmentDate).getTime())
      // limit the results to the top 3
      .slice(0, count)

    const nextAppointments = newestAppointments.map(entry => {
      const courseId = entry.courseId
      const course = bookingsData.find(course => course.courseId === courseId)
      // filter only future appointments
      const futureAppointments = course.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // set today's date to the beginning of the day
        return appointmentDate >= today // return true for future appointments
      })
      course.appointments = futureAppointments // update course appointments to only future ones
      return course
    }).sort((a, b) => {
      // sort courses based on the next appointment date
      const today = new Date()
      today.setHours(0, 0, 0, 0) // normalize today to start of the day
      // get the date of the first appointment for comparison
      const appointmentDateA = new Date(a.appointments[0].appointmentDate)
      const appointmentDateB = new Date(b.appointments[0].appointmentDate)
      const diffA = appointmentDateA.getTime() - today.getTime()
      const diffB = appointmentDateB.getTime() - today.getTime()
      // if both appointments are in the past, sort by the most recent
      if (diffA < 0 && diffB < 0) return diffB - diffA
      // if A's appointment is in the past, B comes first
      if (diffA < 0) return 1
      // if B's appointment is in the past, A comes first
      if (diffB < 0) return -1
      // if both are in the future, sort by the closest
      return diffA - diffB
    })

    return nextAppointments
  }

  getAppointmensData (bookingsData) {
    return bookingsData.filter(course => course.bookingType !== 3 && course.subscriptionType !== 5) || []
  }

  getContinuationsData (bookingData) {
    return bookingData.filter(course => course.bookingType === 3 && course.subscriptionType === 5) || []
  }

  getAbonnementsData (bookingsData) {
    return bookingsData.filter(course => course.courseType === '7A')
  }

  get appointmentsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#appointments .container-appointments')
    /* const appointmentsDiv = this.shadowRoot.querySelector('#appointments .container')
    const appointmentsDiv = this.shadowRoot.querySelector('o-grid').root.querySelector('#appointments .container-appointments') */
  }

  get coursesDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#courses .container-courses')
  }

  get abonnementsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#abonnements .container-abonnements')
  }

  get continuationsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#continuations.container-continuations')
  }
}
