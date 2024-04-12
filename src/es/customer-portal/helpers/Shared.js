export function makeUniqueCourseId (data) {
  return `${data.courseType}_${data.courseId}_${data.courseAppointmentDate}_${data.courseAppointmentTimeFrom}`
}

export function escapeForHtml (htmlString) {
  return htmlString
    .replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .replaceAll(/'/g, '&#39;')
}
