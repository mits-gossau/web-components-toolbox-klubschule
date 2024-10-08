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
 * @returns {import('../helpers/Typedefs.js').TileStatus} Returns the object contains tile and state information
 */
export const getTileState = (type, data) => {
  if (type === undefined) return
  const { courseAppointmentFreeSeats, courseAppointmentStatus } = data
  const { css, content } = type
  return {
    css,
    status: courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : content.status,
    info: content.info,
    icon: content.icon,
    statusTransKey: content.statusTransKey,
    infoTransKey: content.infoTransKey
  }
}

/**
 * Check if a course can be booked with the current subscription.
 *
 * @param {Object} course - The course to book.
 * @param {Object} subscription - The subscription to use.
 * @returns {boolean} - True if the course can be booked, false otherwise.
 */
export const isBookable = (course, subscription) => {
  // Get the lesson price from the course.
  const { lessonPrice } = course

  // Get the subscription balance from the subscription.
  const { subscriptionBalance } = subscription

  // Hard-coded value for debugging purposes.
  // TODO: Delete if not needed
  // const subscriptionBalance = 'CHF 32.00'

  // Parse the lesson price and the subscription balance.
  const lessonPriceFloat = getParsedPriceValue(lessonPrice)
  const subscriptionBalanceFloat = getParsedPriceValue(subscriptionBalance)

  // Return true if the lesson price is less than or equal to the subscription balance.
  return lessonPriceFloat <= subscriptionBalanceFloat
}

/**
 * Parse a lesson or subscription price and return a float value.
 *
 * @param {string} price - The price in the format "CHF x.xx".
 * @returns {number} - The parsed price as a float.
 */
export const getParsedPriceValue = (price) => {
  // Remove the "CHF" from the string and trim any whitespace.
  const parsedPrice = price.replace('CHF', '').trim()
  // Return the parsed price as a float.
  return parseFloat(parsedPrice)
}
