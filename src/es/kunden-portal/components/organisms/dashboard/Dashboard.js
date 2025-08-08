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
    debugger
    this.renderHTML(event.detail.fetch)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    debugger
    return !this._rendered

    // return !this.root.querySelector('kp-m-appointments')
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
    // this.html = this.renderArea('appointments') + this.renderArea('courses') + this.renderArea('nextAppointments') + this.renderArea('abonnements') + this.renderArea('continuations')

    this.fetchModules([
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
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }
    ])

    const gridSkeleton = /* html */`
      <o-grid namespace="grid-12er-">
        <div col-lg="12" col-md="12" col-sm="12">
          ${this.renderArea('nextAppointments')}
        </div>
        <div col-lg="12" col-md="12" col-sm="12">
          ${this.renderArea('courses')}
        </div>
        <div col-lg="12" col-md="12" col-sm="12">
          ${this.renderArea('continuations')}
        </div>
        <div col-lg="12" col-md="12" col-sm="12">
          ${this.renderArea('abonnements')}
        </div>
      </o-grid>
      
         
          `

    this.html = gridSkeleton

    fetch.then(bookings => {
      console.log('Dashboard children:', bookings, this.html)
      // this.html = /* html */`

      //     <div id="dashboard" class="dashboard">
      //       <h1>Organism Dashboard</h1>
      //       <kp-m-appointments bookings="${JSON.stringify(bookings)}"></kp-m-appointments>
      //       <h1>Next Appointments</h1>
      //       <kp-m-next-appointments bookings="${JSON.stringify(bookings)}"></kp-m-next-appointments>
      //     </div>
      //     `
    })
  }

  renderArea (area) {
    switch (area) {
      case 'nextAppointments':
        return /* html */ ` 
          <div id="appointments" class="daappointmentsshboard">
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
