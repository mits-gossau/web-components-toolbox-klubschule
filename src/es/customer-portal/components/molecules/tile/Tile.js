// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'

/**
* @export
* @class AppointmentTile
* @type {CustomElementConstructor}
*/
export default class AppointmentTile extends Tile {
  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  updateSubscriptionCourseAppointmentDetailListener = event => {
    event.detail.fetch.then(x => {
      const description = this.root.querySelector('m-dialog')
      if (description) {
        const courseDescription = description.shadowRoot.getElementById('course-description')
        courseDescription.innerText = x.courseDescription
      }
    })
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(x => {
      console.log('update booking subscription', x)
      // const description = this.root.querySelector('m-dialog')
      // if (description) {
      //   const courseDescription = description.shadowRoot.getElementById('course-description')
      //   courseDescription.innerText = x.courseDescription
      // }
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
        min-height:10em;
        display:block;
    }
    :host .sub-content {
      padding-top:1.5em;
    }
    @media only screen and (max-width: _max-width_) {
      :host  {}
      
    }
    `
    // return this.fetchTemplate()
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
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/molecules/loadTemplateTag/LoadTemplateTag.js`,
        name: 'm-load-template-tag'
      }
    ])
    return Promise.all([fetchModules]).then((children) => {
      this.content = Tile.parseAttribute(this.getAttribute('data'))
      this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      this.html = this.renderTile(this.content, this.selectedSubscription)
    })
  }

  renderTile (content, selectedSubscription) {
    return /* HTML */ `
      <m-load-template-tag mode="false">
          <template>
            <div class="m-tile" data-course-id=${content.courseId}>
              <div class="body">
                <div><span class="m-tile__title title">${content.courseTitle} (${content.courseType}_${content.courseId})</span></div>
                <div class="icon-info"><a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx><span class="m-tile__content">${content.courseAppointmentFreeSeats} freie Plätze</span></div>
                <div><span class="m-tile__title date">${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</span></div>
                <div class="icon-info"><a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx><span class="m-tile__content">${content.instructorDescription}</span></div>
                <div><span class="m-tile__title date time"> ${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo} <ks-a-button badge="" namespace="button-secondary-" color="tertiary">Blended</ks-a-button></span></div>
              <div class="info">
                <div>
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx></div>
                <div>
                <div>
                  <span class="m-tile__content">${content.courseLocation}</span><br><span class="m-tile__content">Raum: ${content.roomDescription}</span>
                </div>
                </div>
              </div>
              </div>
              <div class="footer">
                <div class="course-booking">
                  ${this.renderDialog(content, selectedSubscription)}
                </div>
                <div class="course-price"><span class="m-tile__title">${content.lessonPrice}</span></div>
              </div>
            </div>
        </template>
      </m-load-template-tag>
    `
    // return /* html */ `
    //   <div class="m-tile">
    //     <div class="parent-body">
    //       <div class="course-info">
    //         <span class="m-tile__title title">${content.courseTitle} (${content.courseType}_${content.courseId})</span>
    //         <span class="m-tile__title date">${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</span>
    //         <span class="m-tile__title date time">
    //           ${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo}
    //           <ks-a-button badge="" namespace="button-secondary-" color="tertiary">Blended</ks-a-button>
    //         </span>
    //       </div>
    //       <div class="course-admin">
    //         <div class="vacancies"><a-icon-mdx icon-name="Location" size="1em" tabindex="0"></a-icon-mdx><span class="m-tile__content">${content.courseAppointmentFreeSeats} freie Plätze</span></div>
    //         <div class="vacancies"><a-icon-mdx icon-name="Location" size="1em" tabindex="0"></a-icon-mdx><span class="m-tile__content">${content.instructorDescription}</span></div>
    //         <div class="vacancies"><a-icon-mdx icon-name="Location" size="1em" tabindex="0"></a-icon-mdx><span class="m-tile__content">${content.courseLocation} <br /> Raum: ${content.roomDescription}</span></div>
    //       </div>
    //     </div>
    //     <div class="parent-footer">
    //       <div class="course-booking"><ks-a-button namespace="button-primary-" color="secondary">Termin buchen</ks-a-button></div>
    //       <div class="course-price"><span class="m-tile__title">${content.lessonPrice}</span></div>
    //     </div>
    //   </div>
    //   `
  }

  renderDialog (content, selectedSubscription) {
    const escapeForHtml = (htmlString) => {
      return htmlString
        .replaceAll(/&/g, '&amp;')
        .replaceAll(/</g, '&lt;')
        .replaceAll(/>/g, '&gt;')
        .replaceAll(/"/g, '&quot;')
        .replaceAll(/'/g, '&#39;')
    }
    return `
    <m-dialog namespace="dialog-left-slide-in-">
                    <div class="container dialog-header">
                      <div id="back"></div>
                      <h3>???</h3>
                      <div id="close">
                        <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                      </div>
                    </div>
                    <div class="container dialog-content">
                      <div class="sub-content">
                        <h2>${content.courseTitle} (${content.courseType}_${content.courseId})</h2>
                        <div>
                          <p id="course-description">${content.courseDescription}</p>
                          <p>Content here</p>
                          <p>Content here</p>
                          <p>Content here</p>
                          <p>Content here</p>
                        </div>
                      </div>
                    </div>
                    <div class="container dialog-footer">
                      <ks-a-button id="close" namespace="button-tertiary-" color="secondary">Close</ks-a-button>
                      <ks-a-button namespace="button-primary-" color="secondary" request-event-name="request-subscription-course-appointment-booking" tag='[${escapeForHtml(JSON.stringify(content))},${escapeForHtml(JSON.stringify(selectedSubscription))}]'>Action</ks-a-button>
                    </div>
                    <ks-a-button id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${escapeForHtml(JSON.stringify(content))},${escapeForHtml(JSON.stringify(selectedSubscription))}]' namespace="button-primary-" color="secondary">Termin buchen</ks-a-button>
                  </m-dialog>
    `
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
