// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

export default class BookingsBooked extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.cachedData = null
    this.cacheTimestamp = null
    this.cacheExpiryTime = 5 * 60 * 1000
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.isCacheEnabled && this.hasCachedData()) {
      if (this.shouldRenderHTML()) this.renderHTML()
      this.renderWithCachedData()
    } else {
      if (this.shouldRenderHTML()) this.renderHTML()
      document.body.addEventListener('update-bookings-booked', this.updatenBooknigsListener)
      this.dispatchEvent(new CustomEvent('request-bookings-booked',
        {
          detail: {
            log: 'Requesting bookings booked from BookingBooked component',
            completed: true
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    }
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-bookings-booked', this.updatenBooknigsListener)
  }

  hasCachedData () {
    if (!this.isCacheEnabled) return false

    if (!this.cachedData || !this.cacheTimestamp) return false

    const now = Date.now()
    return (now - this.cacheTimestamp) < this.cacheExpiryTime
  }

  renderWithCachedData () {
    if (!this.cachedData) return

    this.renderHTML(Promise.resolve(this.cachedData))
  }

  updatenBooknigsListener = (event) => {
    if (this.isCacheEnabled) {
      this.cachedData = event.detail.fetch
      this.cacheTimestamp = Date.now()
    }
    this.renderHTML(event.detail.fetch)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('o-grid')
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
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
      case 'bookings-booked-default-':
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

    this.html = /* html */`
      <kp-m-loading text="Meine abgeschlossenen Kurse werden geladen..." size="large"></k-m-loading>
    `

    const gridSkeleton = /* html */`
      <kp-m-header namespace="header-bookings-booked-" style="display: none;"></kp-m-header>
      <o-grid namespace="grid-12er-" style="display: none;">
        <style>
          :host .container {
            display:flex;
            gap: 1em;
          }
          :host > section > div:first-child {
            padding-top: 3em;
          }
          :host > section > div {
            width: var(--body-section-default-width, 86.666%);
            margin: 0 auto;
          }
          :host > section > div .container {
            margin-bottom: 5em;
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
          :host .link-completet-courses {
            font-weight: 500;
            font-size: 1.125em;
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
            ${this.renderAreaWrapper()}
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
        path: `${this.importMetaUrl}'../../../../molecules/loading/Loading.js`,
        name: 'kp-m-loading'
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
      },
      {
        path: `${this.importMetaUrl}'../../../../molecules/header/Header.js`,
        name: 'kp-m-header'
      },
      {
        path: `${this.importMetaUrl}../../../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      }
    ])

    Promise.all([modulePromise, fetch]).then(([modules, fetch]) => {
      if (this.loading) this.loading.remove()
      this.grid.style.display = 'block'
      this.header.style.display = 'block'

      const appointmentsData = this.getAppointmensData(fetch.bookings)

      const tileModule = modules.find(m => m.name === 'kp-m-tile')
      const eventTileModule = modules.find(m => m.name === 'kp-m-event')

      if (tileModule?.constructorClass && eventTileModule?.constructorClass) {
        this.renderBookings(appointmentsData, eventTileModule, this.coursesDiv)
      }
    })
  }

  renderAreaWrapper () {
    return /* html */ `
      <div id="courses" class="courses" style="display:none;">
        <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine abgeschlossenen Kurse</span></h2>
        <div class="container-courses container"></div>
      </div>`
  }

  renderBookings (bookingsData, eventTileComponent, containerDiv) {
    if (!containerDiv || !bookingsData) return

    if (bookingsData.length === 0) {
      this.hideSection(this.courseSection)
      return
    }

    if (this.courseSection) this.showSection(this.courseSection)

    containerDiv.innerHTML = ''

    // sort by date ascending
    // deep clone to avoid mutating original data
    bookingsData = this.sortByDateAsc(JSON.parse(JSON.stringify(bookingsData)))

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

  getAppointmensData (bookingsData) {
    return bookingsData.filter(course => course.subscriptionType !== 5 && course.courseType !== '7A' && !course.isSingleAppointmentBooking) || []
  }

  hideSection (divEl) {
    divEl.style.display = 'none'
  }

  showSection (divEl) {
    divEl.style.display = 'block'
  }

  sortByDateAsc (bookings) {
    return bookings.sort((a, b) => {
      const dateA = new Date(a.courseStartDate)
      const dateB = new Date(b.courseStartDate)

      const timeA = a.courseStartTime.split(':').map(Number)
      const timeB = b.courseStartTime.split(':').map(Number)

      if (dateA < dateB) return -1
      if (dateA > dateB) return 1

      if (dateA.getTime() === dateB.getTime()) {
        if (timeA[0] < timeB[0]) return -1
        if (timeA[0] > timeB[0]) return 1

        if (timeA[1] < timeB[1]) return -1
        if (timeA[1] > timeB[1]) return 1

        if (a.courseStartTime < b.courseStartTime) return -1
        if (a.courseStartTime > b.courseStartTime) return 1
      }

      return 0
    })
  }

  get grid () {
    return this.root.querySelector('o-grid')
  }

  get header () {
    return this.root.querySelector('kp-m-header')
  }

  get loading () {
    return this.root.querySelector('kp-m-loading')
  }

  get courseSection () {
    return this.root.querySelector('o-grid').root.querySelector('#courses')
  }

  get coursesDiv () {
    return this.root.querySelector('o-grid').root.querySelector('#courses .container-courses')
  }

  get coursesLoadingDiv () {
    return this.root.querySelector('o-grid').root.querySelector('.loading-courses')
  }

  get isCacheEnabled () {
    return !this.hasAttribute('disable-cache')
  }
}
