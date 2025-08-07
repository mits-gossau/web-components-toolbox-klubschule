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

    // if (!this._rendered) {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../molecules/appointments/Appointments.js`,
        name: 'kp-m-appointments'
      },
      {
        path: `${this.importMetaUrl}'../../../../molecules/nextAppointments/NextAppointments.js`,
        name: 'kp-m-next-appointments'
      }
    ])
    Promise.all([fetchModules]).then((children) => {
      fetch.then(bookings => {
        console.log('Dashboard children:', children, bookings)
        this.html = /* html */`
          <div id="dashboard" class="dashboard">
            <h1>Organism Dashboard</h1>
            <kp-m-appointments bookings="${JSON.stringify(bookings)}"></kp-m-appointments>  
            <h1>Next Appointments</h1>
            <kp-m-next-appointments bookings="${JSON.stringify(bookings)}"></kp-m-next-appointments>
          </div>
          `
      })
      // debugger
      // this._rendered = true
    })
  }
  // }
}
