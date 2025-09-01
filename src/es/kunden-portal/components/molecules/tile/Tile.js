// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'
import { formatDateForRender } from '../../../helpers/Shared.js'

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
      case 'tile-next-appointment-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // path to ks project
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-next-appointment-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/kunden-portal/components/molecules/tile/next-appointment-/next-appointment-.css`, // apply namespace since it is specific and no fallback
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
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
    return Promise.all([fetchModules]).then((_) => {
      switch (this.tileData.type) {
        case 'next-appointment':
          this.html = this.renderNextAppointment(this.tileData)
          break
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

    // TODO: check this - looks shitty
    return /* html */ `
      <m-load-template-tag mode="false">
        <template>
          <style>
            :host .m-tile__body {
              padding-bottom: 1.5em;
            }
          </style>
          <div class="m-tile abonnements">
            <div class="m-tile__wrap">
              <div class="course-info">
                <div class="m-tile__head">
                  <span class="m-tile__title title">${courseTitle}</span>
                </div>
                <div>
                  <div class="m-tile__body"><span class="m-tile__content m-tile__next-date">Gültigkeitsdauer ${formatDateForRender(start)} - ${formatDateForRender(end)}</span></div>
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
        </template>
      </m-load-template-tag>
      `
  }

  renderNextAppointment (data) {
    const {
      appointmentDateFormatted,
      roomDescription,
      appointmentCourseId,
      appointmentCourseTitle,
      courseType,
      courseTitle,
      courseLocation,
      courseId,
      isSubscriptionCourse,
      participantEnrolled
    } = data.data || {}

    // let buttonText = 'Details ansehen'
    // let link = `#/booking?courseId=${courseId}`
    // if (isSubscriptionCourse) {
    //   buttonText = 'Zum Aboportal'
    //   link = '/mein-konto/abokurse/?page=booked#/'
    // }

    // if (courseType === '1K') {
    //   link = `#/booking?courseId=${appointmentCourseId}`
    // }

    const renderTitle = appointmentCourseTitle !== '' ? `<span class="m-tile__subtitle subtitle">${courseTitle}</span><span class="m-tile__title title">${appointmentCourseTitle}</span>` : `<span class="m-tile__title title">${courseTitle}</span>`

    // const renderRoomDescription = roomDescription !== ''
    //   ? /* html */ `
    //     <a-icon-mdx icon-name="${data.room.iconName}" size="1em"></a-icon-mdx>
    //     <span class="m-tile__content">Raum ${roomDescription}</span>
    //   `
    //   : ''

    return /* html */ `
      <m-load-template-tag mode="false">
        <template>
          <style>
            :host {
              --tile-next-appointment-foot-justify-content: flex-end;
            }
            :host .m-tile__body {
              align-items: flex-start;
              flex-direction: column;
              padding-bottom: 1.5em;
            }
            :host .m-tile__head {
              flex-direction: column;
              align-items: flex-start;
            }
            :host .strikethrough {
              text-decoration: line-through;
            }
          </style>
          <div class="m-tile next-appointment">
            <div class="m-tile__wrap">
              <div class="course-info">
                <div class="m-tile__head">
                  ${renderTitle}
                </div>
                <div class="m-tile__body">
                  <div>
                    <span class="m-tile__content m-tile__next-date">${appointmentDateFormatted}</span>
                  </div>
                  ${this.renderNextAppointmentsMetaData(participantEnrolled, data.room.iconName, roomDescription, data.location.iconName, courseLocation)}
                  <!--${this.renderNextAppointmentsLocation(data.location.iconName, courseLocation)}
                  ${this.renderNextAppointmentsRoomDescription(data.room.iconName, roomDescription)}-->
                </div>
              </div>
              <div class="m-tile__foot">
                <div class="m-tile__foot-left">
                  ${this.renderNextAppointmentsButton(isSubscriptionCourse, courseType, courseId, appointmentCourseId)}
                </div>
              </div>
            </div>
          </div>
        </template>
      </m-load-template-tag>
    `
  }

  renderNextAppointmentsMetaData (participantEnrolled, iconRoom, roomDescription, iconLocation, locationDescription) {
    if (participantEnrolled) {
      return /* html */ ` 
          ${this.renderNextAppointmentsRoomDescription(iconRoom, roomDescription)}
          ${this.renderNextAppointmentsLocation(iconLocation, locationDescription)}
      `
    } else {
      return /* html */ `
      sorry!
      `
    }
  }

  renderNextAppointmentsRoomDescription (icon, room) {
    if (room === '') return '<div class="m-tile__room"></div>'
    return /* html */ `
    <div class="m-tile__room">
      <a-icon-mdx icon-name="${icon}" size="1em"></a-icon-mdx>
      <span class="m-tile__content">Raum ${room}</span>
    </div>
    `
  }

  renderNextAppointmentsLocation (icon, location) {
    return /* html */ ` 
      <div>
        <a-icon-mdx icon-name="${icon}" size="1em"></a-icon-mdx>
        <span class="m-tile__content">${location}</span>
      </div>  
    `
  }

  renderNextAppointmentsButton (isSubscriptionCourse, courseType, courseId, appointmentCourseId, namespace = 'button-secondary-', color = 'secondary') {
    let text = 'Details ansehen'
    let link = `#/booking?courseId=${courseId}`
    if (isSubscriptionCourse) {
      text = 'Zum Aboportal'
      link = '/mein-konto/abokurse/?page=booked#/'
    }

    if (courseType === '1K') {
      link = `#/booking?courseId=${appointmentCourseId}`
    }
    return /* html */ `
      <ks-a-button
        href="${link}" 
        namespace="${namespace}" 
        color="${color}"
      >
      <span>${text}</span>
    </ks-a-button>`
  }
}
