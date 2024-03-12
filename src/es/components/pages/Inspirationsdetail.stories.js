import { html } from 'lit-html'

import(
    '../../components/atoms/button/Button'
  ).then((module) => self.customElements.define('ks-a-button', module.default))

// const asset = '../../../../wc-config.js';
// import(`${asset}`)

export default {
  title: 'Pages/Inspirationsdetail',
  component: 'ks-a-button'
}

export const Page = () => html`<ks-a-button namespace="button-primary-">Button</ks-a-button>`
