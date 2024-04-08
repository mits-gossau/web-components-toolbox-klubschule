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
    this.currentTile = null
    this.courseContent = null
    this.selectedSubscription = null
    this.tileActionButtonReplace = null
    this.tileActionButtonReplaceIcon = null
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
  }

  // DETAIL
  updateSubscriptionCourseAppointmentDetailListener = event => {
    event.detail.fetch.then(courseDetail => {
      console.log(courseDetail.courseId, this.dataset.id)

      if (this.dataset.id * 1 === courseDetail.courseId) {
        this.dialog = this.root.querySelector('m-dialog')
        if (this.dialog) {
          // TODO: HACK
          // !!!
          const description = this.dialog.shadowRoot.getElementById('description')
          description.innerHTML = courseDetail.courseDescription

          const dc = {
            1: 'Termin buchen',
            2: '2',
            3: '3',
            4: '4',
            5: 'Termin stornieren',
            6: '6'
          }

          const title = this.dialog.shadowRoot.getElementById('title')
          title.innerHTML = dc[courseDetail.courseAppointmentStatus]

          // action btn
          /* const actionBtn = this.dialog.shadowRoot.getElementById('btn-action')
          actionBtn.classList.add('hide-dialog-action-btn')
          actionBtn.setAttribute('label', dc[courseDetail.courseAppointmentStatus])
          if (courseDetail.courseAppointmentStatus === 5) {
            actionBtn.setAttribute('color', 'quaternary')
          } else {
            actionBtn.style.backgroundColor = 'green;'
          } */

          // etc...
        }
      }
    })
  }

  // BOOKED
  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(x => {
      if (this.dialog) {
        console.log('update booking response: ', x)
        const dialogContent = this.dialog.shadowRoot.getElementById('content')
        const description = dialogContent.querySelector('#description')
        description.innerHTML = ''
        description.innerHTML = '<h1>Sie haben den Termin erfolgreich gebucht</h1>'

        //
        // const btn = this.dialog.shadowRoot.querySelector('ks-a-button').shadowRoot
        // const newAction = this.renderTileActionButton(subscriptionMode[this.selectedSubscription.subscriptionMode], x.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.courseContent)), this.escapeForHtml(JSON.stringify(this.selectedSubscription)))
        // if (newAction !== '') {
        //   let labelText = ''
        //   let btnNamespace = ''
        //   const a = JSON.stringify(this.courseContent)
        //   const b = JSON.stringify(this.selectedSubscription)
        //   const tag = `[${a}, ${b}]`
        //   if (x.courseAppointmentStatus === 5) {
        //     labelText = 'Stornieren'
        //     btnNamespace = 'button-secondary-'
        //   }
        //   const newElementBtn = new this.tileActionButtonReplace.constructorClass({ namespace: btnNamespace }) // eslint-disable-line
        //   newElementBtn.setAttribute('label', labelText)
        //   newElementBtn.setAttribute('id', 'show-modal')
        //   newElementBtn.setAttribute('request-event-name', 'request-subscription-course-appointment-detail')
        //   newElementBtn.setAttribute('tag', tag)
        //   newElementBtn.setAttribute('color', 'secondary')
        //   // icon
        //   const newElementIcon = new this.tileActionButtonReplaceIcon.constructorClass({}) // eslint-disable-line
        //   newElementIcon.setAttribute('icon-name', 'Trash')
        //   newElementIcon.classList.add('icon-left')
        //   newElementIcon.setAttribute('size', '1em')
        //   newElementBtn.appendChild(newElementIcon)

        //   //
        //   btn.innerHTML = newElementBtn.outerHTML
        // }

        //
        this.currentTile = this.root.querySelector('m-load-template-tag').root.querySelector('div')
        const statusIcon = this.currentTile.querySelector('#status-icon')
        const status = this.currentTile.querySelector('#status')
        const statusInfo = this.currentTile.querySelector('#status-info')

        //
        const st = this.getTileState(x)
        this.currentTile.classList.add(st.css.border)
        statusIcon.setAttribute('icon-name', st.icon)
        statusIcon.classList.add(st.css.status)
        //
        // status.innerHTML = st.status
        // status.classList.add(st.css.status)
        //
        // statusInfo.innerHTML = st.info
        // statusInfo.classList = st.css.info
      }
    })
  }

  // CANCEL
  updateSubscriptionCourseAppointmentReversalListener = event => {
    event.detail.fetch.then(x => {
      if (this.dialog) {
        console.log('reversal response: ', x)
        const dialogContent = this.dialog.shadowRoot.getElementById('content')
        const description = dialogContent.querySelector('#description')
        description.innerHTML = ''
        description.innerHTML = '<h1>Sie haben den Termin erfolgreich storniert</h1>'

        //
        this.currentTile = this.root.querySelector('m-load-template-tag').root.querySelector('div')
        const st = this.getTileState(x)
        const defaultBorder = this.currentTile.classList[0]
        this.currentTile.classList = ''
        this.currentTile.classList.add(defaultBorder)
        this.currentTile.classList.add(st.css.border)
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
    :host .hide-dialog-action-btn{
      display:none;
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
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/tileStatusButton/TileStatusButton.js`,
        name: 'a-tile-status-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/dialogStatusButton/DialogStatusButton.js`,
        name: 'a-dialog-status-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/courseInfo/CourseInfo.js`,
        name: 'a-course-info'
      }
    ])
    Promise.all([fetchModules]).then((children) => {
      this.tileActionButtonReplace = children[0][1]
      this.tileActionButtonReplaceIcon = children[0][2]
      this.courseContent = Tile.parseAttribute(this.getAttribute('data'))
      this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      this.html = this.renderTile(this.courseContent, this.selectedSubscription)
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
                  <a-course-info data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}"></a-course-info>
                  <a-icon-mdx id="status-icon" icon-name="${tileStatus.icon}" size="1.5em" tabindex="0" class="${tileStatus.css.status}"></a-icon-mdx>
                  <span class="m-tile__content"><span id="status" class="${tileStatus.css.status}">${tileStatus.status}</span> <span id="status-info" class="${tileStatus.css.info}">${tileStatus.info}</span></span>
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
          <h3 id="title"></h3>
          <div id="close">
            <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
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
          <a-dialog-status-button data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}" data-subscription="${this.escapeForHtml(JSON.stringify(selectedSubscription))}"></a-dialog-status-button>
          <!--<ks-a-button id="btn-action" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${this.escapeForHtml(JSON.stringify(content))},${this.escapeForHtml(JSON.stringify(selectedSubscription))}]'>Termin buchen</ks-a-button>
          <ks-a-button id="btn-action-cancel" color="quaternary" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${this.escapeForHtml(JSON.stringify(content))},${this.escapeForHtml(JSON.stringify(selectedSubscription))}]'>Termin stornieren</ks-a-button>-->
        </div>
        <a-tile-status-button id="show-modal" data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}" data-subscription="${this.escapeForHtml(JSON.stringify(selectedSubscription))}"></a-status-button>  
      </m-dialog>
      `
  }

  renderTileActionButton (subscriptionMode, status, content, selectedSubscription) {
    const btnBooking = `<ks-a-button namespace="button-primary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'booking' })}]' color="secondary">Termin buchen</ks-a-button>`
    const btnCancel = `<ks-a-button namespace="button-secondary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'cancel' })}]' color="secondary"><a-icon-mdx icon-name="Trash" size="1em" class="icon-left"></a-icon-mdx>Stornieren</ks-a-button>`

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
