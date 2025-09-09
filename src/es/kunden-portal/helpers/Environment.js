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
    if (location.hostname === 'localhost') return 'https://dev.klubschule.ch'
    const url = window.location.href
    const urlObj = new URL(url)
    return urlObj.origin
  },
  getApiBaseUrl: function (type) {
    switch (type) {
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
