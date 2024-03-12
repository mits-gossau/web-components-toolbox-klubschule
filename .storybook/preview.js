// .storybook/preview.js

import '../src/es/components/web-components-toolbox/src/css/initial.css'
import '../src/es/components/web-components-toolbox/src/css/reset.css'
import '../src/es/components/web-components-toolbox/src/css/colors.css'
import '../src/es/components/web-components-toolbox/src/css/fonts.css'
import '../src/es/components/web-components-toolbox/src/css/variables.css'

import '../src/css/variablesCustom.css'

import { html } from 'lit-html'

// import(
//   '../src/es/components/atoms/button/Button'
// ).then((module) => self.customElements.define('ks-a-button', module.default))

// import('../wc-config.js')


  export default {
    decorators: [(story) => html`
    <div>${story()}</div>
    <script>
        const event = new Event('storiesLoaded'); // triggers the wc-config loading of components
        window.dispatchEvent(event);
    </script>
    `],
  };