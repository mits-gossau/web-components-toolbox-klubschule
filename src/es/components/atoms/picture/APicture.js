import KsPicture from './Picture.js'

/**
 * Allows the Klubschule picture implementation to be registered as
 * `a-picture` while keeping `KsPicture` available for `ks-a-picture`.
 * Custom element constructors may only be registered once per registry.
 */
export default class APicture extends KsPicture {}
