// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class TileBookingDetails
* @type {CustomElementConstructor}
*/
export default class TileBookingDetails extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  static get observedAttributes() {
    return ['data']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this.renderHTML()
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML() && this.getAttribute('data')) this.renderHTML()
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML() {
    return !this.root.querySelector(`#booking-detail`)
  }

  renderCSS() {
    this.css = /* css */`
      :host {
        display: block;
      }
      :host #booking-detail {
        padding: 0 0 1.5rem 0;
      }
      :host #booking-tile {}
      :host #booking-type-text span {
        display: inline-block;
        border-radius: 3px;
        border: 1px solid var(--mdx-sys-color-neutral-bold4, #262626);
        color: var(--mdx-sys-color-neutral-bold4, #262626);
        font: var(--mdx-sys-font-fix-body2);
        padding: var(--mdx-sys-spacing-fix-3xs) var(--mdx-sys-spacing-fix-2xs);
      }
      :host #course-title {
        color: var(--mdx-sys-color-accent-6-onSubtle, #262626);
        font: var(--mdx-sys-font-flex-large-headline2);
        margin: 16px 0 26px 0;
      }
      :host #course-metadata {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        color: var(--mdx-sys-color-neutral-bold4, #262626);
        font: 400 16px/130% 'Graphik';
      }
      :host #course-metadata .location,
      :host #course-metadata .date,
      :host #course-metadata .status {
        display: flex;
        gap: 0.3em;
      }
      :host #course-metadata .status img {
        vertical-align: middle;
      }
      :host #course-cta-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: flex-start;
      }
      :host #course-cta-buttons ks-a-button {
        flex: 0 1 auto;
      }
      :host #course-cta-buttons ks-a-button > a-icon-mdx {
        margin-left: 4px;
      }
      @media only screen and (max-width:${this.mobileBreakpoint}) {
        :host #course-metadata {
          flex-direction: column;
        }
      }
    `
  }

  renderHTML() {
    this.html = ''
    const data = this.getAttribute('data')
    if (!data || data === 'undefined') return 

    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])

    let parsed
    try {
      parsed = JSON.parse(data)
    } catch (e) {
      console.warn('TileBookingDetails: Attribute "data" is no valid JSON:', data)
      return
    }

    const {
      bookingTypeText = '',
      courseTitle = '',
      daysEntry = '',
      locationDescription = '',
      statusText = '',
      statusIcon = '',
      linkLms = '',
      linkTeams = '',
      linkDownload = '',
    } = parsed

    this.html = /* html */`
      <div id="booking-detail">
        <div id="booking-tile">
          <div id="booking-type-text"><span>${bookingTypeText}</span></div>
          <h2 id="course-title">${courseTitle}</h2>
          <div id="course-metadata">
            <span class="location"><a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx> <span>${locationDescription}</span></span>
            <span class="date"><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> <span>${daysEntry}</span></span>
            <span class="status"><img src="${statusIcon}" height="24" width="24" /> <span>${statusText}</span></span>
          </div>
          <ks-a-spacing type="xs-flex"></ks-a-spacing>
          <div id="course-cta-buttons">
            ${linkLms ? /* html */`<ks-a-button namespace="button-primary-" href="${linkLms}"><span>Lernumgebung (Moodle)</span> <a-icon-mdx icon-name="ExternalLink" size="1em" class="icon-right"></a-icon-mdx></ks-a-button>` : ''}
            ${linkTeams ? /* html */`<ks-a-button namespace="button-primary-" href="${linkTeams}"><span>Microsoft Teams</span> <a-icon-mdx icon-name="ExternalLink" size="1em" class="icon-right"></a-icon-mdx></ks-a-button>` : ''}
            ${linkDownload ? /* html */`<ks-a-button namespace="button-secondary-" href="${linkDownload}"><span>Angebotsdetails</span> <a-icon-mdx icon-name="Download" size="1em" class="icon-right"></a-icon-mdx></ks-a-button>` : ''}
          </div>
        </div>
      </div>
    `
  }
}