export function makeUniqueCourseId (data) {
  return `${data.courseType}_${data.courseId}_${data.courseAppointmentDate}_${data.courseAppointmentTimeFrom}`
}
