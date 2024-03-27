// .storybook/preview.js

import '../src/es/components/web-components-toolbox/src/css/initial.css'
import '../src/es/components/web-components-toolbox/src/css/reset.css'
import '../src/es/components/web-components-toolbox/src/css/colors.css'
import '../src/es/components/web-components-toolbox/src/css/fonts.css'
import '../src/es/components/web-components-toolbox/src/css/variables.css'

import '../src/css/variablesCustom.css'

import { html } from 'lit-html'


export default {
  decorators: [(story) => html`
${story()}

<!-- DO NOT COPY SCRIPT! Only for demo purposes -->
<script>
  window.dispatchEvent(new Event('storiesLoaded')); // triggers the wc-config loading of components
</script>
  `],
};