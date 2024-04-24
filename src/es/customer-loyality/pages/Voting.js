// @ts-check
import { Shadow } from "../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js";

/**
 * Voting
 *
 * @export
 * @class Voting
 * @type {CustomElementConstructor}
 */
export default class Voting extends Shadow() {
  /**
   * @param {any} args
   */
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args);
  }

  connectedCallback() {
    this.hidden = true;
    const showPromises = [];
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS());
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML());
    Promise.all(showPromises).then(() => {
      this.hidden = false;
    });
  }

  shouldRenderHTML() {
    return !this.votingWrapper;
  }

  shouldRenderCSS() {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    );
  }

  /**
   * renders the html
   * @return {void}
   */
  renderHTML() {
    this.votingWrapper =
      this.root.querySelector("div") || document.createElement("div");
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../components/atoms/heading/Heading.js`,
        name: "ks-a-heading",
      },
      {
        path: `${this.importMetaUrl}../../components/organisms/bodySection/BodySection.js`,
        name: "ks-o-body-section",
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/systemNotification/systemNotification.js`,
        name: "ks-m-system-notification",
      },
    ]);

    this.html = /* html */ `
        <ks-o-body-section variant="default">
            <ks-a-heading tag="h1">Kurs trotzdem durchführen? Sie haben die Wahl!</ks-a-heading>
        </ks-o-body-section>
        <ks-o-body-section variant="default">
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Kurstitel</td>
                            <td>Englisch A1</td>
                        </tr>
                        <tr>
                            <td>Kursnummer</td>
                            <td>E_1275889</td>
                        </tr>
                        <tr>
                            <td>Datum</td>
                            <td>31.01.2019 - 20.06.2019</td>
                        </tr>
                        <tr>
                            <td>Ort</td>
                            <td>Limmatalstrasse 152, 8005 Zürich</td>
                        </tr>
                        <tr>
                            <td>Anzahl Lektionen</td>
                            <td>20 Lektionen</td>
                        </tr>
                        <tr>
                            <td>Kurspreis</td>
                            <td>CHF 600.00</td>
                        </tr>
                </table>
            </div>
            <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle">
                <div slot="description">
                    <p>Wegen fehlender Anmeldungen können wir nicht garantieren, dass Ihr Kurs in der ursprünglichen Form stattfinden kann. Es besteht jedoch die Möglichkeit, dass er mit kleinen Änderungen durchgeführt wird.</p>
                </div>
            </ks-m-system-notification>
        </ks-o-body-section>
      `;
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS() {
    this.css = /* css */ `
    :host {}
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `;
  }
}
