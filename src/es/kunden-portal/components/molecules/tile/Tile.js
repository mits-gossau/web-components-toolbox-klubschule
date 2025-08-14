// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'

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
    this.tileData = Tile.parseAttribute(this.getAttribute('data'))
    console.log('AppointmentTile connectedCallback', this.tileData)
    debugger
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
      /* TODO: check this width stuff */
      :host .next-appointment {
        background: pink !important;
        width: 30vw;
        max-width: 350px;
        display: flex;
        flex-direction: column;
      }
      @media only screen and (max-width: _max-width_) {
        :host .next-appointment {
          flex-direction: row;
          width: 100%;
          max-width: 100%;
        }
      }
    `
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'tile-appointment-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // path to ks project
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-appointment-'
          }]
        }, {
          path: `${this.importMetaUrl}./appointment-/appointment-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return this.fetchCSS()
    }
  }

  renderHTML () {
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
      switch (data.type) {
        case 'appointment':
          this.html = this.renderAppointment(data)
          break
        case 'course':
          this.html = this.renderCourse(data)
          break
        case 'abonnement':
          this.html = this.renderAbbonements(data)
          break
        case 'next-appointment':
          this.html = this.renderNextAppointment(data)
          break
        default:
          this.html = ''
      }
    })
  }

  renderAbbonements (data) {
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

  renderNextAppointment (data) {
    const { appointmentDateFormatted, roomDescription } = data.data.appointments[0] || {}
    const { courseTitle, courseLocation, courseId } = data.data || {}
    const detailButtonData = data.button.find(button => button.detailsButton).detailsButton
    debugger
    const iconName = courseLocation?.iconName || 'Location'
    return /* html */`
    <!--<div class="m-tile">
      <div class="m-tile__wrap">
          <div class="m-tile__overlay"></div>
          <div class="m-tile__head"></div>
      </div>
    </div>-->
    <div class="m-tile next-appointment">
      <div class="m-tile__wrap">
        <div class="course-info m-tile__body">
          <div class="m-tile__head">
            <span class="m-tile__title title">${courseTitle}</span>
          </div>
          <div class="m-tile__body">
            <div>
              <span class="m-tile__content m-tile__next-date">${appointmentDateFormatted || ''}</span>
            </div>  
            <div>
              <a-icon-mdx icon-name="${data.location.iconName}" size="1em"></a-icon-mdx>
              <span class="m-tile__content">${courseLocation}</span>
            </div>
            <div class="m-tile__room">
              <a-icon-mdx icon-name="${data.room.iconName}" size="1em"></a-icon-mdx>
              <span class="m-tile__content">Raum ${roomDescription}</span>
            </div>
          </div>
        </div>
        <div class="m-tile__foot">
          <div class="m-tile__foot-left">
            <ks-a-button
              href="${detailButtonData.link || '#'}" 
              namespace="${detailButtonData.namespace || 'button-secondary-'}" 
              color="${detailButtonData.color || 'secondary'}"
            >
              <span>${detailButtonData.text}</span>
            </ks-a-button>
          </div>
        </div>
      </div>
    </div>
      
    `
  }

  renderAppointment (data) {
    return /* html */`
    <div class="appointment-tile m-tile">
      <h2>Appointment: ${data.title}</h2>
    </div>
      
    `
  }

  renderCourse (data) {
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
