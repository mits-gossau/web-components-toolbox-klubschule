# Troublemaker

> Troublemaker component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-99)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1773)
- [Examples](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/molecules/troublemaker/Troublemaker.html) and ["in action"](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Angebotsliste-Suchergebnis.html) of all variations

## CMS Integration
```
<ks-m-troublemaker namespace="troublemaker-default-" color-prop="var(--color-ks-green)" href="baaahhh">
  <a href="baaah">
    <div>
      <h3>Dynamic Headline</h3>
      <p>Dynamic Text: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
    </div>
    <div>
      <ks-a-button namespace="button-primary-" color="secondary" hover-selector="ks-m-troublemaker">
        Passende Abos anzeigen<a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
      </ks-a-button>
    </div>
  </a>
</ks-m-troublemaker>
```
- 1. The first node inside `ks-m-troublemaker` has to be an `a` node
- 2. Place two `div` nodes inside the `a` node (which by `namespace="troublemaker-default-"` is displayed as flex box)
- 3. Add a heading `h3` and a text `p` inside the first `div` node
- 4. Place the cta in form of `ks-a-button` inside the second `div` node. Note: [`ks-a-button` readme](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/atoms/button/readme.md)

### Variations (check out example Organism aka. List page above):
- *namespace*: Set Attribute `namespace` to `troublemaker-default-` load the default styling for the html structure seen above
- *color*: Set Attribute `color` to:  
  `secondary`: main brand color 
  `tertiary`: neutral/gray color  
  `ks-blue`: klubschule blue  
  `ks-red`: klubschule red  
  `ks-orange`: klubschule orange  
  `ks-green`: klubschule green  
  `ks-companies`: klubschule companies  
  `ibaw-turquoise`: ibaw turquoise  
  `ibaw-lightblue`: ibaw lightblue  
  `pro-greengray`: pro greengray  
  `pro-terracotta`: pro terracotta  
- *color-prop*: Set Attribute `color-prop` to your css color value or better variable or consume by default --color-secondary. Note: This attribute trumps the color attribute, in case both are set at the same time

