/* global self */
/* global location */

const currentScriptUrl = new URL(document.currentScript.src)

// @ts-ignore
self.Environment = {
  isTestingEnv: location.hostname === 'localhost' || location.hostname.includes('.local') || location.hostname.includes('umb.') || location.hostname.includes('test.') || location.hostname.includes('testadmin.'),
  language: currentScriptUrl.searchParams.get('language') || document.documentElement.getAttribute('lang') || 'de',
  mobileBreakpoint: ({ constructor, tagName, namespace } = {}) => {
    switch (true) {
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Header'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Logo'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Navigation'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('LanguageSwitcher'):
      case tagName && typeof tagName.includes === 'function' && tagName.includes('O-NAV-WRAPPER'):
      case tagName && typeof tagName.includes === 'function' && tagName.includes('KS-O-BODY-SECTION'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Login'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('CarouselTwo') && (namespace === 'carousel-two-teaser-' || namespace === 'carousel-two-3-column-'):
        return '1020px'
      default:
        return '767px'
    }
  },
  getCustomerPortalBaseAPIUrlByLanguage: function () {
    switch (self.Environment.language) {
      case 'fr-CH':
        return {
          baseAPI: this.isTestingEnv ? 'https://qual.ecole-club.ch' : 'https://qual.ecole-club.ch',
          renewSearch: 'Cours/recherche@'
        }
      case 'it-CH':
        return {
          baseAPI: this.isTestingEnv ? 'https://qual.scuola-club.ch' : 'https://qual.scuola-club.ch',
          renewSearch: 'Corsi/ricerca@'
        }
      case 'de-CH':
        return {
          baseAPI: this.isTestingEnv ? 'https://qual.klubschule.ch' : 'https://qual.klubschule.ch',
          renewSearch: 'Kurse/suche@'
        }
      default:
        return {
          baseAPI: this.isTestingEnv ? 'https://qual.klubschule.ch' : 'https://qual.klubschule.ch',
          renewSearch: 'Kurse/suche@'
        }
    }
  },
  getApiBaseUrl: function (type) {
    switch (type) {
      case 'customer-portal': {
        return {
          apiSubscriptionCourseAppointments: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointments`,
          apiSubscriptionCourseAppointmentBooking: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentbooking`,
          apiSubscriptionCourseAppointmentDetail: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentdetail`,
          apiSubscriptionCourseAppointmentReversal: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentreversal`,
          apiBookedSubscriptionCourseAppointments: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/bookedsubscriptioncourseappointments`,
          apiSubscriptions: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptions`,
          apiSubscriptionDetail: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscription`,
          apiSubscriptionPdf: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptionpdf`,
          subscriptionRenewSearchLinkUrl: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/${this.getCustomerPortalBaseAPIUrlByLanguage().renewSearch}`,
          coursePDF: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/coursepdf`
        }
      }
      default:
        return ''
    }
  }
}
