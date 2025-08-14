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
