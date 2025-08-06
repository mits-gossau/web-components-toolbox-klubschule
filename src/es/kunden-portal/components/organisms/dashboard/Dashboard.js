// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Dashboard extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.dashboard
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

  renderHTML () {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../molecules/appointments/Appointments.js`,
        name: 'kp-m-appointments'
      }
    ])
    return Promise.all([fetchModules]).then((children) => {
      console.log('Dashboard children:', children)
      this.html = /* html */`
      <kp-m-appointments></kp-m-appointments>
      <div class="dashboard">
        <h1>Organism - Dashboard</h1>
        <p>Welcome to the dashboard!</p>
      </div>
    `
    })
  }
}
