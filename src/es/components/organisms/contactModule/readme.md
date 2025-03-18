# ContactModule

> ContactModule Organism extend o-grid [readme](https://github.com/mits-gossau/web-components-toolbox/blob/master/src/es/components/organisms/grid/readme.md) and supports all the o-grid functionalities accordingly.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1847)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1858)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1883)
- [Figma](https://www.figma.com/design/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?node-id=13740-267450&m=dev)
- [Example](https://github.com/mits-gossau/web-components-toolbox-klubschule/tree/dev/src/es/components/organisms/contactModule/contactModule.html)
- [Demo](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/organisms/contactModule/contactModule.html)

## CMS Integration as child of main or any other parent
```
<ks-o-contact-module>
  <section>
    <!--{contact items}-->
  </section>
</ks-o-contact-module>
```

## CMS Integration as child of < ks-o-body-section > *(background support)*
```
<ks-o-body-section variant="default" background="var(--mdx-sys-color-accent-6-subtle1)" has-background>
  <p>Haben Sie Fragen zu unseren Firmenkursen? Nehmen Sie mit uns Kontakt auf.</p>
  <ks-o-contact-module>
    <section>
      <!--{contact items}-->
    </section>
  </ks-o-contact-module>
</ks-o-body-section>
```

## CMS Integration as child of grid - aside (side section desktop)
```
<o-grid namespace=grid-2columns-content-section- first-container-vertical first-column-with=66% with-border width=100%>
  <section>
    <ks-o-body-section content-width-var=100% no-margin-y>
      <h2>Left content</h2>
      <p>Lorem ipsum...</p>
    </ks-o-body-section>
    <aside>
      <ks-o-contact-module>
        <section>
          <!--{contact items}-->
        </section>
      </ks-o-contact-module>
    </aside>
  </section>
</o-grid>
```

## CMS Integration contact item "simple"
- the simple item always uses h3's in the design. Although, h3's are interchangeable with h2's and equally supported.
- optional a - tag around the img. Set the .logo class on the image tag, if the a - tag is omitted.
- .logo image can be an img - or ks-a-picture - tag. For svg's it may is easier with an img - tag.
- the buttons have to be wrapped in a div.buttons, which can optionally have the css class horizontal, to align them horizontally for desktop.
```
<div>
  <h3>Klubschule</h3>
  <a href="https://klubschule.ch" alt="Klubschule" class="logo">
    <img src="http://localhost:3000/src/img/klubschule-logo-de.svg" alt="Klubschule">
  </a>
  <ks-m-contact-row
    name="+41 44 456 73 28"
    icon-name="Phone"
    href="tel:+499123456789"
  >
  </ks-m-contact-row>
  <ks-m-contact-row
    name="info@klubschule.ch"
    icon-name="Mail"
    href="mailto:info@klubschule.ch"
  >
  </ks-m-contact-row>
  <div class="buttons">
    <ks-a-button namespace="button-primary-" color="secondary" href="tel:+499123456789">
      <a-icon-mdx icon-name="Phone" size="1em" class="icon-left"></a-icon-mdx>+41 44 456 73 28
    </ks-a-button>
    <ks-a-button namespace="button-secondary-" color="secondary" href="mailto:info@klubschule.ch">
      <a-icon-mdx icon-name="Mail" size="1em" class="icon-left"></a-icon-mdx>E-Mail
    </ks-a-button>
  </div>
</div>
```

## CMS Integration contact item "universal"
- the universal item mostly uses h2's in the design. Although, h2's are interchangeable with h3's and equally supported.
- in the design there are variants without a p - tag, which is optional
- figure can optionally have a ks-a-picture
- ks-a-picture's namespace is optional and should be used according to that component definitions
- figcaption is required
- the buttons have to be wrapped in a div.buttons, which can optionally have the css class horizontal, to align them horizontally for desktop.
```
<div>
  <h2>Kontaktieren Sie uns</h2>
  <p>Haben Sie Fragen zu einem Kurs? Benötigen Sie Unterstützung? Wir sind für Sie da und freuen uns auf Ihre Nachricht.</p>
  <figure>
    <ks-a-picture
      namespace="picture-default-"
      defaultSource="https://www.klubschule.ch/media/oxeieind/k-zeichnen-und-malen-02.jpeg?format=webp&amp;width=2500&amp;quality=80"
      alt="zeichnen und malen"
      aspect-ratio="1"
    >
    </ks-a-picture>
    <figcaption>
      <h3>Simone Ammann</h3>
      <p>Bereichsleiter Firmen und Institutionen<br>Miduca AG<br>8005 Zürich</p>
      <h3>Meine Kontaktmöglichkeiten</h3>
      <ks-m-contact-row
        name="+41 44 456 73 28"
        icon-name="Phone"
        href="tel:+499123456789"
      >
      </ks-m-contact-row>
      <ks-m-contact-row
        name="info@klubschule.ch"
        icon-name="Mail"
        href="mailto:info@klubschule.ch"
      >
      </ks-m-contact-row>
      <ks-m-contact-row
        name="LinkedIn"
        icon-name="Linkedin"
        href="https://www.linkedin.com/"
      >
      </ks-m-contact-row>
      <div class="buttons horizontal">
        <ks-a-button namespace="button-primary-" color="secondary" href="tel:+499123456789">
          <a-icon-mdx icon-name="Phone" size="1em" class="icon-left"></a-icon-mdx>+41 44 456 73 28
        </ks-a-button>
        <ks-a-button namespace="button-secondary-" color="secondary" href="mailto:info@klubschule.ch">
          <a-icon-mdx icon-name="Mail" size="1em" class="icon-left"></a-icon-mdx>E-Mail
        </ks-a-button>
      </div>
    </figcaption>
  </figure>
</div>
```

### Parent web components
1. ks-o-body-section [component](https://github.com/mits-gossau/web-components-toolbox-klubschule/tree/master/src/es/components/organisms/bodySection)
2. o-grid [readme](https://github.com/mits-gossau/web-components-toolbox/blob/master/src/es/components/organisms/grid/readme.md)

### Child web components
1. ks-a-picture [component](https://github.com/mits-gossau/web-components-toolbox-klubschule/tree/master/src/es/components/atoms/picture)
2. ks-m-contact-row [readme](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/molecules/contactRow/readme.md)
3. ks-a-button [readme](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/atoms/button/readme.md)

### CSS classes
1. **.buttons**: is used at item "simple" and "universal". The class .buttons is set on the div - tag wrapping the button components. It ensures the correct size of the buttons.
2. **.horizontal**: optional. Is used at item "simple" and "universal". The class .horizontal is set on the div - tag wrapping the button components. It allows displaying the buttons horizontally on the same line, if desired.
3. **.logo**: is used at item "simple". The class .logo is set on the a - tag wrapping the logo image or directly on the image tag, if there is no link. It ensures the correct logo size.

### Attribute variations (check out example page above):
1. **grid-template-columns**: optional `'1', '2', '3', '4' default '1'` define how many columns the grid shall posses. The grid has automatically one column, if omitted.
2. **force-mobile-figure**: optional `has default none` is used at item "universal" to enforce the picture to align above the figcaption for desktop.
3. **background**: optional `css - string` is used to set an inline background. Expl.: `background="var(--mdx-sys-color-accent-6-subtle1)"`.
