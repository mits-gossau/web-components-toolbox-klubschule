export class CalendarHelper {
  static getLanguage() {
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    const storedLang = localStorage.getItem('language')
    const browserLang = navigator.language.substring(0, 2)
    
    return urlLang || storedLang || browserLang || 'de'
  }

  static getLocalization(lang = this.getLanguage()) {
    const localizations = {
      de: {
        eventTitle: 'Kurstermin',
        allEventsTitle: 'Kurstermine',
        description: 'Kurstermin - Klubschule',
        filenamePrefix: 'termin',
        allFilenamePrefix: 'alle-termine',
        prodId: '-//Klubschule//Kurstermin//DE'
      },
      fr: {
        eventTitle: 'Rendez-vous de cours',
        allEventsTitle: 'Rendez-vous de cours',
        description: 'Rendez-vous de cours - École-club',
        filenamePrefix: 'cours',
        allFilenamePrefix: 'tous-cours',
        prodId: '-//École-club//Rendez-vous//FR'
      },
      it: {
        eventTitle: 'Appuntamento del corso',
        allEventsTitle: 'Appuntamenti del corso',
        description: 'Appuntamento del corso - Scuola-club',
        filenamePrefix: 'corso',
        allFilenamePrefix: 'tutti-corsi',
        prodId: '-//Scuola-club//Appuntamento//IT'
      }
    }

    return localizations[lang] || localizations.de
  }

  static isMobile() {
    const userAgent = navigator.userAgent.toLowerCase()
    return /iphone|ipad|android/.test(userAgent)
  }

  static isOutlook() {
    const userAgent = navigator.userAgent.toLowerCase()
    return /outlook/.test(userAgent)
  }

  static shouldUseWebcal() {
    return this.isMobile() || this.isOutlook()
  }

  static escapeIcsText(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  static parseAppointmentDate(appointmentDateFormatted) {
    const match = appointmentDateFormatted.match(/(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})/)
    if (!match) return null
    
    const [, date, start, end] = match
    const [day, month, year] = date.split('.')
    return {
      date,
      start,
      end,
      startDate: `${year}${month}${day}T${start.replace(':', '')}00`,
      endDate: `${year}${month}${day}T${end.replace(':', '')}00`
    }
  }

  static generateIcsContent(appt, lang = this.getLanguage()) {
    const dateInfo = this.parseAppointmentDate(appt.appointmentDateFormatted)
    if (!dateInfo) return ''

    const loc = this.getLocalization(lang)
    const eventTitle = appt.appointmentCourseTitle || loc.eventTitle

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:${loc.prodId}`,
      'BEGIN:VEVENT',
      `UID:${appt.appointmentCourseId}-${dateInfo.startDate}@klubschule.ch`,
      `DTSTART:${dateInfo.startDate}`,
      `DTEND:${dateInfo.endDate}`,
      `SUMMARY:${this.escapeIcsText(eventTitle)}`,
      `LOCATION:${this.escapeIcsText(appt.appointmentLocation || '')}`,
      `DESCRIPTION:${this.escapeIcsText(loc.description)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
  }

  static generateMultipleIcsContent(appointments, lang = this.getLanguage()) {
    const loc = this.getLocalization(lang)
    
    const events = appointments.map(appt => {
      const dateInfo = this.parseAppointmentDate(appt.appointmentDateFormatted)
      if (!dateInfo) return ''
      
      const eventTitle = appt.appointmentCourseTitle || loc.eventTitle
      
      return [
        'BEGIN:VEVENT',
        `UID:${appt.appointmentCourseId}-${dateInfo.startDate}@klubschule.ch`,
        `DTSTART:${dateInfo.startDate}`,
        `DTEND:${dateInfo.endDate}`,
        `SUMMARY:${this.escapeIcsText(eventTitle)}`,
        `LOCATION:${this.escapeIcsText(appt.appointmentLocation || '')}`,
        `DESCRIPTION:${this.escapeIcsText(loc.description)}`,
        'END:VEVENT'
      ].join('\r\n')
    }).filter(event => event !== '').join('\r\n')

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:${loc.prodId}`,
      events,
      'END:VCALENDAR'
    ].join('\r\n')
  }

  static getWebcalLink(appt, lang = this.getLanguage()) {
    const dateInfo = this.parseAppointmentDate(appt.appointmentDateFormatted)
    if (!dateInfo) return '#'
    
    const loc = this.getLocalization(lang)
    
    const params = new URLSearchParams({
      courseType: appt.appointmentCourseType || '',
      courseId: appt.appointmentCourseId || '',
      date: `${dateInfo.date.split('.').reverse().join('-')}`,
      start: dateInfo.start,
      end: dateInfo.end,
      title: appt.appointmentCourseTitle || loc.eventTitle,
      location: appt.appointmentLocation || '',
      lang: lang
    })
    
    const baseUrl = window.location.origin.replace('https://', 'webcal://')
    return `${baseUrl}/api/calendar/appointment.ics?${params.toString()}`
  }

  static getWebcalAllLink(appointments, lang = this.getLanguage()) {
    const appointmentIds = appointments
      .map(appt => `${appt.appointmentCourseType}-${appt.appointmentCourseId}`)
      .join(',')
      
    const params = new URLSearchParams({
      appointments: appointmentIds,
      format: 'ical',
      lang: lang
    })
    
    const baseUrl = window.location.origin.replace('https://', 'webcal://')
    return `${baseUrl}/api/calendar/appointments.ics?${params.toString()}`
  }

  static downloadBlobCalendar(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  static generateFilename(appt, lang = this.getLanguage()) {
    const dateInfo = this.parseAppointmentDate(appt.appointmentDateFormatted)
    const date = dateInfo ? dateInfo.date.split('.').reverse().join('-') : 'termin'
    const loc = this.getLocalization(lang)
    const courseTitle = appt.appointmentCourseTitle || loc.filenamePrefix
    const title = courseTitle.replace(/[^a-z0-9äöüàéèç]+/gi, '-').toLowerCase()
    
    return `${date}_${title}.ics`
  }

    static generateAllFilename(appointments, lang = this.getLanguage()) {
    const loc = this.getLocalization(lang)
    
    if (appointments && appointments.length > 0) {
        const courseTitle = appointments[0].appointmentCourseTitle
        if (courseTitle) {
            const title = courseTitle.replace(/[^a-z0-9äöüàéèç]+/gi, '-').toLowerCase()
            return `${title}_${loc.allFilenamePrefix}.ics`
        }
    }
    
    // fallback
    return `${loc.allFilenamePrefix}.ics`
    }
}