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
  renderCSS () {
    super.renderCSS()

    // add '.ks-o-body-style__last-child' class to the last child that is not style/script to be able to select it with css
    this.addClassToLastChild()
    this.css = /* CSS */`
        :host {
            /* had to reset display here because it was set to display inline-block !important in parent class */
            display: ${this.getAttribute('display') || 'block'} !important;
        }
        :host > * {
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
        }

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
            margin-top: var(--mdx-sys-spacing-flex-m);
        }
        :host:last-child,
        :host > .ks-o-body-style__last-child {
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }

        :host([has-background]) {
            padding-top: var(--mdx-sys-spacing-flex-m);
            padding-bottom: var(--mdx-sys-spacing-flex-m);
        }

        :host([has-background]) > *:first-child {
            margin-top: 0;
        }

        :host([has-background]) > .ks-o-body-style__last-child {
            margin-bottom: 0;
        }

        /* debug ruler to check alignment, DO NOT USE IN PRODUCTION */
        :host > [debug-ruler] {
            position: absolute;
            inset: 0;
            margin: auto;
        }
        :host > [debug-ruler]::before {
            content: '';
            display: block;
            height: calc(100% + 40px);
            margin: -20px auto;
            border-left: 1px solid red;
            border-right: 1px solid red;
        }

        @media screen and (max-width: _max-width_) {

            ${(this.hasAttribute('display-mobile'))
                /* had to reset display here because it was set to display inline-block !important in parent class */
                ? `:host {
                        display: ${this.getAttribute('display-mobile')} !important;
                    }`
                : ''}

            :host([variant=default]) > * {
                width: calc(100% - 2rem);
            }
            :host([variant=narrow]) > * {
                width: calc(100% - 2rem);
            }
            :host([variant=full]) > * {
                width: 100%;
            }

            /* expections for the width */
            :host([variant=default]) > .extended-container-mobile {
                width: calc(100% - 1rem);
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
