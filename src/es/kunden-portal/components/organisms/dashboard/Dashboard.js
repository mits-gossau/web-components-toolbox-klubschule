// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

export default class Dashboard extends Shadow() {
  _rendered
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this._rendered = false
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    // if (this.shouldRenderHTML()) this.renderHTML()
    this.renderHTML()
    // this.dispatchEvent(new CustomEvent('request-bookings', { bubbles: true, cancelable: true, composed: true }))
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
    return !this._rendered
  }

  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
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
    debugger

    if (!fetch && !fetch?.then) return

    // wait until fetch and modules are available
    const waitForDependencies = () => {
      return new Promise((resolve) => {
        const checkAvailability = () => {
          if (typeof window.fetch !== 'undefined' && this.fetchModules && typeof this.fetchModules === 'function') {
            resolve()
          } else {
            // Warten und erneut prüfen
            setTimeout(checkAvailability, 10)
          }
        }
        checkAvailability()
      })
    }

    return waitForDependencies().then(() => {
      const gridSkeleton = /* html */`
        <o-grid namespace="grid-12er-">
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

      // load modules now and wait for fetch data at the same time
      const modulePromise = this.fetchModules([
        {
          path: `${this.importMetaUrl}'../../../../molecules/appointments/Appointments.js`,
          name: 'kp-m-appointments'
        },
        {
          path: `${this.importMetaUrl}'../../../../molecules/nextAppointments/NextAppointments.js`,
          name: 'kp-m-next-appointments'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
          name: 'a-icon-mdx'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../../../../src/es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
          name: 'o-grid'
        },
        {
          path: `${this.importMetaUrl}'../../../../molecules/tile/Tile.js`,
          name: 'kp-m-tile'
        }
      ])

      // waiting for both: modules AND fetch data
      return Promise.all([modulePromise, fetch])
    }).then(([modules, bookings]) => {
      // nou now have access to BOTH modules AND bookings!
      console.log('Loaded modules:', modules)
      console.log('Loaded bookings:', bookings)

      // find modules by name
      const appointmentsModule = modules.find(m => m.name === 'kp-m-appointments')
      const nextAppointmentsModule = modules.find(m => m.name === 'kp-m-next-appointments')
      const iconModule = modules.find(m => m.name === 'a-icon-mdx')
      const gridModule = modules.find(m => m.name === 'o-grid')
      const tileModule = modules.find(m => m.name === 'kp-m-tile')

      // save modules AND bookings for later access
      this.loadedModules = {
        appointments: appointmentsModule,
        nextAppointments: nextAppointmentsModule,
        icon: iconModule,
        grid: gridModule,
        tile: tileModule
      }

      this.bookingsData = bookings

      // now you can use modules AND bookings!
      if (appointmentsModule?.constructorClass && bookings) {
        console.log('Creating appointments element with bookings:', bookings)
        const appointmentsElement = new appointmentsModule.constructorClass()
        appointmentsElement.setAttribute('bookings', JSON.stringify(bookings))
        appointmentsElement.setAttribute('namespace', 'appointments-default-')

        // add element to the DOM
        const appointmentsDiv = this.root.querySelector('o-grid')?.root?.querySelector('div#appointments')
        if (appointmentsDiv) {
          appointmentsDiv.appendChild(appointmentsElement)
        }
      }

      if (nextAppointmentsModule?.constructorClass && bookings) {
        console.log('Creating next appointments element with bookings:', bookings)
        const nextAppointmentsElement = new nextAppointmentsModule.constructorClass()
        nextAppointmentsElement.setAttribute('bookings', JSON.stringify(bookings))
        nextAppointmentsElement.setAttribute('namespace', 'next-appointments-default-')

        // add element to the DOM
        const appointmentsDiv = this.root.querySelector('o-grid')?.root?.querySelector('div#appointments')
        if (appointmentsDiv) {
          appointmentsDiv.appendChild(nextAppointmentsElement)
        }
      }

      if (tileModule?.constructorClass && bookings) {
        console.log('Tile module loaded, can create tiles with bookings')
        // Erstelle Tiles für jede Buchung
        bookings.forEach((appointment, index) => {
          const tileElement = this.makeTileComponent(tileModule, appointment, null)
          // Füge Tiles zu entsprechenden Bereichen hinzu
        })
      }

      debugger
    }).catch((e) => {
      console.error('Error fetching modules or bookings:', e)
    })
    // fetch.then(bookings => {
    //   console.log('Dashboard children:', bookings, this.html)
    //   const nextAppointments = this.renderNextAppointments(bookings)
    //   console.log('Next Appointments HTML:', nextAppointments)
    //   this.html = nextAppointments
    //   debugger
    //   // this.html = /* html */`

    //   //     <div id="dashboard" class="dashboard">
    //   //       <h1>Organism Dashboard</h1>
    //   //       <kp-m-appointments bookings="${JSON.stringify(bookings)}"></kp-m-appointments>
    //   //       <h1>Next Appointments</h1>
    //   //       <kp-m-next-appointments bookings="${JSON.stringify(bookings)}"></kp-m-next-appointments>
    //   //     </div>
    //   //     `
    // })
  }

  renderNextAppointments (bookings) {
    const div = this.root.querySelector('o-grid').root.querySelector('div#appointments')
    if (!div) {
      console.warn('No appointments div found in the grid.')
      return ''
    }
    debugger
    const tileElement = this.makeTileComponent()
    // tileElement.setAttribute('bookings', JSON.stringify(bookings))
    div.appendChild(tileElement)
    return div.innerHTML
  }

  makeTileComponent (tile, appointment, selectedSubscription) {
    // const appointmentData = this.cleanAndStringifyData(appointment)
    // const selectedSubscriptionData = this.cleanAndStringifyData(selectedSubscription)
    const tileComponent = new tile.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
    // tileComponent.setAttribute('data', `${appointmentData}`)
    // tileComponent.setAttribute('data-id', `${makeUniqueCourseId(appointment)}`)
    // tileComponent.setAttribute('data-selected-subscription', `${selectedSubscriptionData}`)
    tileComponent.setAttribute('data-list-type', this.dataset.listType || '')
    return tileComponent
  }

  renderAreaWrapper (area) {
    switch (area) {
      case 'nextAppointments':
        return /* html */ `
          <div id="appointments" class="appointments">
            <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>Meine nächsten Termine</span></h2 >
        </div>`
      case 'courses':
        return /* html */ `
          <div id="courses">
            <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Meine Kurse/Lehrgänge</span></h2>
          </div>`
      case 'continuations':
        return /* html */ `
          <div id="continuation">
            <h2><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> <span>Fortsetzungskurse</span></h2>
            <div class="container no-results">Es finden keine Fortsetzungskurse statt.</div>
          </div>`
      case 'abonnements':
        return /* html */ `
          <div id="abonnements">
            <h2><a-icon-mdx icon-name="AboPlus" size="0.5em"></a-icon-mdx> <span>Meine Abonnemente</span></h2>
          </div>`
      default:
        return ''
    }
  }
}
