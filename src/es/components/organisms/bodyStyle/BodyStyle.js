// @ts-check
import BodyStyle from '../../web-components-toolbox/src/es/components/organisms/bodyStyle/BodyStyle.js';

/* global location */
/* global self */
/* global CustomEvent */

/**
 *
 * @export
 * @class KsBodyStyle
 * @type {CustomElementConstructor}
 * @attribute {
 *      variant=default|narrow|full
 * }
 */
export default class KsBodyStyle extends BodyStyle {
  /**
   * controls all body > main content width and margin (keep as small as possible and add other styles into the style.css)
   *
   * @return {void}
   */
  renderCSS() {
    // add '.ks-o-body-style__last-child' class to the last child that is not style/script to be able to select it with css
    this.addClassToLastChild();

    super.renderCSS()
    this.css = /* CSS */`
        :host {
            /* had to reset display here because it was set to display inline-block in parent class */
            display: block !important;
        }
        :host > * {
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
        }

        :host > *,
        :host([variant=default]) > * {
            width: 86.666%;
        }
        :host([variant=narrow]) > * {
            width: 57.222%;
        }
        :host([variant=full]) > * {
            width: 100%;
        }

        :host:first-child,
        :host > *:first-child {
            margin-top: 0 !important;
        }
        :host:last-child,
        :host > .ks-o-body-style__last-child {
            margin-bottom: 0 !important;
        }

        /* with background use paddings and erase margins */
        :host {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-top: var(--mdx-sys-spacing-flex-m) !important;
            padding-bottom: var(--mdx-sys-spacing-flex-m) !important;
        }

        @media screen and (max-width: _max-width_) {
            :host([variant=default]) > * {
                width: calc(100% - 2rem);
            }
            :host([variant=narrow]) > * {
                width: calc(100% - 2rem);
            }
            :host([variant=full]) > * {
                width: 100%;
            }
        }
    `;
  }

  addClassToLastChild() {
    const children = this.root.children
    let lastChild = null

    Array.from(children).forEach(child => {
        if (child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT') {
            lastChild = child;
        }
    })

    if (lastChild) {
        // @ts-ignore
        lastChild.classList.add('ks-o-body-style__last-child')
    }
  }
}
