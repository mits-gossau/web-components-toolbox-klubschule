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
      info: 'freie Plätze',
      statusTransKey: '',
      infoTransKey: 'CP.cpAppointmentListStatusFreePlaces'
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
      info: 'Vorhandes Abo hat zu wenig Guthaben',
      statusTransKey: 'CP.cpAppointmentNote2',
      infoTransKey: 'CP.cpSubscriptionInsufficientCredit'
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
      info: '',
      statusTransKey: 'CP.cpAppointmentStatus3',
      infoTransKey: ''
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
      info: 'Keine Buchung bis 30 Minuten vor Terminbeginn möglich',
      statusTransKey: 'CP.cpAppointmentStatus4',
      infoTransKey: 'CP.cpAppointmentNote1'
    }
  },
  5: {
    status: 'bookedReversalPossible',
    css: {
      border: 'status-booked-reversal-possible',
      status: 'success',
      info: ''
    },
    content: {
      icon: 'Check',
      status: 'Gebucht',
      info: '',
      statusTransKey: 'CP.cpAppointmentListStatusBooked',
      infoTransKey: ''
    }
  },
  6: {
    status: 'bookedReversalNotPossible',
    css: {
      border: 'status-booked-reversal-not-possible',
      status: 'success',
      info: 'alert'
    },
    content: {
      icon: 'Check',
      status: 'Gebucht',
      info: 'Keine Stornierung mehr möglich',
      statusTransKey: 'CP.cpAppointmentListStatusBooked',
      infoTransKey: 'CP.cpCancellationNoLongerPossible'
    }
  }
}

export const subscriptionMode = {
  PAUSCHALABO: 'FLAT',
  WERTABO: 'SUBSCRIPTION'
}
