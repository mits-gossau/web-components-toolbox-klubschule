# ContactModule

> ContactModule Organisms

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1847)
- [Figma](https://www.figma.com/design/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?node-id=13740-267450&m=dev)
- [Example](https://github.com/mits-gossau/web-components-toolbox/blob/master/docs/TemplateMiduweb.html#L73)
- [Demo](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/organisms/contactModule/default-/default-.html)

## CMS Integration as child of <ks-o-body-section>
```
<ks-o-body-section variant="default" background="var(--mdx-sys-color-accent-6-subtle1)" has-background tabindex="0" aria-label="Section">
    <div>
        <ks-o-contact-module namespace="contact-module-default-">
            <h2>Für jeden das passende Angebot</h2>
            <div class="facts">
                <ks-o-contact class="fact">
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        street="Hofweiesenstrasse 350"
                        place="8050 Zürich"
                        icon-name="Home"
                        href="#"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="+49 0160 49858582"
                        icon-name="Phone"
                        href="tel:+499123456789"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="mailto:fritz.eierschale@example.org"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="www.google.com"
                        is-external
                    >
                    </ks-m-contact-row>
                </ks-o-contact>
                <ks-o-contact class="fact">
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        street="Hofweiesenstrasse 350"
                        place="8050 Zürich"
                        icon-name="Home"
                        href="#"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="+49 0160 49858582"
                        icon-name="Phone"
                        href="tel:+499123456789"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="mailto:fritz.eierschale@example.org"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="www.google.com"
                        is-external
                    >
                    </ks-m-contact-row>
                </ks-o-contact>
                <ks-o-contact class="fact">
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        street="Hofweiesenstrasse 350"
                        place="8050 Zürich"
                        icon-name="Home"
                        href="#"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="+49 0160 49858582"
                        icon-name="Phone"
                        href="tel:+499123456789"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="mailto:fritz.eierschale@example.org"
                    >
                    </ks-m-contact-row>
                    <ks-m-contact-row
                        name="Klubschule Migros Zürich"
                        icon-name="Mail"
                        href="www.google.com"
                        is-external
                    >
                    </ks-m-contact-row>
                </ks-o-contact>
            </div>
        </ks-o-contact-module>
    </div>
</ks-o-body-section>
```

### Parent web components
1. ks-o-body-section [variant examples](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Figure.html)

### Child web components
1. ks-o-contact [readme](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/feature/MIDUWEB-1847_contact_module/src/es/components/organisms/contact/readme.md)
2. ks-m-contact-row [readme](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/feature/MIDUWEB-1847_contact_module/src/es/components/molecules/contactRow/readme.md)

### Attribute variations (check out example page above):
- *background-color*: optional `transparent` to inset the contact module with a padding and give it a background independent of the ks-o-body-section parentNode.
