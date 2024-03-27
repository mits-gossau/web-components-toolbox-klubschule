import { html } from 'lit-html'
import { toHTML } from '../../../../../.storybook/helper/toHTML'

export default {
  title: 'Molecules/Stage',
  component: 'ks-m-stage',
  args: {
    headline: 'Headline',
    imgUrl: 'https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A'
  }
}

export const StageDefault = ({ headline, imgUrl }) => toHTML(/* html */`
  <ks-m-stage 
    namespace="stage-default-" 
  >
    <a-picture
        picture-load 
        defaultSource="${imgUrl}" 
        alt="randomized image">
    </a-picture>
    <p class="topline">
        <ks-a-back-link href="#" alt="Alternative Text for Backlink">
            Back Link
        </ks-a-back-link>
    </p>
    <ks-a-heading tag="h1" display-2>
        ${headline}
    </ks-a-heading>
    <a-input inputid="searchField" placeholder="Label" icon-name="Search" icon-size="1.25em" search="?q=" type="search"></a-input>
  </ks-m-stage>
`)

export const StageTitle = {
  /* additional args/argTypes */
  argTypes: {
    brand: {
      type: 'select',
      options: ['ks', 'ibaw', 'ksos']
    }
  },
  args: {
    brand: 'ks'
  },
  render: ({ headline, imgUrl, brand }) => toHTML(/* html */`
    <ks-m-stage namespace="stage-title-">
      <p class="topline">
          <ks-a-back-link href="#" alt="Alternative Text for Backlink">
              Back Link
          </ks-a-back-link>
      </p>
      <ks-a-heading tag="h1" display-3 border-top brand="${brand}">
          ${headline}
      </ks-a-heading>
      <a-picture
          picture-load 
          defaultSource="${imgUrl}" 
          alt="randomized image">
      </a-picture>
    </ks-m-stage>
  `)
}
/* Using lit-html seems to break when Args get changed */
export const ExampleLitHtml = ({ headline, imgUrl }) => html`
  <ks-m-stage namespace="stage-title-">
    <p class="topline">
        <ks-a-back-link href="#" alt="Alternative Text for Backlink">
            Back Link
        </ks-a-back-link>
    </p>
    <ks-a-heading tag="h1" display-3 border-top>
        ${headline}
    </ks-a-heading>
    <a-picture
        picture-load 
        defaultSource="${imgUrl}" 
        alt="randomized image">
    </a-picture>
  </ks-m-stage>
`
