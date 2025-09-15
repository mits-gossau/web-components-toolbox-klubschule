// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class Header
* @type {CustomElementConstructor}
*/
export default class Header extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())

    Promise.all(showPromises).then(() => {
      this.hidden = false
      if (this.topStage) this.topStage.addEventListener('click', this.topStateLink())
      document.body.addEventListener('update-status-monitor', this.updatenStatusMonitorListener)
      this.dispatchEvent(new CustomEvent('request-status-monitor',
        {
          detail: {
            log: 'Requesting status-monitor from Header component',
            comppleted: false
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    })
  }

  disconnectedCallback () {
    if (this.topStage) this.topStage.removeEventListener('click', this.topStateLink())
    document.body.removeEventListener('update-status-monitor', this.updatenStatusMonitorListener)
  }

  updatenStatusMonitorListener = (event) => {
    this.renderNotifications(event.detail.fetch)
  }

  renderNotifications (fetch) {
    if (!fetch && !fetch?.then) return
    if (this.notificationsWrapper) {
      fetch.then(data => {
        this.notificationsWrapper.innerHTML = data.statusmessages.map(notification => this.renderNotificationItem(notification))
      })
    }
  }

  renderNotificationItem (data) {
    const { courseTitle, courseId, courseType } = data
    const link = `#/booking?courseId=${courseId}&courseType=${courseType}`
    return /* html */ `
      <kp-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle" >
        <div slot="description">
          <p>${courseTitle}</p>
          <a-link namespace="underline-" >
            <a href="${link}">Details ansehen</a>
          </a-link>
        </div>
      </kp-m-system-notification>
    `
  }

  topStateLink () {
    // TODO: use attribute to define link action
    return () => {
      window.history.back()
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.bodySectionWrapper
  }

  /**
   * renders the css
   * @returns Promise<void>
   */
  renderCSS () {
    // TODO: set correct mdx stuff
    this.css = /* css */`
      :host {
        display: block;
      }
      :host #top-stage {
        cursor: pointer;
        background-color: #0053A6;
        color: white;
        padding: 24px 96px 24px 24px;
      }
      :host #top-stage > a-icon-mdx {
        display: inline-block;
        position: relative;
        top: 2px;
      }
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
    
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
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
      case 'header-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false) // using showPromises @connectedCallback makes hide action inside Shadow.fetchCSS obsolete, so second argument hide = false
      case 'header-bookings-booked-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./bookings-booked-/bookings-booked-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false) // using showPromises @connectedCallback makes hide action inside Shadow.fetchCSS obsolete, so second argument hide = false
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../components/organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../systemNotification/SystemNotification.js`,
        name: 'kp-m-system-notification'
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/link/Link.js`,
        name: 'a-link'
      }
    ])
    const namespace = this.getAttribute('namespace') || 'header-default-'
    switch (namespace) {
      case 'header-default-':
        this.html = this.renderHeaderDefault()
        break
      case 'header-bookings-booked-':
        this.html = this.renderHeaderBookingsBooked()
        break
      default:
        this.html = this.renderHeaderDefault()
        break
    }
  }

  renderHeaderBookingsBooked () {
    return /* html */ `
      <div id="top-stage">
        <a-icon-mdx icon-name="ArrowLeft" size="1em" color="white"></a-icon-mdx> Meine Kurse / Lehrgänge
      </div>
    `
  }

  renderHeaderDefault () {
    return /* html */ `
      <ks-o-body-section variant="default" no-margin-y="" background-color="#0053A6">
        <o-grid namespace="grid-12er-">
          <style>
            :host {
              --h1-color: white;
              --h1-margin: 0 0 0.7em 0;
            }
            :host p {
              color: white;
            }
            :host > section > div {
              padding-top: 2.5em;
            }
            :host kp-m-system-notification {
              margin-bottom: 1em;
            }
          </style>
          <div col-lg="12" col-md="12" col-sm="12">
            <h1>${this.getGreeting()} Uservorname Usernachname</h1>
            <p>Hier können Sie Ihre Kurse verwalten und erhalten alle relevanten Informationen.</p>
            <div id="notifications">
              <!--<kp-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle" >
              <div slot="description">
                <p>System Notification Default (Primary) No Border</p>
                <a-link namespace="underline-">
                  <a>asdf  Mehr erfahren </a>
                </a-link>
              </div>
            </kp-m-system-notification>-->
            </div>
            <br>
            <kp-m-system-notification namespace="system-notification-warning-" icon-name="AlertTriangle" no-border is-closeable>
              <div slot="description">
                <p>System Notification Default (Primary) No Borderww </p>
                <a-link namespace="underline-">
                  <a> Mehr erfahren </a>
                </a-link>
              </div>
            </kp-m-system-notification>
          </div>
        </o-grid>
      </ks-o-body-section>
    `
  }

  getGreeting (date = new Date()) {
    const hour = date.getHours()
    if (hour >= 5 && hour < 11) {
      return 'Guten Morgen'
    } else if (hour >= 11 && hour < 17) {
      return 'Guten Tag'
    } else if (hour >= 17 && hour < 22) {
      return 'Guten Abend'
    } else {
      return 'Gute Nacht'
    }
  }

  get bodySectionWrapper () {
    return this.root.querySelector('ks-o-body-section')
  }

  get topStage () {
    return this.root.querySelector('#top-stage')
  }

  get notificationsWrapper () {
    return this.root.querySelector('ks-o-body-section').root.querySelector('o-grid').root.querySelector('#notifications')
  }
}
