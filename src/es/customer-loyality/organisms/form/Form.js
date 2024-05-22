/* global CustomEvent */
import { Shadow } from '../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../helpers/Shared.js'

/**
 * Voting Option
 *
 * @export
 * @class Option
 * @type {CustomElementConstructor}
 */

export default class Form extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.voting = this.dataset.voting ? JSON.parse(this.dataset.voting) : null
    this.submitListener = (evt) => {
      evt.preventDefault()
      if (this.errorMessage) {
        this.errorMessage.remove()
      }
      const formData = new FormData(this.form)
      const params = new URLSearchParams(window.location.search)
      this.form.dispatchEvent(
        new CustomEvent('submit-voting', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            kursId: this.voting.course.id,
            teilnehmerId: params.get('teilnehmerId'),
            optionPriceAvailable: this.voting.optionPrice.available,
            optionPriceValue: formData.get('optionPrice') === 'on',
            optionLessonsAvailable: this.voting.optionPrice.available,
            optionLessonsValue: formData.get('optionLessons') === 'on',
            comment: formData.get('comment')
            // preferredVariant: 'string', // TODO: get preferred variant from form?
          }
        })
      )
    }

    this.submitResponseListener = (event) => {
      event.detail.fetch
        .then((res) => {
          this.html = ''
          this.html = /* HTML */ `
            <ks-o-body-section
              class="already-voted-section"
              variant="default"
              has-background
              background="var(--mdx-sys-color-accent-6-subtle1)"
            >
              <ks-a-heading tag="h3" style-as="h2">
                <a-translation
                  key="CustomerLoyality.Voted.Title"
                ></a-translation>
              </ks-a-heading>
              ${this.renderVotedOptions(res)}
            </ks-o-body-section>
            <ks-o-body-section variant="default">
              <ks-a-heading tag="h3" style-as="h2">
                <a-translation
                  key="CustomerLoyality.Voted.ContinueTitle"
                ></a-translation>
              </ks-a-heading>
              <p>
                <a-translation
                  replace-line-breaks
                  params="${escapeForHtml(
                    JSON.stringify({ deadline: res.responseUntilDate })
                  )}"
                  key="CustomerLoyality.Voted.ContinueText"
                ></a-translation>
              </p>
            </ks-o-body-section>
          `
        })
        .catch((error) => {
          const el = document.createElement('div')
          el.id = 'submit-error-message'
          el.innerHTML = /* html */ `
          <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle">
            <div slot="description">
              <p>${error?.message ?? 'Something went wrong...'}</p>
            </div>
          </ks-m-system-notification>`
          this.form.appendChild(el)
        })
    }
  }

  connectedCallback () {
    if (this.voting) {
      if (this.shouldRenderCSS()) this.renderCSS()
      this.renderHTML(this.voting)
      document.body.addEventListener(
        'submit-voting-response',
        this.submitResponseListener
      )
    }
  }

  disconnectedCallback () {
    this.form.removeEventListener('submit', this.submitListener)
    this.button.removeEventListener('click', this.submitListener)
    document.body.removeEventListener(
      'submit-voting-response',
      this.submitResponseListener
    )
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderHTML (voting, error) {
    Promise.all([
      this.translate('CustomerLoyality.Comment.Placeholder'),
      this.modules
    ]).then(([translation]) => {
      this.html = ''
      this.html = /* html */ `
        <ks-o-body-section variant="default">
          <ks-a-heading tag="h2">
            <a-translation key="CustomerLoyality.FormIntroTitle"></a-translation>
          </ks-a-heading>
          <p><a-translation key="CustomerLoyality.FormIntroText"></a-translation></p>
        </ks-o-body-section>
        <ks-o-body-section  id="form-wrapper" variant="default" has-background background="var(--mdx-sys-color-accent-6-subtle1)" mode="false">
          <ks-a-heading tag="h3" style-as="h2">
            <a-translation key="CustomerLoyality.FormTitle"></a-translation>
          </ks-a-heading>
          <p><a-translation params="${escapeForHtml(
            JSON.stringify({ date: voting.responseUntilDate })
          )}" key="CustomerLoyality.FormText"></a-translation></p>
          <m-form>
            <form>
              <div class="options">
                ${this.renderOptionPrice(voting.optionPrice)}
                ${this.renderOptionLessons(voting.optionLessons)}
              </div>
              <fieldset>
                <label><a-translation key="CustomerLoyality.Comment"></a-translation></label>
                <textarea name="comment" placeholder="${translation}"></textarea>
              </fieldset>
              <ks-a-button namespace="button-primary-" color="secondary" type="submit"><a-translation key="CustomerLoyality.Submit"></a-translation></ks-a-button>
            </form>
          </m-form>
        </ks-o-body-section>`
      this.form.addEventListener('submit', this.submitListener)
      this.button.addEventListener('click', this.submitListener)
    })
  }

  renderOptionPrice (option) {
    if (!option.available) {
      return ''
    }

    return /* html */ `
      <m-option data-option="${escapeForHtml(
        JSON.stringify(option)
      )}" data-dictionary-key="CustomerLoyality.OptionPrice">
        <table>
          <tbody>
            <tr class="bold">
              <td><a-translation key="CustomerLoyality.OptionPrice.PriceNew"></a-translation></td>
              <td>${option.newPrice}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.OptionPrice.PriceOld"></a-translation></td>
              <td>${option.oldPrice}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.Table.NumberOfLessons"></a-translation></td>
              <td>${option.lessons}</td>
            </tr>
          </tbody>
        </table>
        <ks-a-checkbox namespace="checkbox-default-" mode="false">
          <div class="wrap">
            <label for="optionPrice"><strong><a-translation key="CustomerLoyality.OptionPrice.CheckboxLabel"></a-translation></strong></label>
            <input id="optionPrice" type="checkbox" name="optionPrice">
            <div class="box">
              <a-icon-mdx icon-name="Check" size="1.25em" rotate="0" class="icon-right"></a-icon-mdx>
            </div>
          </div>
        </ks-a-checkbox>
      </m-option>`
  }

  renderOptionLessons (option) {
    if (!option.available) {
      return ''
    }

    return /* html */ `
      <m-option data-option="${escapeForHtml(
        JSON.stringify(option)
      )}" data-dictionary-key="CustomerLoyality.OptionLessons">
        <table>
          <tbody>
            <tr class="bold">
              <td><a-translation key="CustomerLoyality.OptionLessons.LessonsNew"></a-translation></td>
              <td>${option.newLessons}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.OptionLessons.LessonsOld"></a-translation></td>
              <td>${option.oldLessons}</td>
            </tr>
            <tr>
              <td><a-translation key="CustomerLoyality.OptionLessons.Price"></a-translation></td>
              <td>${option.price}</td>
            </tr>
          </tbody>
        </table>
        <ks-a-checkbox namespace="checkbox-default-" mode="false">
          <div class="wrap">
            <label for="optionLessons"><strong><a-translation key="CustomerLoyality.OptionLessons.CheckboxLabel"></a-translation></strong></label>
            <input id="optionLessons" type="checkbox" name="optionLessons">
            <div class="box">
                <a-icon-mdx icon-name="Check" size="1.25em" rotate="0" class="icon-right"></a-icon-mdx>
            </div>
          </div>
        </ks-a-checkbox>
      </m-option>`
  }

  renderVotedOptions (voting) {
    return /* html */ `
      <div class="already-voted-item">
        <a-icon-mdx icon-name="${
          voting.optionPrice.value ? 'CheckCircle' : 'X'
        }" size="1em"></a-icon-mdx>
        <p><a-translation replace-line-breaks key="${
          voting.optionPrice.value
            ? 'CustomerLoyality.AlreadyVoted.OptionPriceAccepted'
            : 'CustomerLoyality.AlreadyVoted.OptionPriceRejected'
        }"></a-translation></p>
      </div>
      <div class="already-voted-item">
        <a-icon-mdx icon-name="${
          voting.optionLessons.value ? 'CheckCircle' : 'X'
        }" size="1em"></a-icon-mdx>
        <p><a-translation replace-line-breaks key="${
          voting.optionLessons.value
            ? 'CustomerLoyality.AlreadyVoted.OptionLessonsAccepted'
            : 'CustomerLoyality.AlreadyVoted.OptionLessonsRejected'
        }"></a-translation></p>
      </div>`
  }

  renderCSS () {
    this.css = /* css */ `
      :host {}
      .options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--content-spacing, 1.5rem);
      }

      :host fieldset {
        margin-bottom: var(--content-spacing)
      }

      .already-voted-section {
        --any-display: flex;
        --p-margin: 0 0 0 .5em;
      }

      #submit-error-message {
        padding: 0;
        margin-top: var(--content-spacing)
      }

      @media only screen and (max-width: _max-width_) {
        :host {}

        .options {
          grid-template-columns: repeat(1, 1fr);
        }
      }
    `
  }

  get form () {
    return this.root.querySelector('form')
  }

  get button () {
    return this.root.querySelector('ks-a-button')
  }

  get modules () {
    return Promise.all([
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../molecules/option/option.js`,
          name: 'm-option'
        },
        {
          path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/es/components/molecules/form/form.js`,
          name: 'm-form'
        },
        {
          path: `${this.importMetaUrl}../../../components/atoms/checkbox/Checkbox.js`,
          name: 'ks-a-checkbox'
        },
        {
          path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
          name: 'a-icon-mdx'
        },
        {
          path: `${this.importMetaUrl}../../../components/atoms/button/Button.js`,
          name: 'ks-a-button'
        },
        {
          path: `${this.importMetaUrl}../../../components/molecules/systemNotification/systemNotification.js`,
          name: 'ks-m-system-notification'
        },
        {
          path: `${this.importMetaUrl}../../../components/organisms/bodySection/BodySection.js`,
          name: 'ks-o-body-section'
        },
        {
          path: `${this.importMetaUrl}../../../components/atoms/heading/Heading.js`,
          name: 'ks-a-heading'
        }
      ])
    ])
  }

  get errorMessage () {
    return this.root.querySelector('#submit-error-message')
  }

  async translate (key) {
    return new Promise((resolve) =>
      this.dispatchEvent(
        new CustomEvent('request-translations', {
          detail: {
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
    ).then(async ({ getTranslation }) => {
      if (key) {
        return await getTranslation(key)
      } else {
        return 'no key'
      }
    })
  }
}
