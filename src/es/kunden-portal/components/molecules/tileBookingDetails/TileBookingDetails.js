// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

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
      :host .accordion a {
        font-size: 18px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
      }
      :host .accordion h3 {
        display: flex;
        gap: 10px;
      }
      :host .accordion-content {
        margin-bottom: 24px !important;
      }
      :host .accordion-content table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-bottom: 1px solid #000;
        font-size: 14px;
      }
      :host .accordion-content tr {
        background: #fff !important;
        border-top: 1px solid #000;
      }
      :host .accordion-content td {
        padding: 8px 0;
        border: none;
      }
      :host .accordion-content td:first-child {
        padding-right: 8px;
      }
      :host .accordion-content strong {
        font-weight: 500;
      }
      @media only screen and (max-width:${this.mobileBreakpoint}) {
        :host #course-metadata {
          flex-direction: column;
        }
      }
    `

    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]

    return this.fetchCSS(styles)
  }

  renderHTML() {
    this.html = ''
    const data = this.getAttribute('data')
    if (!data || data === 'undefined') return 

    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../../../components/atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
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

    let details = JSON.parse(data).details || []

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
      <ks-a-spacing id="notification-spacing" type="xs-flex"></ks-a-spacing>
      <div class="accordion">
        <a href="#" class="show-accordion-content-link">Kurs Details anzeigen <a-icon-mdx icon-name="ChevronDown" size="1em"></a-icon-mdx></a>
        <div id="offer-details" class="accordion-content" style="display:none;">
          <ks-a-spacing id="notification-spacing" type="xs-flex"></ks-a-spacing>
          <h3><a-icon-mdx icon-url="../../../../../../../img/icons/event-list.svg" size="1em"></a-icon-mdx> <span>Angebotsdetails</span></h3>
          <table>
            ${details.map(d => `<tr><td><strong>${d.label}</strong></td><td>${d.text}</td></tr>`).join('')}
          </table>
        </div>
        <a href="#" class="hide-accordion-content-link" style="display:none;">Kurs Details ausblenden <a-icon-mdx icon-name="ChevronUp" size="1em"></a-icon-mdx></a>
      </div>
    `

    // Accordion
    const accordion = this.root.querySelector('.accordion')
    const showLink = accordion.querySelector('.show-accordion-content-link')
    const hideLink = accordion.querySelector('.hide-accordion-content-link')
    const accordionContent = accordion.querySelector('.accordion-content')
    if (showLink && hideLink && accordionContent) {
      showLink.onclick = (e) => {
        e.preventDefault()
        accordionContent.style.display = ''
        showLink.style.display = 'none'
        hideLink.style.display = ''
      }
      hideLink.onclick = (e) => {
        e.preventDefault()
        accordionContent.style.display = 'none'
        showLink.style.display = ''
        hideLink.style.display = 'none'
      }
    }
  }
}