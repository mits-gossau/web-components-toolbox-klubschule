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
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host {
        width: 100%;
      }
      /* TODO: check this width stuff */
      :host .next-appointment {
        display: flex;
        flex-direction: column;
      }
      :host .abonnements-footer-button {
        align-items: flex-start;
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
      case 'tile-abonnement-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // path to ks project
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-abonnement-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/kunden-portal/components/molecules/tile/abonnement-/abonnement-.css`, // apply namespace since it is specific and no fallback
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
      switch (this.tileData.type) {
        case 'next-appointment':
          this.html = this.renderNextAppointment(this.tileData)
          break
        // case 'appointment':
        //   this.html = this.renderAppointment(this.tileData)
        //   break
        // case 'course':
        //   this.html = this.renderCourse(this.tileData)
        //   break
        case 'abonnement':
          this.html = this.renderAbbonements(this.tileData)
          break
        default:
          this.html = ''
      }
    })
  }

  renderAbbonements (data) {
    const { courseTitle, courseStartDate, courseEndDate } = data.data
    const start = new Date(courseStartDate)
    const end = new Date(courseEndDate)
    const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''
    // TODO: check this - looks shitty
    return /* html */ `
      <div class="m-tile abonnements">
        <div class="m-tile__wrap">
          <div class="course-info">
            <div class="m-tile__head">
              <span class="m-tile__title title">${courseTitle}</span>
            </div>
            <div>
              <div class="m-tile__body"><span class="m-tile__content m-tile__next-date">Gültigkeitsdauer ${formatDate(start)} - ${formatDate(end)}</span></div>
              <div>
                <ks-a-button
                  href="" 
                  namespace="button-secondary-" 
                  color=""
                >
                  <span>Zum Aboportal</span>
                </ks-a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
  }

  renderNextAppointment (data) {
    const { appointmentDateFormatted, roomDescription } = data.data.appointments[0] || {}
    const { courseTitle, courseLocation, courseId } = data.data || {}
    const link = `index.html#/booking?courseId=${courseId}`
    return /* html */`
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
              href="${link}" 
              namespace="button-secondary-" 
              color="secondary"
            >
              <span>Details ansehen</span>
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
}
