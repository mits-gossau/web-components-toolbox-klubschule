/* global self */
/* global location */

const currentScriptUrl = new URL(document.currentScript.src)

// @ts-ignore
self.Environment = {
  isTestingEnv: location.hostname === 'localhost' || location.hostname.includes('.local') || location.hostname.includes('umb.') || location.hostname.includes('test.') || location.hostname.includes('testadmin.'),
  language: currentScriptUrl.searchParams.get('language') || document.documentElement.getAttribute('lang') || 'de',
  msrcBaseUrl: currentScriptUrl.searchParams.get('msrcBaseUrl') || 'https://cdn.migros.ch',
  msrcVersion: currentScriptUrl.searchParams.get('msrcVersion') || '20221205123932',
  mcsBaseUrl: currentScriptUrl.searchParams.get('mcsBaseUrl') || 'https://digital-campaign-factory.migros.ch',
  mcsVersion: currentScriptUrl.searchParams.get('mcsVersion'), /* || 'v1.112.3', // the newest version gets fetched if this parameter is not set */
  /**
   * Get custom mobile breakpoint
   * @param {{constructor?: string, tagName?: string, namespace?: string}} organism
   * @return {string}
   */
  mobileBreakpoint: ({ constructor, tagName, namespace } = {}) => {
    switch (true) {
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Header'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Logo'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Navigation'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('LanguageSwitcher'):
      case tagName && typeof tagName.includes === 'function' && tagName.includes('O-NAV-WRAPPER'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Footer'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Login'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('CarouselTwo') && namespace === 'carousel-two-teaser-':
        return '1200px'
      default:
        return '767px'
    }
  },
  getApiBaseUrl: function (type) {
    switch (type) {
      case 'customer-portal': {
        return {
          apiSubscriptionCourseAppointments: this.isTestingEnv ? 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointments' : 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointments',
          apiSubscriptionCourseAppointmentBooking: this.isTestingEnv ? 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentbooking' : 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentbooking',
          apiSubscriptionCourseAppointmentDetail: this.isTestingEnv ? 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentdetail' : 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentdetail',
          apiSubscriptionCourseAppointmentReversal: this.isTestingEnv ? 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentreversal' : 'https://qual.klubschule.ch/api/CustomerPortal/subscriptioncourseappointmentreversal'
        }
      }
      default:
        return ''
    }
  }
}
