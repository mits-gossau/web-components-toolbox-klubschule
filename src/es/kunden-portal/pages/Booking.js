// @ts-check
import Index from './Index.js'

/**
 * Booking
 *
 * @export
 * @class Booking
 * @type {CustomElementConstructor}
 */
export default class Booking extends Index {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestBookingListener = (event) => {
      event.detail.fetch
        .then((data) => {
          this.bookingData = data || []
          if (this.modulesLoaded) {
            setTimeout(() => this.renderBooking(), 0)
          }
        })
        .catch(error => {
          console.error('Error fetching bookings:', error)
          setTimeout(() => this.renderNoResult(), 0)
        })
    }
  }

  connectedCallback() {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-booking', this.requestBookingListener)
    this.dispatchEvent(new CustomEvent('request-booking', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback() {
    document.body.removeEventListener('update-booking', this.requestBookingListener)
  }

  shouldRenderHTML() {
    return !this.root.querySelector('div#booking')
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS() {
    this.css = /* css */`
      :host #detail-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
      }
      :host #top-stage {
        cursor: pointer;
        background-color: var(--mdx-sys-color-primary-default);
        color: white;
        padding: 24px 96px 24px 24px;
      }
      :host #top-stage > a-icon-mdx {
        display: inline-block;
        position: relative;
        top: 2px;
      }
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
    `
  }

  renderHTML() {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/contactRow/ContactRow.js`,
        name: 'ks-m-contact-row'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/systemNotification/SystemNotification.js`,
        name: 'ks-m-system-notification'
      },
      {
        path: `${this.importMetaUrl}../../components/organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }
    ]).then(() => {
      this.modulesLoaded = true
    })

    this.html = ''
    this.html = /* html */`
      <div id="detail-page">
        <div id="top-stage" onclick="window.history.back()">
          <a-icon-mdx icon-name="ArrowLeft" size="1em" color="white"></a-icon-mdx> Meine Kurse / Lehrgänge
        </div>
        <div id="body-stage">
          <o-grid namespace="grid-2columns-content-section-" first-container-vertical first-column-with="66%" with-border width="100%" count-section-children="2">
            <section>
              <!-- details -->
              <ks-o-body-section content-width-var="100%" no-margin-y background-color="white"> 
                <!-- notification -->
                <ks-m-system-notification id="booking-notification" namespace="system-notification-default-" icon-name="Info" icon-size="1.5em" icon-plain is-closeable>
                  <div slot="description">
                    <p class="notification-title">Kursbestätigung ist verfügbar</p>
                    <p class="notification-text">Sie finden alle Dokumente zum Kurs auf der Kursdetailseite oder unter Dokumente.</p>
                  </div>
                </ks-m-system-notification>
                <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                <!-- booking details -->
                <div id="booking-detail">
                  <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Kurs Details</span></h2>
                  <div class="container"></div>
                </div>
              </ks-o-body-section>
              <!-- contact and options -->
              <aside></aside>
            </section>
          </o-grid>
        </div>
      </div>
    `
  }

  renderBooking() {
    const body = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('ks-o-body-section').shadowRoot
    const container = body.querySelector('#booking-detail .container')
    if (!container || !this.bookingData) return

    container.innerHTML = ''
    container.innerHTML = this.bookingData.course.courseTitle

    const center = this.bookingData.center || {}

    // contact and options
    let aside = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('aside')
    if (!aside) {
      aside = document.createElement('aside')
      aside.style.backgroundColor = 'white'
      body.appendChild(aside)
    }
    aside.innerHTML = /* html */`
      <ks-a-heading tag="h3">Kontakt</ks-a-heading>
    `

    const address = document.createElement('ks-m-contact-row')
    address.setAttribute('icon-name', 'Home')
    address.setAttribute('name', center.name || '')
    address.setAttribute('street', `${center.locationStreet || ''} ${center.locationStreetNumber || ''}`)
    address.setAttribute('place', `${center.locationZipCode || ''} ${center.locationCity || ''}`)
    address.setAttribute('href', `https://www.google.com/maps?q=${encodeURIComponent(center.name || '')}+${encodeURIComponent(center.locationCity || '')}`)
    address.setAttribute('target', '_blank')
    aside.appendChild(address)

    const phone = document.createElement('ks-m-contact-row')
    phone.setAttribute('icon-name', 'Phone')
    phone.setAttribute('name', center.phoneNumber || '')
    phone.setAttribute('href', `tel:${(center.phoneNumber || '').replace(/ /g, '')}`)
    aside.appendChild(phone)

    const mail = document.createElement('ks-m-contact-row')
    mail.setAttribute('icon-name', 'Mail')
    mail.setAttribute('name', center.email || '')
    mail.setAttribute('href', `mailto:${center.email || ''}`)
    aside.appendChild(mail)

    const heading2 = document.createElement('div')
    heading2.innerHTML =  /* html */`
      <ks-a-spacing type="m-flex"></ks-a-spacing>
      <ks-a-heading tag="h3">Weitere Optionen</ks-a-heading>
    `
    aside.appendChild(heading2)

    const edit = document.createElement('ks-m-contact-row')
    edit.setAttribute('icon-name', 'Edit')
    edit.setAttribute('name', 'Meine Buchungen verwalten')
    edit.setAttribute('href', '#')
    aside.appendChild(edit)
  }

  renderNoResult() {
    const container = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('ks-o-body-section').shadowRoot.querySelector('#booking-detail .container')
    console.log(container)
    if (container) {
      container.innerHTML = `
        <div class="booking-error" style="color: red; font-weight: bold; margin: 2rem 0;">
          Es gibt keinen Kurs mit dieser ID.<br>
          Bitte prüfen Sie Ihre Auswahl oder versuchen Sie es später erneut.
        </div>
      `
    }
  }
}
