/* global CustomEvent */
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../helpers/Shared.js'

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
    if (this.shouldRenderCSS()) this.renderCSS()
    console.log('connectedCallback')
    const params = new URLSearchParams(window.location.search)
    document.body.addEventListener('voting-data', this.votingDataListener)
    document.body.dispatchEvent(
      new CustomEvent('request-voting-data', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          courseId: params.get('kursId'),
          customerId: params.get('teilnehmerId')
        }
      })
    )
  }

  disconnectedCallback () {
    console.log('disconnectedCallback')
    document.body.removeEventListener('voting-data', this.votingDataListener)
  }

  votingDataListener = async (event) => {
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
      .then((voting) => {
        this.html = ''
        this.html = /* html */ `
          ${this.renderHeadline()}
          <ks-o-body-section variant="default">
            ${this.renderCourseTable(voting)}
            ${this.renderNotification()}
          </ks-o-body-section>
          ${this.renderVoting(voting)}
        `
      })
      .catch(error => {
        this.html = ''
        this.html = /* html */ `
        <ks-o-body-section variant="default">
          <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle">
            <div slot="description">
              <p>Failed to load data. (error: ${error.message})</p>
            </div>
          </ks-m-system-notification>
        </ks-o-body-section>`
      })
  }

  renderHeadline () {
    return /* html */ `
      <ks-o-body-section variant="default">
        <ks-a-heading tag="h1">
          <a-translate>CustomerLoyality.PageTitle</a-translate>
        </ks-a-heading>
      </ks-o-body-section>`
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
      </ks-m-system-notification>`
  }

  renderVoting (data) {
    if (data.alreadyVote) {
      return 'already voted'
    } else if (data.voteExpired) {
      return 'vote expired'
    } else {
      return this.renderForm(data)
    }
  }

  renderForm (voting) {
    return /* html */ `
      <ks-o-body-section variant="default">
        <ks-a-heading tag="h2">
          <a-translate>CustomerLoyality.FormIntroTitle</a-translate>
        </ks-a-heading>
        <p><a-translate>CustomerLoyality.FormIntroText</a-translate></p>
      </ks-o-body-section>
      <ks-o-body-section variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
        <ks-a-heading tag="h3" style-as="h2">
          <a-translate>CustomerLoyality.FormTitle</a-translate>
        </ks-a-heading>
        <p><a-translate data-params="${escapeForHtml(
          JSON.stringify({ date: voting.responseUntilDate })
        )}">CustomerLoyality.FormText</a-translate></p>
        <o-form data-voting="${escapeForHtml(JSON.stringify(voting))}"></o-form>
      </ks-o-body-section>`
  }

  renderLoading () {
    this.html = /* html */ `
      <ks-o-body-section variant="default">
        <p>Loading...</p>
      </ks-o-body-section>`
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {}
      :host .options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--content-spacing, 1.5rem);
      }
      @media only screen and (max-width: _max-width_) {
        :host {}

        .options {
          grid-template-columns: repeat(1, 1fr);
        }
      }
    `
  }

  get modules () {
    return Promise.all([
      this.fetchModules([
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
        },
        {
          path: `${this.importMetaUrl}../organisms/form/Form.js`,
          name: 'o-form'
        }
      ])
    ])
  }

  get votingWrapper () {
    return this.root.querySelector('div')
  }
}
