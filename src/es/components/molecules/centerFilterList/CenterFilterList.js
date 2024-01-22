// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

const centers = {
    "Deutsche Schweiz" : [
        "Aarau", "Aargau-Bern-und-Solothum", "Baden", "Basel", "Bern",
        "Bern-Firmengeschaeft", "Bern-Welle7", "Brig", "Buchs-SG", "Chur",
        "Davos-Klosters", "Frauenfeld", "Glarus", "Luzern", "Lyss",
        "Olten", "Rapperswil", "Schaffhausen", "Sportpark-Dietikon", 
        "St. Gallen", "St. Gallen Musikzentrum", "Sursee", "Thun", 
        "Wetzikon", "Winterthur", "Zug", "Zürich Limmatplatz", 
        "Zürich Oerlikon", "Zürich Altstetten", "Zürich Tanzwerk 101", 
        "Zürich Angebote für Firmen"
    ],
    "Französische Schweiz": ["Fribourg", "Geneve", "La-Chaux-de-Fonds", "Lausanne", "Martigny", "Nyon", "Val-de-Ruz"],
    "Italienische Schweiz": ["Bellinzona", "Lugano"]
};

const langOrder = {
    "DE": ["Deutsche Schweiz", "Französische Schweiz", "Italienische Schweiz"],
    "FR": ["Französische Schweiz", "Deutsche Schweiz", "Italienische Schweiz"],
    "IT": ["Italienische Schweiz", "Französische Schweiz", "Deutsche Schweiz"]
};

export default class CenterFilterList extends Shadow() {
    constructor (options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)
    }


    connectedCallback() {
      this.renderHTML()
    }

    disconnectedCallback () {}

    renderHTML () {
      const lang = this.getAttribute('lang') || "DE";
      const centerFilter = document.createElement('div')

      this.fetchModules([{
          path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
      }])
  
      langOrder[lang].forEach(region => {
        if(centers[region]) {
          // headline
          const headline = document.createElement('h3');
          headline.textContent = region;
          centerFilter.appendChild(headline);
  
          centers[region].forEach(city => {
            // checkbox
            const checkbox = document.createElement('mdx-checkbox');
            checkbox.setAttribute('variant', "no-border");
            checkbox.setAttribute('label', city);
  
            const component = document.createElement('mdx-component');
            
            component.setAttribute('click-event-name', "mdx-component-click-event");
            component.setAttribute('mutation-callback-event-name', "mdx-component-mutation-event");
            component.setAttribute('listener-event-name', "mdx-set-attribute");
            component.setAttribute('listener-detail-property-name', "attributes");
  
            component.appendChild(checkbox);
  
            centerFilter.appendChild(component);
          });
        }
      });

      this.html = centerFilter
    }
  }