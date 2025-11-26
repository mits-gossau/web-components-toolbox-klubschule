/* global self */
/* global location */

const currentScriptUrl = new URL(document.currentScript.src)

// @ts-ignore
self.Environment = {
  isTestingEnv: location.hostname === 'localhost' || location.hostname.includes('.local') || location.hostname.includes('umb.') || location.hostname.includes('test.') || location.hostname.includes('testadmin.'),
  language: currentScriptUrl.searchParams.get('language') || document.documentElement.getAttribute('lang') || 'de',
  mcsBaseUrl: currentScriptUrl.searchParams.get('mcsBaseUrl') || 'https://digital-campaign-factory.migros.ch',
  mcsVersion: currentScriptUrl.searchParams.get('mcsVersion'), /* || 'v1.112.3', // the newest version gets fetched if this parameter is not set */
  msrcBaseUrl: currentScriptUrl.searchParams.get('msrcBaseUrl') || 'https://cdn.migros.ch',
  msrcVersion: currentScriptUrl.searchParams.get('msrcVersion'), /* || '20221205123932', // the newest version gets fetched if this parameter is not set */
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
          path: 'recherche'
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
    return urlObj.origin
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
      case 'kunden-portal': {
        return {
          // CpBookingAPI
          cancelReservation: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/cancelReservation`,
          cancelReservationReasons: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/cancelReservationReasons`,
          getFollowUp: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/getFollowUp`,
          getMyBooking: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/getMyBooking`,
          getMyBookings: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/getMyBookings`,
          getStatusmonitor: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/getStatusmonitor`,
          setAttendance: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/setAttendance`,
          setStatusmonitor: `${this.getEnvUrl()}/umbraco/api/CpBookingAPI/setStatusmonitor`,
          
          // CpCourseAPI
          generateCoursePdf: `${this.getEnvUrl()}/umbraco/api/CpCourseAPI/generateCoursePdf`,
          getCoursePdf: `${this.getEnvUrl()}/umbraco/api/CpCourseAPI/getCoursePdf`,
          
          // CpStudentAPI
          generateDocument: `${this.getEnvUrl()}/umbraco/api/CpStudentAPI/generateDocument`,
          getMyBalance: `${this.getEnvUrl()}/umbraco/api/CpStudentAPI/getMyBalance`,
          getMyDocument: `${this.getEnvUrl()}/umbraco/api/CpStudentAPI/getMyDocument`,
          getMyDocuments: `${this.getEnvUrl()}/umbraco/api/CpStudentAPI/getMyDocuments`,
          sendMessage: `${this.getEnvUrl()}/umbraco/api/CpStudentAPI/sendMessage`,
          
          // CpSubscriptionAPI
          bookedSubscriptionCourseAppointments: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/bookedSubscriptionCourseAppointments`,
          checkUser: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/checkUser`,
          courselistFilterSettings: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/courselistFilterSettings`,
          getcourselistFilterSettings: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/getcourselistFilterSettings`,
          subscription: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscription`,
          subscriptionActivation: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionActivation`,
          subscriptionCourseAppointmentBooking: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionCourseAppointmentBooking`,
          subscriptionCourseAppointmentDetail: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionCourseAppointmentDetail`,
          subscriptionCourseAppointmentReversal: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionCourseAppointmentReversal`,
          subscriptionCourseAppointments: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionCourseAppointments`,
          subscriptionpdf: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptionpdf`,
          subscriptions: `${this.getEnvUrl()}/umbraco/api/CpSubscriptionAPI/subscriptions`
        }
      }
      default:
        return ''
    }
  }
}


/**
 * XSS Content Security Policy
 * 
 * https://content-security-policy.com/examples/meta/
 * is enforced by: <meta http-equiv="Content-Security-Policy" content="require-trusted-types-for 'script'">
 * 
 * Sink uses trusted type only: https://web.dev/articles/trusted-type
 * Avoid XSS attacks by sanitizing the html according to: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS
 * and the target list: https://github.com/cure53/DOMPurify/blob/27e8496bcd689a16acc7d0bf7c88b933efad569a/demos/hooks-mentaljs-demo.html#L20
 * plus: https://stackoverflow.com/questions/6976053/xss-which-html-tags-and-attributes-can-trigger-javascript-events
 * stackoverflow citation and conclusion: "I didn't knew about those new attributes. I checked, and it seems that the only attributes that start with on are all Javascript event triggers. I will probably just remove all that match that pattern."
 * NOTE: script tags are already automatically escaped by modern browsers, so we only target <image, <img starting tags and "javascript:"
 *
 * @static
 * @param {string} html
 * @return {string}
 */
if (typeof self.trustedTypes?.createPolicy === 'function' && document.querySelector('meta[http-equiv=Content-Security-Policy][content*=require-trusted-types-for]')) {
  self.trustedTypes.createPolicy('default', {
    // first sanitize tags eg.: <img src="xyz" onload=alert('XSS')>, <img src="xyz" onmouseover=alert('XSS')>, <image/src/onerror=alert('XSS')>, etc.
    // second sanitize tags eg.: <a href="javascript:alert(document.location);">XSS</a>, <form action="javascript:alert(document.location);"><input type="submit" /></form>, etc.
    createHTML: string => string.replace(/<[a-z]*[\s|\/][^>]*on[a-z]{4,10}=[^>]*>/gi, '').replace(/<[a-z]*[\s|\/][^>]*javascript:[^>]*>/gi, ''),
    createScriptURL: string => string, // unsafe but including webworker's, service workers, etc. is okay
    createScript: string => string // unsafe but eval at css templates is okay
  })
}
