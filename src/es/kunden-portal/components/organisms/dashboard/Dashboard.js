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
        /* critical styles for LCP optimization */
        min-height: 50vh;
        contain: layout style paint;
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

    this.html = ''

    const gridSkeleton = /* html */`
      <o-grid namespace="grid-12er-">
        <style>
          :host .container {
            display:flex;
            gap: 1em;
          }

          :host > section > div:first-child {
            padding-top: 5em;
          }

          :host > section > div {
            padding-bottom: 5em;
            width: var(--body-section-default-width, 86.666%);
            margin: 0 auto;
          }
          :host .container-next-appointments {
            width: 100%;
          }
          :host .container-discover {
            display: flex;
            gap: 1em;
          }
          :host .container-courses {
            flex-direction: column;
          }
          :host .container-abonnements {
            flex-direction: column;
          }
          :host .container-continuations {
            flex-direction: column;
          }
          :host .discover-our-courses {
            padding-bottom: 1.5em;
          }
          :host .discover-more-courses {
            padding-top: 1.5em;
          }
          :host h2 > a-icon-mdx {
            display: inline-block;
            position: relative;
            top: 4px;
            margin-right: 4px;
          }
          :host h2 > a-icon-mdx[icon-name="AboPlus"] {
            border: 2px solid #262626;
            border-radius: 3.5px;
            height: 32px;
            width: 32px;
            line-height: 26px;
            text-align: center;
            top: -2px;
            margin-right: 6px;
          }
          @media only screen and (max-width:${this.mobileBreakpoint}) {
            :host .container-discover,
            :host .container-appointments,
            :host .container-next-appointments {
              flex-direction: column;
            }
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
        path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
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
      },
      {
        path: `${this.importMetaUrl}'../../../../../../../../src/css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])

    Promise.all([modulePromise, fetch]).then(([modules, fetch]) => {
      // get data for each area
      // const nextAppointmensDataX = this.getNextAppointmentsData(fetch.bookings, 3)
      // const nextAppointmensData = fetch.nextAppointments?.slice(0, 3) || []
      const nextAppointmensData = fetch.nextAppointments?.slice(0, 3).map(appointment => {
        const courseData = fetch.bookings.find(booking => booking.courseId === appointment.courseId) || []
        appointment.isSubscriptionCourse = courseData.isSubscriptionCourse
        return appointment
      })
      const appointmentsData = this.getAppointmensData(fetch.bookings)
      const continuationsData = this.getContinuationsData(fetch.bookings)
      const abonnementsData = this.getAbonnementsData(fetch.bookings)

      // get needed modules
      const tileModule = modules.find(m => m.name === 'kp-m-tile')
      const eventTileModule = modules.find(m => m.name === 'kp-m-event')

      if (tileModule?.constructorClass && eventTileModule?.constructorClass) {
        // next appointments
        this.renderNextAppointments(nextAppointmensData, tileModule, this.nextAppointmentsDiv)
        // my courses
        this.renderBookings(appointmentsData, eventTileModule, this.coursesDiv)
        // my continuations
        this.renderContinuations(continuationsData, eventTileModule, this.continuationsDiv)
        // my abbonements
        this.renderAbbonements(abonnementsData, tileModule, this.abonnementsDiv)
      }
    })
  }

  renderAreaWrapper (area) {
    switch (area) {
      case 'nextAppointments':
        return /* html */ `
          <div id="next-appointments" class="next-appointments">
            <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2>
            <div class="loading-next-appointments">${this.renderLoading()}</div>
            <div class="container-next-appointments container"></div>
        </div>`
      case 'courses':
        return /* html */ `
          <div id="courses" class="courses">
            <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine Kurse/Lehrgänge</span></h2>
            ${this.renderDiscoverTile()}
            <div class="loading-courses">${this.renderLoading()}</div>
            <div class="container-courses container"></div>
        </div>
        </div>`
      case 'continuations':
        return /* html */ `
          <div id="continuations" class="continuations">
            <h2><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> <span>Fortsetzungskurse</span></h2>
            <div class="loading-continuations">${this.renderLoading()}</div>
            <div class="container-continuations container"></div>
            ${this.renderDiscoverMoreTile()}
          </div>`
      case 'abonnements':
        return /* html */ `
          <div id="abonnements" class="abonnements">
            <h2><a-icon-mdx icon-name="AboPlus" size="0.5em"></a-icon-mdx> <span>Meine Abonnemente</span></h2>
            <div class="loading-abonnements">${this.renderLoading()}</div>
            <div id="abonnements" class="container-abonnements container"></div>
          </div>`
      default:
        return ''
    }
  }

  renderContinuations (bookingsData, eventTileComponent, containerDiv) {
    if (!containerDiv || !bookingsData) return

    if (bookingsData.length === 0) {
      this.renderEmptyMessage(containerDiv, 'Es finden keine Fortsetzungskurse statt.', 'no-results')
      return
    }
    bookingsData.forEach(course => {
      // @ts-ignore
      // eslint-disable-next-line new-cap
      const event = new eventTileComponent.constructorClass({})
      event.setAttribute('data', JSON.stringify({
        data: course,
        type: 'continuation'
      }))
      containerDiv.appendChild(event)
    })
    // remove loading indicator if present
    this.continuationsLoadingDiv?.remove()
  }

  renderAbbonements (abonnements, tileComponent, containerDiv) {
    if (!containerDiv || !abonnements) return

    containerDiv.innerHTML = ''

    if (abonnements.length === 0) {
      this.renderEmptyMessage(containerDiv, 'Sie haben keine Abonnemente.')
      return
    }

    // use DocumentFragment for batched DOM operations
    const fragment = document.createDocumentFragment()

    abonnements.forEach(abonnement => {
      const courseData = {
        data: abonnement,
        type: 'abonnement'
      }

      // @ts-ignore
      // eslint-disable-next-line new-cap
      const event = new tileComponent.constructorClass({ namespace: 'tile-abonnement-' })
      event.setAttribute('data', JSON.stringify(courseData))
      fragment.appendChild(event)
    })

    // remove loading indicator if present
    this.abonnementsLoadingDiv?.remove()

    // single DOM update
    containerDiv.appendChild(fragment)
  }

  renderDiscoverTile () {
    return this.renderDiscoverSection({
      title: 'Unsere Kurse entdecken',
      className: 'discover-our-courses'
    })
  }

  renderDiscoverMoreTile () {
    return this.renderDiscoverSection({
      title: 'Weitere Kurse entdecken',
      className: 'discover-more-courses'
    })
  }

  renderDiscoverSection ({ title, className }) {
    // example of translation
    // <a-translation data-trans-key="CP.cpLowAppointmentBalance"></a-translation>
    return /* html */ `
      <div class="discover${className ? ' ' + className : ''}">
        <h3><span>${title}</span></h3>
        <div class="container-discover">
          ${this.discoverTiles.map((tile, i) => /* html */`
            <kp-m-tile-discover
              image-src="${tile.imageSrc}"
              tile-label="${tile.label}"
              link-href="${tile.href}"
              link-text="Kurse entdecken">
            </kp-m-tile-discover>
          `).join('')}
        </div>
      </div>
    `
  }

  renderLoading () {
    return /* html */`
      <mdx-component>
          <mdx-loading-bar></mdx-loading-bar>
      </mdx-component>
    `
  }

  renderNextAppointments (bookingsData, tileComponent, containerDiv) {
    if (!containerDiv || !bookingsData) return

    containerDiv.innerHTML = ''

    if (bookingsData.length === 0) {
      this.renderEmptyMessage(containerDiv, 'Sie haben keine offenen oder bevorstehenden Termine.')
      return
    }

    // use DocumentFragment to batch DOM operations and reduce reflows
    const fragment = document.createDocumentFragment()

    bookingsData.forEach(app => {
      // @ts-ignore
      // eslint-disable-next-line new-cap
      const event = new tileComponent.constructorClass({ namespace: 'tile-next-appointment-' })
      event.setAttribute('data', JSON.stringify({
        data: app,
        type: 'next-appointment',
        location: {
          iconName: 'Location'
        },
        room: {
          iconName: 'Monitor'
        }
      }))
      fragment.appendChild(event)
    })

    // remove loading indicator if present
    this.nextAppointmentsLoadingDiv?.remove()

    // single DOM update
    containerDiv.appendChild(fragment)
  }

  renderBookings (bookingsData, eventTileComponent, containerDiv) {
    if (!containerDiv || !bookingsData) return

    containerDiv.innerHTML = ''

    if (bookingsData.length === 0) {
      // TODO: Translation
      this.renderEmptyMessage(containerDiv, 'Sie haben keine gebuchten Kurse oder Lehrgangen.')
      return
    }

    bookingsData.forEach(course => {
      // @ts-ignore
      // eslint-disable-next-line new-cap
      const event = new eventTileComponent.constructorClass({})
      event.setAttribute('data', JSON.stringify({
        data: course,
        type: 'course'
      }))
      containerDiv.appendChild(event)
    })

    // remove loading indicator if present
    this.coursesLoadingDiv?.remove()
  }

  renderEmptyMessage (divEl, message, errorCssClass = 'no-results') {
    if (!divEl) return
    // TODO: Translation
    divEl.textContent = message
    divEl.classList.add(errorCssClass)
  }

  get discoverTiles () {
    return [
      {
        imageSrc: 'https://www.klubschule.ch/_campuslogo/logo-de.png',
        label: 'Klubschule Kurse',
        href: 'https://www.klubschule.ch/suche/'
      },
      {
        imageSrc: 'https://www.klubschule.ch/media/oz0je4nv/logo-pro-s-neu.png',
        label: 'Klubschule Pro Kurse',
        href: 'https://www.klubschule-pro.ch/suche/'
      },
      {
        imageSrc: 'https://www.klubschule.ch/_campuslogo/logoibaw_zone.png',
        label: 'IBAW Kurse',
        href: 'https://www.ibaw.ch/suche/'
      }
    ]
  }

  getAppointmensData (bookingsData) {
    return bookingsData.filter(course => course.bookingType !== 3 && course.subscriptionType !== 5 && course.courseType !== '7A') || []
  }

  getContinuationsData (bookingData) {
    return bookingData.filter(course => course.bookingType === 3 && course.subscriptionType === 5) || []
  }

  getAbonnementsData (bookingsData) {
    return bookingsData.filter(course => course.courseType === '7A')
  }

  get nextAppointmentsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#next-appointments .container-next-appointments')
  }

  get coursesDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#courses .container-courses')
  }

  get abonnementsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#abonnements .container-abonnements')
  }

  get continuationsDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#continuations .container-continuations')
  }

  get nextAppointmentsLoadingDiv () {
    return this.root.querySelector('o-grid').root.querySelector('.loading-next-appointments')
  }

  get coursesLoadingDiv () {
    return this.root.querySelector('o-grid').root.querySelector('.loading-courses')
  }

  get abonnementsLoadingDiv () {
    return this.root.querySelector('o-grid').root.querySelector('.loading-abonnements')
  }

  get continuationsLoadingDiv () {
    return this.root.querySelector('o-grid').root.querySelector('.loading-continuations')
  }
}
