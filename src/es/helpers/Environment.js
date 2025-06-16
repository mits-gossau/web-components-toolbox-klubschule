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
    const url = window.location.href;
    const urlObj = new URL(url);
    return urlObj.origin;
  },
  getApiBaseUrl: function (type) {
    switch (type) {
      case 'customer-portal': {
        return {
          apiSubscriptionCourseAppointments: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptioncourseappointments`,
          apiSubscriptionCourseAppointmentBooking: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptioncourseappointmentbooking`,
          apiSubscriptionCourseAppointmentDetail: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptioncourseappointmentdetail`,
          apiSubscriptionCourseAppointmentReversal: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptioncourseappointmentreversal`,
          apiBookedSubscriptionCourseAppointments: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/bookedsubscriptioncourseappointments`,
          apiSubscriptions: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptions`,
          apiSubscriptionDetail: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscription`,
          apiSubscriptionPdf: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/subscriptionpdf`,
          apiCourseListFilterSettings: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/courselistfiltersettings`,
          coursePDF: `${this.getEnvUrl()}/umbraco/api/CustomerPortalApi/coursepdf`
        }
      }
      default:
        return ''
    }
  }
}
