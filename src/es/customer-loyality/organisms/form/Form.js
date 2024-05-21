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
  }

  connectedCallback () {
    const voting = this.dataset.voting ? JSON.parse(this.dataset.voting) : null
    if (voting) {
      if (this.shouldRenderCSS()) this.renderCSS()
      this.renderHTML(voting)
    }

    this.submitListener = (evt) => {
      evt.preventDefault()
      const formData = new FormData(this.form)
      const params = new URLSearchParams(window.location.search)
      this.form.dispatchEvent(new CustomEvent('submit-voting', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          kursId: voting.course.id,
          teilnehmerId: params.get('teilnehmerId'),
          optionPriceAvailable: voting.optionPrice.available,
          optionPriceValue: formData.get('optionPrice') === 'on',
          optionLessonsAvailable: voting.optionPrice.available,
          optionLessonsValue: formData.get('optionLessons') === 'on',
          comment: formData.get('comment')
          // preferredVariant: 'string', // TODO: get preferred variant from form?
        }
      }))
    }
  }

  disconnectedCallback () {
    this.form.addEventListener('submit', this.submitListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderHTML (voting) {
    this.modules.then(() => {
      this.html = ''
      this.html = /* html */ `
        <m-form>
          <form>
            <div class="options">
              ${this.renderOptionPrice(voting.optionPrice)}
              ${this.renderOptionLessons(voting.optionLessons)}
            </div>
            <fieldset>
              <label>Kommentar</label>
              <textarea name="comment" placeholder="Hier ist Platz für Ihre Fragen und Anliegen. Sie erreichen uns auch telefonisch unter +41 44 278 62 62."></textarea>
            </fieldset>
            <ks-a-button namespace="button-primary-" color="secondary" type="submit">Rückmeldung abschicken</ks-a-button>
          </form>
        </m-form>`
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
              <td><a-translate>CustomerLoyality.OptionPrice.PriceNew</a-translate></td>
              <td>${option.newPrice}</td>
            </tr>
            <tr>
              <td><a-translate>CustomerLoyality.OptionPrice.PriceOld</a-translate></td>
              <td>${option.oldPrice}</td>
            </tr>
            <tr>
              <td><a-translate>CustomerLoyality.Table.NumberOfLessons</a-translate></td>
              <td>${option.lesssons}</td>
            </tr>
          </tbody>
        </table>
        <ks-a-checkbox namespace="checkbox-default-" mode="false">
          <div class="wrap">
            <label for="optionPrice"><strong><a-translate>CustomerLoyality.OptionPrice.CheckboxLabel</a-translate></strong></label>
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
              <td><a-translate>CustomerLoyality.OptionLessons.LessonsNew</a-translate></td>
              <td>${option.newLesssons}</td>
            </tr>
            <tr>
              <td><a-translate>CustomerLoyality.OptionLessons.LessonsOld</a-translate></td>
              <td>${option.oldLesssons}</td>
            </tr>
            <tr>
              <td><a-translate>CustomerLoyality.OptionLessons.Price</a-translate></td>
              <td>${option.price}</td>
            </tr>
          </tbody>
        </table>
        <ks-a-checkbox namespace="checkbox-default-" mode="false">
          <div class="wrap">
            <label for="optionLessons"><strong><a-translate>CustomerLoyality.OptionLessons.CheckboxLabel</a-translate></strong></label>
            <input id="optionLessons" type="checkbox" name="optionLessons">
            <div class="box">
                <a-icon-mdx icon-name="Check" size="1.25em" rotate="0" class="icon-right"></a-icon-mdx>
            </div>
          </div>
        </ks-a-checkbox>
      </m-option>`
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
          path: `${this.importMetaUrl}../../../components/atoms/translate/translate.js`,
          name: 'a-translate'
        },
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
        }
      ])
    ])
  }
}
