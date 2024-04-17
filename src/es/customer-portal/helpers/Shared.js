/**
 * Generates a unique course ID based on the provided data.
 * @param {{courseType: string, courseId: string, courseAppointmentDate:string, courseAppointmentTimeFrom: string }} courseData Course data
 * @returns A unique course ID
 */
export const makeUniqueCourseId = courseData => `${courseData?.courseType}_${courseData?.courseId}_${courseData?.courseAppointmentDate}_${courseData?.courseAppointmentTimeFrom}`

/**
 * Escapes special characters in an HTML string
 * @param {string} htmlString String to escape
 * @returns {string} HTML-escaped version of the input `htmlString`
 */
export const escapeForHtml = htmlString => {
  return htmlString
    .replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .replaceAll(/'/g, '&#39;')
}

/**
 * Returns an object with css, status, info, and icon properties based on the type and data provided.
 * @param {Object} type Object that contains `css`, `content`, and other properties.
 * @param {Object} data Course data
 * @returns {Object} Returns the object contains tile and state information
 */
export const getTileState = (type, data) => {
  if (type === undefined) return
  const { courseAppointmentFreeSeats, courseAppointmentStatus } = data
  const { css, content } = type
  return {
    css,
    status: courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : content.status,
    info: content.info,
    icon: content.icon
  }
}
