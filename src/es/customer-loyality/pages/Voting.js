/* global CustomEvent */
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Voting
 *
 * @export
 * @class Voting
 * @type {CustomElementConstructor}
 */
export default class Voting extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    console.log('conntected')
    if (this.shouldRenderCSS()) this.renderCSS()

    document.body.addEventListener('voting-data', this.votingDataListener)
    document.body.dispatchEvent(new CustomEvent('request-voting-data', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('voting-data', this.votingDataListener)
  }

  votingDataListener = async (event) => {
    console.log('votingDataListener')
    this.renderHTML(event.detail)
  }

  shouldRenderHTML () {
    return !this.votingWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  /**
   * renders the html
   * @return {void}
   */
  renderHTML (votingFetch) {
    this.html = ''
    this.renderLoading()
    this.modules
      .then(() => votingFetch)
      .then(voting => {
        this.html = ''
        this.html = /* html */ `
          ${this.renderHeadline()}
          <ks-o-body-section variant="default">
              ${this.renderCourseTable(voting)}
              ${this.renderNotification()}
          </ks-o-body-section>
        `
      })
  }

  renderHeadline () {
    return /* html */ `
      <ks-o-body-section variant="default">
          <ks-a-heading tag="h1">
            <a-translate>CustomerLoyality.PageTitle</a-translate>
          </ks-a-heading>
      </ks-o-body-section>
      `
  }

  renderCourseTable (data) {
    return /* html */ `
      <div>
        <table>
            <tbody>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.CourseTitle</a-translate></td>
                    <td>${data.course.title}</td>
                </tr>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.CourseId</a-translate></td>
                    <td>${data.course.id}</td>
                </tr>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.Date</a-translate></td>
                    <td>${data.course.beginDate} - ${data.course.endDate}</td>
                </tr>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.Location</a-translate></td>
                    <td>${data.course.location}</td>
                </tr>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.NumberOfLessons</a-translate></td>
                    <td>${data.course.lessons} Lektionen</td>
                </tr>
                <tr>
                    <td><a-translate>CustomerLoyality.Table.CoursePrice</a-translate></td>
                    <td>${data.course.price}</td>
                </tr>
        </table>
      </div>`
  }

  renderNotification () {
    return /* html */ `
      <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle">
          <div slot="description">
              <p>Wegen fehlender Anmeldungen können wir nicht garantieren, dass Ihr Kurs in der ursprünglichen Form stattfinden kann. Es besteht jedoch die Möglichkeit, dass er mit kleinen Änderungen durchgeführt wird.</p>
          </div>
      </ks-m-system-notification>
    `
  }

  renderLoading () {
    this.html = /* html */`
      <ks-o-body-section variant="default">
        <p>Loading...</p>
      </ks-o-body-section>
    `
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */ `
    :host {}
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }

  get modules () {
    return Promise.all([this.fetchModules([
      {
        path: `${this.importMetaUrl}../../components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../components/organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/systemNotification/systemNotification.js`,
        name: 'ks-m-system-notification'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/translate/translate.js`,
        name: 'a-translate'
      }
    ])])
  }

  get votingWrapper () {
    console.log(this.root)
    return this.root.querySelector('div')
  }
}
