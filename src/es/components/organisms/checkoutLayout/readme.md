# CheckoutLayout

> CheckoutLayout component with two variations.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-736)
- [Figma](https://www.figma.com/design/thNWJxDbPikhVAE95eEHLI/Design-System-Pages-%7C%C2%A0Klubschule?m=dev&node-id=5966%3A71085)

## API

[Examples](../../pages/CheckoutLayout.html) of all variations

### Slots

- `slot="top"`: Slot to be used for stage (or progress stepper)
- `slot="main"`: Left main content (e. g. forms and other content)
- `slot="sidebar"`: Right sidebar content (usually the summary of the offer)
- `slot="bottom"`: Content before the footer


```html
<ks-o-checkout-layout>

    <section slot="top">
        <ks-m-checkout-color-stage 
            back-label="Zurück (fallback browser back)" 
            title="Konfiguration: {{ Angebotstitel }}"
        >
        </ks-m-checkout-color-stage>
    </section>

    <section slot="main">
        <h2>Main Content</h2>
        <p>(Desktop auf linker Seite)</p>
    </section>

    <section slot="sidebar">
        <h2>Sidebar</h2>
        <p>(Desktop rechts)</p>
    </section>

    <section slot="bottom">
        <ks-m-back-forward
            back-label="Zurück"
            back-link="#back"
            forward-label="Weiter"
            forward-link="/"
        ></ks-m-back-forward>
    </section>

</ks-o-checkout-layout>
```