# CheckoutLayout

> CheckoutLayout component with two variations.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-736)
- [Figma](https://www.figma.com/design/thNWJxDbPikhVAE95eEHLI/Design-System-Pages-%7C%C2%A0Klubschule?m=dev&node-id=5966%3A71085)

## API

[Examples](../../pages/CheckoutLayout.html) of all variations

### IDs

- `id="top"`: Id to be used for stage (or progress stepper)
- `id="main"`: Left main content (e. g. forms and other content)
- `id="sidebar"`: Right sidebar content (usually the summary of the offer)
- `id="bottom"`: Content before the footer


```html
<ks-o-checkout-layout>

    <section id="top">
        <ks-m-checkout-color-stage 
            back-label="Zurück (fallback browser back)" 
            title="Konfiguration: {{ Angebotstitel }}"
        >
        </ks-m-checkout-color-stage>
    </section>

    <section id="main">
        <h2>Main Content</h2>
        <p>(Desktop auf linker Seite)</p>
    </section>

    <section id="sidebar">
        <h2>Sidebar</h2>
        <p>(Desktop rechts)</p>
    </section>

    <section id="bottom">
        <ks-m-back-forward
            back-label="Zurück"
            back-link="#back"
            forward-label="Weiter"
            forward-link="/"
        ></ks-m-back-forward>
    </section>

</ks-o-checkout-layout>
```