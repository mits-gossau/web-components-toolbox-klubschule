/**
 * Generates a unique course ID based on the provided data.
 * @param {{courseType: string, courseId: string, courseAppointmentDate:string, courseAppointmentTimeFrom: string }} courseData Course data
 * @returns A unique course ID
 */
export const makeUniqueCourseId = courseData => `${courseData?.courseType}_${courseData?.courseId}_${courseData?.courseAppointmentDate}_${courseData?.courseAppointmentTimeFrom}`

/**
 * Escapes special characters in an HTML string
 * @param {string} htmlString String to escape
 * @returns HTML-escaped version of the input `htmlString`
 */
export const escapeForHtml = htmlString => {
  return htmlString
    .replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .replaceAll(/'/g, '&#39;')
}
