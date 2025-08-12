// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'

/* global self */

/**
 * @export
 * @class AppointmentTile
 * @type {CustomElementConstructor}
 */
export default class AppointmentTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
    // if (this.shouldRenderHTML()) this.renderHTML()
    // this.renderHTML()
  }

  // shouldRenderHTML () {
  //   debugger
  //   return !this.querySelector('kp-m-tile')
  // }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host > div {
        background-color: blue;
        display: flex;
        flex-direction: column;
      }
      
      @media only screen and (max-width: _max-width_) {
       
      }
    `
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'tile-appointment-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-appointment-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/customer-portal/components/molecules/tile/course-appointment-/course-appointment-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return this.fetchCSS()
    }
  }

  renderHTML () {
    debugger

    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/molecules/loadTemplateTag/LoadTemplateTag.js`,
        name: 'm-load-template-tag'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
    return Promise.all([fetchModules]).then((_) => {
      const data = Tile.parseAttribute(this.getAttribute('data'))
      debugger
      if (data.type === 'appointment') {
        this.html = this.renderAppointment(data)
      } else if (data.type === 'course') {
        this.html = this.renderCourse(data)
      } else if (data.type === 'abonnement') {
        this.html = this.renderAbbonements(data)
      } else {
        this.html = ''
      }

      // this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      // if (this.dataset.listType === 'subscriptions') {
      //   this.html = this.renderTileSubscription(courseData)
      // } else {
      //   this.html = this.renderTile(courseData, this.selectedSubscription)
      // }
    })
  }

  renderAbbonements (data) {
    debugger
    return /* html */ `
      <div class="m-tile">
        <div class="parent-body">
          <div class="course-info">
            <div>
              <span class="m-tile__title title">asdfasd</span>
            </div>
          </div>
          <div>
            <span class="m-tile__title date">gültigkeits von - bis </span>
          </div>
        </div>
        <div class="parent-footer">
          <ks-a-button
            namespace="button-secondary-" color="secondary"> asfda</ks-a-button>
        </div>
    </div>`
  }

  renderAppointment (data) {
    return /* html */`
    <div class="appointment-tile m-tile">
      <h2>Appointment: ${data.title}</h2>
    </div>
      
    `
  }

  renderCourse (data) {
    debugger
    return /* html */`
    <div class="appointment-tile m-tile">
      <h2>Couse: ${data.title}</h2>
    </div>
      
    `
  }

  get apointmentTileDiv () {
    return this.root.querySelector('.appointment-tile')
  }
}
