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

    this.submittedListener = (event) => {
      event.detail.fetch.then((res) => {
        this.html = ''
        this.html = /* HTML */ `
          ${this.renderHeadline()}
          <ks-o-body-section variant="default">
            ${this.renderCourseTable(res)}
            ${this.renderNotification()}
          </ks-o-body-section>
          <ks-o-body-section class="already-voted-section" variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
            <ks-a-heading tag="h3" style-as="h2">
              <a-translation key="CustomerLoyality.Voted.Title"></a-translation>
            </ks-a-heading>
            ${this.renderVotedOptions(res)}
          </ks-o-body-section>
          <ks-o-body-section variant="default">
            <ks-a-heading tag="h3" style-as="h2">
              <a-translation key="CustomerLoyality.Voted.ContinueTitle"></a-translation>
            </ks-a-heading>
            <p><a-translation replace-line-breaks params="${escapeForHtml(
              JSON.stringify({ deadline: res.responseUntilDate })
            )}" key="CustomerLoyality.Voted.ContinueText"></a-translation></p>
          </ks-o-body-section>
        `
      }).catch(error => {
        console.log('submit-voting-response error', error)
      })
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    const params = new URLSearchParams(window.location.search)
    document.body.addEventListener('voting-data', this.votingDataListener)
    document.body.addEventListener('submit-voting-response', this.submittedListener)
    this.dispatchEvent(
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
    document.body.removeEventListener('voting-data', this.votingDataListener)
    document.body.removeEventListener('submit-voting-response', this.submittedListener)
  }

  votingDataListener = async (event) => {
    this.renderHTML(event.detail.fetch)
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
      .catch((error) => {
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
          <a-translation key="CustomerLoyality.PageTitle"></a-translation>
        </ks-a-heading>
      </ks-o-body-section>`
  }

  renderCourseTable (data) {
    return /* html */ `
      <div>
        <table>
          <tbody>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.CourseTitle"></a-translation></td>
              <td>${data.course.title}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.CourseId"></a-translation></td>
              <td>${data.course.id}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.Date"></a-translation></td>
              <td>${data.course.beginDate} - ${data.course.endDate}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.Location"></a-translation></td>
              <td>${data.course.location}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.NumberOfLessons"></a-translation></td>
              <td><a-translation key="CustomerLoyality.Table.NumberOfLessons.Value" params="${escapeForHtml(JSON.stringify({ lessons: data.course.lessons }))}"></a-translation></td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.CoursePrice"></a-translation></td>
              <td>${data.course.price}</td>
            </tr>
        </table>
      </div>`
  }

  renderNotification () {
    return /* html */ `
      <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle">
        <div slot="description">
          <p><a-translation key="CustomerLoyality.Warnings.ReasonForVoting"></a-translation></p>
        </div>
      </ks-m-system-notification>`
  }

  renderVoting (data) {
    if (data.alreadyVote) {
      return this.renderAlreadyVoted(data)
    } else if (data.voteExpired) {
      return this.renderVoteExpired()
    } else {
      return this.renderForm(data)
    }
  }

  renderForm (voting) {
    return /* html */ `
      <ks-o-body-section variant="default">
        <ks-a-heading tag="h2">
          <a-translation key="CustomerLoyality.FormIntroTitle"></a-translation>
        </ks-a-heading>
        <p><a-translation key="CustomerLoyality.FormIntroText"></a-translation></p>
      </ks-o-body-section>
      <ks-o-body-section variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
        <ks-a-heading tag="h3" style-as="h2">
          <a-translation key="CustomerLoyality.FormTitle"></a-translation>
        </ks-a-heading>
        <p><a-translation params="${escapeForHtml(
          JSON.stringify({ date: voting.responseUntilDate })
        )}" key="CustomerLoyality.FormText"></a-translation></p>
        <o-form data-voting="${escapeForHtml(JSON.stringify(voting))}"></o-form>
      </ks-o-body-section>`
  }

  renderVoteExpired () {
    return /* html */ `
      <ks-o-body-section variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
        <ks-a-heading tag="h3" style-as="h2">
          <a-translation key="CustomerLoyality.ExpiredTitle"></a-translation>
        </ks-a-heading>
        <p><a-translation key="CustomerLoyality.ExpiredText" replace-line-breaks></a-translation></p>
      </ks-o-body-section>`
  }

  renderAlreadyVoted (voting) {
    return /* html */ `
      <ks-o-body-section class="already-voted-section" variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
        <ks-a-heading tag="h3" style-as="h2">
          <a-translation key="CustomerLoyality.AlreadyVoted.Title"></a-translation>
        </ks-a-heading>
        ${this.renderVotedOptions(voting)}
      </ks-o-body-section>`
  }

  renderVotedOptions (voting) {
    return /* html */ `
      <div class="already-voted-item">
        <a-icon-mdx icon-name="${voting.optionPrice.value ? 'CheckCircle' : 'X'}" size="1em"></a-icon-mdx>
        <p><a-translation replace-line-breaks key="${voting.optionPrice.value ? 'CustomerLoyality.AlreadyVoted.OptionPriceAccepted' : 'CustomerLoyality.AlreadyVoted.OptionPriceRejected'}"></a-translation></p>
      </div>
      <div class="already-voted-item">
        <a-icon-mdx icon-name="${voting.optionLessons.value ? 'CheckCircle' : 'X'}" size="1em"></a-icon-mdx>
        <p><a-translation replace-line-breaks key="${voting.optionLessons.value ? 'CustomerLoyality.AlreadyVoted.OptionLessonsAccepted' : 'CustomerLoyality.AlreadyVoted.OptionLessonsRejected'}"></a-translation></p>
      </div>`
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

      .already-voted-section {
        --any-display: flex;
        --p-margin: 0 0 0 .5em;
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
          path: `${this.importMetaUrl}../organisms/form/Form.js`,
          name: 'o-form'
        },
        {
          path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/atoms/translation/translation.js`,
          name: 'a-translation'
        }
      ])
    ])
  }

  get votingWrapper () {
    return this.root.querySelector('div')
  }
}
