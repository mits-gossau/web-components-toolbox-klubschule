// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class AppointmentsList
* @type {CustomElementConstructor}
*/
export default class AppointmentsList extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    // this.html = 'loading'
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('dialog-open-first-level') || 'dialog-open-first-level', this.dialogListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    this.dispatchEvent(new CustomEvent('request-subscription-course-appointments',
      {
        detail: {
          subscriptionType: '',
          userId: ''
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.removeEventListener(this.getAttribute('dialog-open-first-level') || 'dialog-open-first-level', this.dialogListener)
    this.select.removeEventListener('change', this.selectEventListener)
  }

  dialogListener = (event) => {
    console.log('event', JSON.parse(event.detail.tags[0]))
    this.renderDialog(JSON.parse(event.detail.tags[0]))
  }

  subscriptionCourseAppointmentsListener = (event) => {
    this.html = 'looooooading....'
    this.renderHTML(event.detail.fetch).then(x => {
      this.select = this.root.querySelector('o-grid').root.querySelector('select')
      this.select.addEventListener('change', this.selectEventListener)
    })
  }

  selectEventListener = (event) => {
    console.log(event.target.value)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .list-wrapper {
        display:flex;
        flex-direction: column;
        gap:1em;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {}
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
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'appointments-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  async renderHTML (fetch) {
    return fetch.then(appointments => {
      if (appointments.errorCode !== 0) {
        throw new Error(`${appointments.errorMessage}`)
      }
      const fetchModules = this.fetchModules([
        {
          path: `${this.importMetaUrl}'../../../tile/Tile.js`,
          name: 'm-tile'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/atoms/heading/Heading.js`,
          name: 'ks-a-heading'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
          name: 'o-grid'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
          name: 'm-dialog'
        }
      ])
      return Promise.all([fetchModules]).then(async (children) => {
        this.html = ''
        // const heading = new children[0][1].constructorClass() // eslint-disable-line
        const filter = await this.renderFilterSubscriptions(appointments.filters.subscriptions)
        const dayList = await (await this.renderDayList(appointments.selectedSubscription.dayList, children[0][0], children[0][1]))
        this.renderDialog()
        this.html = /* html */ `
        

            <o-grid namespace="grid-12er-">
              <div col-lg="12" col-md="12" col-sm="12">
                <ks-a-heading tag="h1">${dayList.counter} Angebote</ks-a-heading>
              </div>
              <div col-lg="12" col-md="12" col-sm="12">
               ${filter}
              </div>
              <div col-lg="12" col-md="12" col-sm="12">Filter...</div>
            </o-grid>
            <div class="list-wrapper">
              ${dayList.list.join('')}
            </div>
            `
        return this.html
      })
    })
  }

  renderDialog (data = {}) {
    console.log('render', data.courseTitle)
    this.html = `<m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-first-level" close-event-name="backdrop-clicked">
            <!-- overlayer -->
            <div class="container dialog-header" tabindex="0">
                <div id="back">
                    &nbsp;
                </div>
                <h3>${data.courseTitle}</h3>
                <div id="close">
                    <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
                </div>
            </div>
            <div class="container dialog-content">
                <p class="reset-link">
                    <a-button namespace="button-transparent-">Alles zur&uuml;cksetzen <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                    </a-button>
                </p>
                <div class="sub-content">
                    <a-input inputid="location-search" width="100%" placeholder="Angebot suchen" icon-name="Search" icon-size="calc(20rem/18)" search submit-search="request-auto-complete" any-key-listener type="search"></a-input>
                    <ks-m-filter-categories namespace="filter-default-" lang="de" translation-key-close="Schliessen" translation-key-cta="Angebote" translation-key-reset="zur&uuml;cksetzen"></ks-m-filter-categories>
                </div>
            </div>
            <div class="container dialog-footer">
                <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
                <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events translation-key-cta="Angebote">Angebote</ks-a-number-of-offers-button>
            </div>
        </m-dialog>`
  }

  async renderFilterSubscriptions (subscriptionsData) {
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'

    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      option.value = item.subscriptionId
      option.textContent = item.subscriptionDescription
      select.appendChild(option)
    })

    const sortWrapper = document.createElement('div')
    sortWrapper.innerHTML = select.outerHTML
    return sortWrapper.innerHTML
  }

  async renderDayList (dayList, tileComponent, heading) {
    const list = []
    let counter = 0
    dayList.forEach(day => {
      const dayWrapper = document.createElement('div')
      dayWrapper.appendChild(this.renderDayHeading(day.weekday, heading))
      console.log(day.subscriptionCourseAppointments)
      counter += day.subscriptionCourseAppointments.length
      day.subscriptionCourseAppointments.forEach(appointment => {
        const tile = new tileComponent.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
        const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
        tile.setAttribute('data', `${escapeForHtml(JSON.stringify(appointment))}`)
        dayWrapper.appendChild(tile)
      })
      list.push(dayWrapper.innerHTML)
    })
    const data = {
      counter,
      list
    }
    console.log(counter)
    return data
  }

  renderDayHeading (data, heading) {
    const title = new heading.constructorClass() // eslint-disable-line
    title.setAttribute('tag', 'h2')
    title.innerHTML = data
    return title
  }
}
