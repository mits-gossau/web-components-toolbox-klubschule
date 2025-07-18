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
            }
        ]).then(() => {
            this.modulesLoaded = true
        })

        this.html = /* html */`
        <div id="booking">
            <h2><a-icon-mdx icon-name="ShoppingList" size="1em"></a-icon-mdx> <span>Kurs Details</span></h2>
            <div class="container-booking"></div>
        </div>
    `
    }

    renderBooking() {
        const bookingDiv = this.shadowRoot.querySelector('#booking .container-booking')
        if (!bookingDiv || !this.bookingData) return
        bookingDiv.innerHTML = ''
        bookingDiv.innerHTML = this.bookingData.course.courseTitle
    }
}
