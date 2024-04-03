// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'
import { courseAppointmentStatusMapping, subscriptionMode } from '../../../helpers/mapping.js'

/**
 * @export
 * @class AppointmentTile
 * @type {CustomElementConstructor}
 */
export default class AppointmentTile extends Tile {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
    this.dialog = null
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  updateSubscriptionCourseAppointmentDetailListener = event => {
    event.detail.fetch.then(courseDetail => {
      console.log(courseDetail.courseId, this.dataset.id)
      if (this.dataset.id * 1 === courseDetail.courseId) {
        this.dialog = this.root.querySelector('m-dialog')
        if (this.dialog) {
          const description = this.dialog.shadowRoot.getElementById('description')
          description.innerHTML = courseDetail.courseDescription
          // etc...
        }
      }
    })
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(x => {
      console.log('update booking response: ', x)
      if (this.dialog) {
        const dialogContent = this.dialog.shadowRoot.getElementById('content')
        dialogContent.innerHTML = ''
        dialogContent.innerHTML = '<h1>Sie haben den Termin erfolgreich gebucht</h1>'
      }
    })
  }

  /**
   * renders the css
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
    :host {}
    :host > div {
      display:flex;
      flex-direction: column;
    }
    :host .parent-body, .parent-footer {
      display:flex;
      padding:1.5em;
    }
    :host .parent-footer {
      align-items: center;
    }
    :host .course-info, .course-booking {
      flex-basis: 50%;
    }
    :host .course-admin, .course-price {
      flex-grow: 1;
      flex-shrink: 1;
    }
    :host .course-info {
      display:flex;
      flex-direction:column;
    }
    :host .course-price {
      text-align:right;
    }
    :host .title {
      color:var(--title-color);
    }
    :host .date, .time {
      font-weight:400;
    }
    :host .time {
      display:flex;
      gap:0.5em;
      align-items: center;
    }
    :host .vacancies {
      display:flex;
      padding-bottom:0.75em;
    }
    :host .body, .footer {
      display: grid;
      grid-template-columns: 50% 50%;
      grid-template-rows: auto auto auto;
      align-items: center;
      padding:1.5em 1.5em 0.75em 1.5em;
      gap:0.25em;
    }
    :host .info {
      display:flex;
      align-items:center;
    }
    :host .location-room {
      display:flex;
      flex-direction:column;
    }
    :host .icon-info {
      display:flex;
      align-items: center;
    }
    :host m-load-template-tag {
        min-height:16em;
        display:block;
    }
    :host .sub-content {
      padding-top:1.5em;
    }
    :host .status-not-bookable {
      border:1px solid #F4001B;
    }
    :host .status-booked-out {
      border: 1px solid #F4001B;
    }
    :host .status-closed {
      border: 1px solid #F4001B;
    }
    :host .status-booked-cancellation-possible {
      border: 1px solid #00997F;
    }
    :host .status-booked-cancellation-not-possible {
      border: 1px solid #00997F;
    }
    :host .success {
      color:#00997F;
    }
    :host .alert {
      color:#F4001B;
    }
    @media only screen and (max-width: _max-width_) {
      :host  {}
    }
    `
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'tile-course-appointment-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-course-appointment-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/customer-portal/components/molecules/tile/course-appointment-/course-appointment-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return this.fetchCSS()
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
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
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      }
    ])
    Promise.all([fetchModules]).then((_) => {
      const content = Tile.parseAttribute(this.getAttribute('data'))
      const selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      this.html = this.renderTile(content, selectedSubscription)
    })
  }

  renderTile (content, selectedSubscription) {
    const tileStatus = this.getTileState(content)
    return /* html */ `
      <m-load-template-tag mode="false">
        <template>
          <div id="tile-wrapper" class="m-tile ${tileStatus.css.border}" data-course-id=${content.courseId}>
            <div class="parent-body">
              <div class="course-info">
                <div>
                  <span class="m-tile__title title">${content.courseTitle} (${content.courseType}_${content.courseId})</span>
                </div>
                <div>
                  <span class="m-tile__title date">${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</span>
                </div> 
                <div>
                  <span class="m-tile__title date time">
                    ${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo} 
                    <ks-a-button badge="" namespace="button-secondary-" color="tertiary">Blended</ks-a-button>
                  </span>
                </div>
              </div>
              <!-- --> 
              <div class="course-info">
                <div id="status-wrapper" class="icon-info">
                  <a-icon-mdx icon-name="${tileStatus.icon}" size="1.5em" tabindex="0" class="${tileStatus.css.status}"></a-icon-mdx>
                  <span class="m-tile__content"><span class="${tileStatus.css.status}" id="status">${tileStatus.status}</span> <span class="${tileStatus.css.info}">${tileStatus.info}</span></span>
                </div> 
                <div class="icon-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <span class="m-tile__content">${content.instructorDescription}</span>
                </div>
                <div class="icon-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <span class="m-tile__content">
                    ${content.courseLocation}
                  </span>
                  <span class="m-tile__content">
                    Raum: ${content.roomDescription}
                  </span>
                </div>
              </div>
            </div><!-- parent body END -->
            <div class="parent-footer">
              <div class="course-booking">
                ${this.renderDialog(content, selectedSubscription)}
              </div>
              <div class="course-price">
                <span class="m-tile__title">
                  ${content.lessonPrice}
                </span>
              </div>
            </div><!-- parent footer END -->
          </div>
        </template>
      </m-load-template-tag>
    `
  }

  getTileState (data) {
    const type = courseAppointmentStatusMapping[data.courseAppointmentStatus]
    const { courseAppointmentFreeSeats } = data

    return {
      css: type.css,
      status: data.courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : type.content.status,
      info: type.content.info,
      icon: type.content.icon
    }
  }

  escapeForHtml = (htmlString) => {
    return htmlString
      .replaceAll(/&/g, '&amp;')
      .replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .replaceAll(/'/g, '&#39;')
  }

  renderDialog (content, selectedSubscription) {
    return /* html */ `
      <m-dialog namespace="dialog-left-slide-in-">
        <div class="container dialog-header">
          <div id="back"></div>
          <h3>Title...</h3>
          <div id="close">
            <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
          </div>
        </div>
        <div class="container dialog-content">
          <p class="reset-link"></p>
          <div class="sub-content">
            <h2>${content.courseTitle} (${content.courseType}_${content.courseId})</h2>
            <div id="content">
              <p id="description"></p>
            </div>
          </div>
        </div>
        <div class="container dialog-footer">
          <ks-a-button id="close" namespace="button-tertiary-" color="secondary">Close</ks-a-button>
          <ks-a-button namespace="button-primary-" color="secondary" request-event-name="request-subscription-course-appointment-booking" tag='[${this.escapeForHtml(JSON.stringify(content))},${this.escapeForHtml(JSON.stringify(selectedSubscription))}]'>Action</ks-a-button>
        </div>
        ${this.renderDialogActionButton(subscriptionMode[selectedSubscription.subscriptionMode], content.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(content)), this.escapeForHtml(JSON.stringify(selectedSubscription)))}
      </m-dialog>
      `
  }

  renderDialogActionButton (subscriptionMode, status, content, selectedSubscription) {
    const btnBooking = `<ks-a-button namespace="button-primary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}]' color="secondary">Termin buchen</ks-a-button>`
    const btnCancel = `<ks-a-button namespace="button-secondary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}]' color="secondary"><a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx>Stornieren</ks-a-button>`

    const actionButton = {
      FLAT: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnCancel,
        6: ''
      },
      SUBSCRIPTION: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnCancel,
        6: ''
      }
    }

    return actionButton[subscriptionMode][status]
  }

  formatCourseAppointmentDate (date) {
    const dateObject = new Date(date)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    const formattedDate = formatter.format(dateObject)
    return formattedDate
  }
}
