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
    debugger
    this.renderHTML()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host {
        --success-color: #00997F;
        --alert-color: #F4001B;
      }
      :host > div {
        display: flex;
        flex-direction: column;
      }
      :host .parent-body, .parent-footer {
        display: flex;
        padding: 1.5em;
      }
      :host .parent-footer {
        align-items: center;
      }
      :host .course-info, .course-booking {
        flex-basis: 50%;
      }
      :host .subscription-info {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      :host .course-admin, .course-price {
        flex-grow: 1;
        flex-shrink: 1;
      }
      :host .course-info {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      :host .course-execution-info{
        gap: 0.5em;
      }
      :host .course-price {
        text-align: right;
      }
      :host .title {
        color: var(--title-color);
      }
      :host .date, .time {
        font-weight: 400;
      }
      :host .time {
        align-items: center;
        display: flex;
        gap: 0.5em;
      }
      :host .body, .footer {
        align-items: center;
        display: grid;
        gap: 0.25em;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto auto auto;
        padding: 1.5em 1.5em 0.75em 1.5em;
      }
      :host .info {
        align-items: center;
        display: flex;
      }
      :host m-load-template-tag {
        display: block;
        min-height: 16em;
      }
      :host .status-not-bookable {
        border: 1px solid var(--alert-color);
      }
      :host .status-booked-out {
        border: 1px solid var(--alert-color);
      }
      :host .status-closed {
        border: 1px solid var(--alert-color);
      }
      :host .status-booked-reversal-possible {
        border: 1px solid var(--success-color);
      }
      :host .status-booked-reversal-not-possible {
        border: 1px solid  var(--success-color);
      }
      :host .success {
        color: var(--success-color);
      }
      :host .alert {
        color: var(--alert-color);
      }
      :host .location-room {
        display:flex;
        flex-direction: column;
      }
      :host .meta {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      :host .meta li {
        align-items: center;
        display: flex;
        flex-direction: row;
      }
      :host .meta li + li {
        margin-top: 1rem;
      }
      :host .meta li:last-of-type {
        align-items: flex-start;
      }
      :host .meta span {
        font-size: 1rem;
        line-height: 1.25rem;
        margin-left: 0.75rem;
      }
      @media only screen and (max-width: _max-width_) {
        :host .parent-body, .parent-footer{
          flex-direction: column;
        }
        :host .parent-footer {
          align-items: flex-end;
          flex-direction: column-reverse;
        }
        :host .course-booking {
          margin-top: 2.5em;
        }
        :host .course-info {
          margin-bottom: 1.5em;
        }
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
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/courseTitle/CourseTitle.js`,
        name: 'a-course-title'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/molecules/courseDialog/CourseDialog.js`,
        name: 'm-course-dialog'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
    Promise.all([fetchModules]).then((_) => {
      const courseData = Tile.parseAttribute(this.getAttribute('data'))
      debugger
      this.html = 'tile!!!!'
      // this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      // if (this.dataset.listType === 'subscriptions') {
      //   this.html = this.renderTileSubscription(courseData)
      // } else {
      //   this.html = this.renderTile(courseData, this.selectedSubscription)
      // }
    })
  }
}
