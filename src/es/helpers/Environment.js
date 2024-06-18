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
  getBaseUrl: function () {
    const url = window.location.href
    const urlObj = new URL(url)
    const subdomain = urlObj.hostname.split('.')[0]
    switch (subdomain) {
      case 'intadmin':
      case 'int':
      case 'localhost':
        return 'https://miducaexportapicustomerportalint.azurewebsites.net'
      case 'dev':
      case 'devadmin':
        return 'https://miducaexportapicustomerportaldev.azurewebsites.net'
      default:
        return 'https://miducaexportapicustomerportalprd.azurewebsites.net'
    }
  },
  getApiBaseUrl: function (type) {
    switch (type) {
      case 'customer-portal': {
        return {
          // apiSubscriptionCourseAppointments: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointments`,
          apiSubscriptionCourseAppointments: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscriptioncourseappointments',
          // apiSubscriptionCourseAppointmentBooking: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentbooking`,
          apiSubscriptionCourseAppointmentBooking: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscriptioncourseappointmentbooking',
          // apiSubscriptionCourseAppointmentDetail: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentdetail`,
          apiSubscriptionCourseAppointmentDetail: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscriptioncourseappointmentdetail',
          // apiSubscriptionCourseAppointmentReversal: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptioncourseappointmentreversal`,
          apiSubscriptionCourseAppointmentReversal: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscriptioncourseappointmentreversal',
          // apiBookedSubscriptionCourseAppointments: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/bookedsubscriptioncourseappointments`,
          apiBookedSubscriptionCourseAppointments: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/bookedsubscriptioncourseappointments',
          // apiSubscriptions: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptions`,
          apiSubscriptions: `${this.getBaseUrl()}/api/CustomerPortal/subscriptions`,
          // apiSubscriptionDetail: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscription`,
          apiSubscriptionDetail: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscription',
          // apiSubscriptionPdf: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/api/CustomerPortal/subscriptionpdf`,
          apiSubscriptionPdf: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/subscriptionpdf',
          // subscriptionRenewSearchLinkUrl: `${this.getCustomerPortalBaseAPIUrlByLanguage().baseAPI}/${this.getCustomerPortalBaseAPIUrlByLanguage().renewSearch}`,
          subscriptionRenewSearchLinkUrl: 'https://int.klubschule.ch/suche/?q=',
          coursePDF: 'https://miducaexportapicustomerportalint.azurewebsites.net/api/CustomerPortal/coursepdf'
        }
      }
      default:
        return ''
    }
  }
}
