// @ts-check
import BodyStyle from '../../web-components-toolbox/src/es/components/organisms/bodyStyle/BodyStyle.js'

/**
 *
 * @export
 * @class KsBodyStyle
 * @type {CustomElementConstructor}
 * @attribute {
 *      variant=default|narrow|full,
 *      no-margin-y (flag)
 *      has-background (flag)
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

    // add '.ks-o-body-section__last-child' class to the last child that is not style/script to be able to select it with css
    this.addClassToLastChild()
    this.css = /* CSS */`

        /* Reseting table styles to browser defaults because they are overwritten in the parent class for a reason I do not know :D */
        table {
            display: table !important;
        }
        tbody {
            display: table-row-group !important;
        }
        :host ks-a-with-facet-pagination.hidden {
            display: none;
        }
        :host(ks-o-body-section) a {
            --a-text-decoration: underline;
        }
        :host(ks-o-body-section) a:hover {
            --a-text-decoration-hover: underline;
            text-decoration-line: var(--a-text-decoration-hover);
        }
        :host(ks-o-body-section) {
            /* had to reset display here because it was set to display inline-block !important in parent class */
            display: ${this.getAttribute('display') || 'block'} !important;
            position: relative;
            margin-top: var(--mdx-sys-spacing-flex-l) !important;
            margin-bottom: var(--mdx-sys-spacing-flex-l) !important;
        }
        
        :host > * {
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
        }

        :host([has-background]),
        :host([has-padding]) {
            padding-top: var(--mdx-sys-spacing-flex-l);
            padding-bottom: var(--mdx-sys-spacing-flex-l);
        }

        :host([no-margin-y]) {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }

        :host([no-margin-bottom]) {
            margin-bottom: 0 !important;
        }

        :host([margin-top-m]) {
            margin-top: var(--mdx-sys-spacing-flex-m) !important;
        }

        :host([variant=default]) > * {
            width: var(--body-section-default-width, 86.666%);
        }
        :host([variant=default]) > [wider] {
            width: calc(100% - 2rem);
        }
        :host([variant=narrow]) > * {
            width: var(--body-section-narrow-width, 57.222%);
        }
        :host([variant=narrow]) > [wider] {
            width: var(--body-section-default-width, 86.666%);
        }
        :host([variant=full]) > * {
            width: 100%;
        }

        /* remove space of the first child */
        :host(:first-child),
        :host > *:first-child,
        :host > [wrapper]:first-child {
            margin-top: 0 !important;
        }
        /* remove space of the last (visible) child */
        :host(:last-child),
        :host(.ks-o-body-section__last-child),
        :host > .ks-o-body-section__last-child,
        :host > [wrapper].ks-o-body-section__last-child {
            margin-bottom: 0 !important;
        }
        :host > ks-m-checkout-box-wrapper.ks-o-body-section__last-child {
            padding-bottom: var(--mdx-sys-spacing-flex-l) !important;
        }
        :host([variant=default]) > [namespace="teaser-fullwidth-"],
        :host([variant=narrow]) > [namespace="teaser-fullwidth-"] {
            width: calc(var(--body-section-default-width, 86.666%) + var(--mdx-sys-spacing-fix-m) * 2);
        }
        :host > [namespace="teaser-text-image-"][image-size="small"] {
            width: var(--body-section-narrow-width);
        }

        /* custom element spacings */
        :host > ks-m-figure,
        :host > ks-a-video {
            margin-top: var(--mdx-sys-spacing-flex-m);
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        :host > a[namespace="teaser-fullwidth-"][wrapper],
        :host > a[namespace="teaser-text-image-"][wrapper] {
            margin-top: var(--mdx-sys-spacing-flex-m);
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        :host([has-background]) > a:first-child[namespace="teaser-fullwidth-"][wrapper],
        :host([has-background]) > a:first-child[namespace="teaser-text-image-"][wrapper] {
            margin-top: 0;
        }
        :host([has-background]) > a.ks-o-body-section__last-child[namespace="teaser-fullwidth-"][wrapper],
        :host([has-background]) > a.ks-o-body-section__last-child[namespace="teaser-text-image-"][wrapper] {
            margin-bottom: 0;
        }

        /* Utilities */
        /* responsive spacings */
        :host > .margin-y-l {
            margin-top: var(--mdx-sys-spacing-flex-l);
            margin-bottom: var(--mdx-sys-spacing-flex-l);
        }
        :host > .margin-top-l {
            margin-top: var(--mdx-sys-spacing-flex-l);
        }
        :host > .margin-bottom-l {
            margin-bottom: var(--mdx-sys-spacing-flex-l);
        }
        :host > .margin-y-m {
            margin-top: var(--mdx-sys-spacing-flex-m);
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        :host > .align-center {
            text-align: center;
        }
        :host > .margin-top-m {
            margin-top: var(--mdx-sys-spacing-flex-m);
        }
        :host > .margin-bottom-m {
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        :host > .margin-y-s {
            margin-top: var(--mdx-sys-spacing-flex-s);
            margin-bottom: var(--mdx-sys-spacing-flex-s);
        }
        :host > .margin-top-s {
            margin-top: var(--mdx-sys-spacing-flex-s);
        }
        :host > .margin-bottom-s {
            margin-bottom: var(--mdx-sys-spacing-flex-s);
        }
        :host > .margin-y-xs {
            margin-top: var(--mdx-sys-spacing-flex-xs);
            margin-bottom: var(--mdx-sys-spacing-flex-xs);
        }
        :host > .margin-top-xs {
            margin-top: var(--mdx-sys-spacing-flex-xs);
        }
        :host > .margin-bottom-xs {
            margin-bottom: var(--mdx-sys-spacing-flex-xs);
        }
        /* static spacings */
        :host > .margin-top-fix-s {
            margin-top: var(--mdx-sys-spacing-fix-s);
        }
        :host > .margin-bottom-fix-s {
            margin-bottom: var(--mdx-sys-spacing-fix-s);
        }
        :host > .margin-top-fix-m {
            margin-top: var(--mdx-sys-spacing-fix-m);
        }
        :host > .margin-bottom-fix-m {
            margin-bottom: var(--mdx-sys-spacing-fix-m);
        }
        :host > .margin-top-fix-l {
            margin-top: var(--mdx-sys-spacing-fix-l);
        }
        :host > .margin-bottom-fix-l {
            margin-bottom: var(--mdx-sys-spacing-fix-l);
        }

        /* debug ruler to check alignment, DO NOT USE IN PRODUCTION */
        :host > [debug-ruler] {
            position: absolute;
            inset: 0;
            margin: auto;
            z-index: 2;
            pointer-events: none;
        }
        :host > [debug-ruler]::before {
            content: '';
            display: block;
            height: calc(100% + 40px);
            margin: -20px auto;
            border-left: 1px solid red;
            border-right: 1px solid red;
        }

        /* centered buttons */
        :host > ks-a-button,
        :host > .center > ks-a-button {
            width: 100%;
            max-width: calc(400rem/16);
        }

        /* responsive tables */
        :host div:has(>table) {
            overflow-x: auto;
            margin-bottom: var(--mdx-sys-spacing-flex-l);
        }

        @media screen and (max-width: _max-width_) {

            ${(this.hasAttribute('display-mobile'))
                /* had to reset display here because it was set to display inline-block !important in parent class */
                ? `:host(ks-o-body-section) {
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

            /* exceptions for the width */
            :host([variant=default]) > .extended-container-mobile,
            :host([variant=default]) > [namespace=teaser-text-image-] {
                width: calc(100% - 1rem);
            }

            :host > [namespace="teaser-fullwidth-"] {
                width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
    `
  }

  addClassToLastChild () {
    const children = this.root.children
    let lastChild = null

    Array.from(children).forEach(child => {
      if (child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT') {
        lastChild = child
      }
    })

    if (lastChild) {
      // @ts-ignore
      lastChild.classList.add('ks-o-body-section__last-child')
    }
  }
}
