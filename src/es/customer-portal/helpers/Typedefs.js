/**
 * @typedef {Object} Connection
 * @property {String} id
 * @property {Number} pingRetries
 * @property {(data:Object) => void} sendJSON
 */

/**
 * @typedef {Object} TileCss
 * @property {string} border
 * @property {string} status
 * @property {string} info
 */

/**
 * @typedef {Object} TileStatus
 * @property {TileCss} css
 * @property {string} status
 * @property {string} info
 * @property {string} icon
 * @property {string} statusTransKey
 * @property {string} infoTransKey
 */

exports.unused = {}
