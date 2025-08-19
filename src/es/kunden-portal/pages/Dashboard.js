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
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    // this.renderHTML()
  }

  disconnectedCallback () {
    // document.body.removeEventListener('update-bookings', this.requestBookingsListener)
  }

  shouldRenderHTML () {
    return this.dashboard
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  get dashboard () {
    return !this.root.querySelector('kp-o-dashboard')
  }

  renderCSS () {
    // this.css = /* css */`
    //   :host h2 {
    //     color: var(--mdx-sys-color-accent-6-onSubtle);
    //     font: var(--mdx-sys-font-flex-large-headline2);
    //   }
    //   :host h2 > span {
    //     position: relative;
    //     top: -4px;
    //   }
    //   :host h3 {
    //     color: var(--mdx-sys-color-neutral-bold4);
    //     font: var(--mdx-sys-font-flex-large-headline3);
    //   }
    //   :host .container {
    //     display: grid;
    //     grid-template-columns: repeat(12, 1fr);
    //     gap: var(--grid-12er-grid-gap, 1rem);
    //   }
    //   :host .container.no-results,
    //   :host .container.full-width {
    //     grid-template-columns: 1fr;
    //   }
    //   :host #appointments .container .appointment-tile,
    //   :host .discover .container > * {
    //     grid-column: span 4;
    //   }
    //   :host #courses .container .course-event,
    //   :host #abonnements .container .course-event {
    //     grid-column: span 12;
    //   }
    //   :host #abonnements a-icon-mdx::part(svg) {
    //     border: 2px solid black;
    //     border-radius: 4px;
    //     padding: 5px;
    //     margin-right: 5px;
    //   }
    //   :host #abonnements ks-m-event::part(head) {
    //     grid-template-columns: auto;
    //   }
    //   @media only screen and (max-width: _max-width_) {
    //     :host #appointments .container .appointment-tile,
    //     :host #courses .container .course-event,
    //     :host .discover .container > * {
    //       grid-column: span 12;
    //     }
    //   }
    // `
  }

  renderHTML () {
    this.fetchModules([{
      path: `${this.importMetaUrl}../components/organisms/dashboard/Dashboard.js`,
      name: 'kp-o-dashboard'
    }])
    this.html = /* html */ '<kp-o-dashboard namespace="dashboard-default-"></kp-o-dashboard>'
  }
}
