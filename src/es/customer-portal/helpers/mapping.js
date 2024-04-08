export const courseAppointmentStatusMapping = {
  1: {
    status: 'free',
    css: {
      border: 'status-free',
      status: '',
      info: ''
    },
    content: {
      icon: 'Users',
      status: '',
      info: 'freie Plätze'
    }
  },
  2: {
    status: 'notBookable',
    css: {
      border: 'status-not-bookable',
      status: 'alert',
      info: 'alert'
    },
    content: {
      icon: 'X',
      status: 'Keine Buchung möglich',
      info: 'Vorhandes Abo hat zu wenig Guthaben'
    }
  },
  3: {
    status: 'bookedOut',
    css: {
      border: 'status-booked-out',
      status: 'alert',
      info: ''
    },
    content: {
      icon: 'X',
      status: 'Ausgebucht',
      info: ''
    }
  },
  4: {
    status: 'closed',
    css: {
      border: 'status-closed',
      status: 'alert',
      info: 'alert'
    },
    content: {
      icon: 'X',
      status: 'Geschlossen',
      info: 'Keine Buchung bis 30 Minuten vor Terminbeginn möglich'
    }
  },
  5: {
    status: 'bookedCancellationPossible',
    css: {
      border: 'status-booked-cancellation-possible',
      status: 'success',
      info: ''
    },
    content: {
      icon: 'Check',
      status: 'Gebucht',
      info: ''
    }
  },
  6: {
    status: 'bookedCancellationNotPossible',
    css: {
      border: 'status-booked-cancellation-not-possible',
      status: 'success',
      info: 'alert'
    },
    content: {
      icon: 'Check',
      status: 'Gebucht',
      info: 'Keine Stornierung mehr möglich'
    }
  }
}

export const subscriptionMode = {
  PAUSCHALABO: 'FLAT',
  WERTABO: 'SUBSCRIPTION'
}

export const actionType = {
  detail: 'detail',
  booking: 'booking',
  bookingFinal: 'bookingFinal',
  cancel: 'cancel'
}
