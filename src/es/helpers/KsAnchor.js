// @ts-check
import { Shadow } from '../../es/components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import Button from '../../es/components/web-components-toolbox/src/es/components/atoms/button/Button.js'

/* global location */
/* global self */

// @ts-ignore
export const KsAnchor = (ChosenClass = Shadow()) => class KsAnchor extends ChosenClass {
    /**
     * Anchor, does fix the default light dom anchor behavior on a specific component.
     * Creates an instance of Shadow. The constructor will be called for every custom element using this class when initially created.
     *
     * @param {*} args
     */
    constructor(options = {},...args) {
        super(options, ...args)
        this.clickAnchorEventListener = event => {
            let element = null
            console.log("The problem is that in this case, #this# object refers to the button instead of the current #this#. The reason is that KsAnchor.js inherits from Button.js as an extended class, rather than from Shadow.js. If you check (console.log) #this# in the toolbox Anchor.js, you'll find that the current #this# is always the correct one, because the extended class of toolbox Anchor.js is Shadow.js.", this)
            if ((element = this.root.querySelector((event && event.detail && event.detail.selector.replace(/(.*#)(.*)$/, '#$2')) || location.hash || null))) {
                const isElementScrolled = element.getAttribute('scrolled') === 'true'
                if (!isElementScrolled) {
                    element.setAttribute('scrolled', 'true')
                } else {
                    element.setAttribute('scrolled', 'false')
                    // @ts-ignore
                    history.replaceState(null, null, ' ');
                    if (window.history.length > 1) {
                        window.history.back()
                        window.history.back()
                    } else {
                        window.history.back()
                    }
                    return false;
                }
            }
        }
    }

    /**
     * Lifecycle callback, triggered when node is attached to the dom
     *
     * @return {void}
     */
    connectedCallback() {
        super.connectedCallback()
        // check if the button is an anchor tag
        if (this.hasAttribute('href') && this.getAttribute('href').charAt(0) === '#') {
            self.addEventListener('hashchange', this.clickAnchorEventListener)
        }
    }

    /**
     * Lifecycle callback, triggered when node is detached from the dom
     *
     * @return {void}
     */
    disconnectedCallback() {
        super.disconnectedCallback()
        // check if the button is an anchor tag
        if (this.hasAttribute('href') && this.getAttribute('href').charAt(0) === '#') {
            self.removeEventListener('hashchange', this.clickAnchorEventListener)
        }

    }
}
