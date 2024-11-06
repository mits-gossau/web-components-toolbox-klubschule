/* global self */
/* global location */

const currentScriptUrl = new URL(document.currentScript.src)

// @ts-ignore
self.Environment = {
  isTestingEnv: location.hostname === 'localhost' || location.hostname.includes('.local') || location.hostname.includes('umb.') || location.hostname.includes('test.') || location.hostname.includes('testadmin.'),
  language: currentScriptUrl.searchParams.get('language') || document.documentElement.getAttribute('lang') || 'de',
  mcsBaseUrl: currentScriptUrl.searchParams.get('mcsBaseUrl') || 'https://digital-campaign-factory.migros.ch',
  mcsVersion: currentScriptUrl.searchParams.get('mcsVersion'), /* || 'v1.112.3', // the newest version gets fetched if this parameter is not set */
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
      case tagName && typeof tagName.includes === 'function' && tagName.includes('KS-M-STAGE'):
        return '1020px'
      default:
        return '767px'
    }
  },
  getCustomerPortalRenewalLinkByLanguage: function () {
    switch (self.Environment.language) {
      case 'fr-CH':
      case 'fr':
        return {
          url: 'https://{env}.ecole-club.ch',
          path: 'rechecher'
        }
      case 'it-CH':
      case 'it':
        return {
          url: 'https://{env}.scuola-club.ch',
          path: 'ricerca'
        }
      case 'de-CH':
      case 'de':
        return {
          url: 'https://{env}.klubschule.ch',
          path: 'suche'
        }
      default:
        return {
          url: 'https://www.klubschule.ch',
          path: 'suche'
        }
    }
  },
  getEnvUrl: function () {
    const url = window.location.href
    const urlObj = new URL(url)
    const subdomain = urlObj.hostname.split('.')[0]
    switch (subdomain) {
      case 'intadmin':
        return 'https://miducaexportapicustomerportalint.azurewebsites.net'
      case 'int':
        return 'https://miducaexportapicustomerportalint.azurewebsites.net'
      case 'localhost':
        return 'https://miducaexportapicustomerportalint.azurewebsites.net'
      case 'dev':
        return 'https://miducaexportapicustomerportaldev.azurewebsites.net'
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
          apiSubscriptionCourseAppointments: `${this.getEnvUrl()}/api/CustomerPortal/subscriptioncourseappointments`,
          apiSubscriptionCourseAppointmentBooking: `${this.getEnvUrl()}/api/CustomerPortal/subscriptioncourseappointmentbooking`,
          apiSubscriptionCourseAppointmentDetail: `${this.getEnvUrl()}/api/CustomerPortal/subscriptioncourseappointmentdetail`,
          apiSubscriptionCourseAppointmentReversal: `${this.getEnvUrl()}/api/CustomerPortal/subscriptioncourseappointmentreversal`,
          apiBookedSubscriptionCourseAppointments: `${this.getEnvUrl()}/api/CustomerPortal/bookedsubscriptioncourseappointments`,
          apiSubscriptions: `${this.getEnvUrl()}/api/CustomerPortal/subscriptions`,
          apiSubscriptionDetail: `${this.getEnvUrl()}/api/CustomerPortal/subscription`,
          apiSubscriptionPdf: `${this.getEnvUrl()}/api/CustomerPortal/subscriptionpdf`,
          apiCourseListFilterSettings: `${this.getEnvUrl()}/api/CustomerPortal/courselistfiltersettings`,
          coursePDF: `${this.getEnvUrl()}/api/CustomerPortal/coursepdf`
        }
      }
      default:
        return ''
    }
  }
}
