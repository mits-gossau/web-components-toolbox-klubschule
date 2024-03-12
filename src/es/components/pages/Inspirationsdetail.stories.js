import { html } from 'lit-html'

// import(
//     '../../components/atoms/button/Button'
//   ).then((module) => self.customElements.define('ks-a-button', module.default))

// const asset = '../../../../wc-config.js';
// import(`${asset}`)

export default {
  title: 'Pages/Inspirationsdetail',
  component: 'ks-a-button'
}

export const Page = () => html`
<!-- Set the color for headlines. Not sure where this will be placed on the backend, but it needs to be included to adjust the color according to topic/brand -->
<style>
    :host {
        --h-color: var(--mdx-sys-color-accent-1-default); /* Color can be adjusted */
    }
</style>

<!-- Stage mit Titel -->
<ks-m-stage namespace="stage-title-">
    <p class="topline">
        <ks-a-back-link href="#" alt="Alternative Text for Backlink">
            Stories
        </ks-a-back-link>
    </p>
    <ks-a-heading tag="h1" display-3 centered border-top>
        Asd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
    </ks-a-heading>
    <a-picture picture-load namespace="picture-cover-" alt="Photoandy"
        defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A">
    </a-picture>
</ks-m-stage>
<!-- /Stage mit Titel -->

<o-grid namespace="grid-2columns-content-section-" first-container-vertical="" first-column-with="66%"
    with-border="" width="100%">
    <ks-o-body-section content-width-var="100%" no-margin-y>

        <!-- Social LogoList -->
        <ks-m-logo-list namespace="logo-list-default-" class="margin-y-m">
            <p style="color: var(--mdx-sys-color-neutral-bold2)">von Max Muster, 8. August 2023</p>
            <ul>
                <li>
                    <a  href="#">
                        <a-icon-mdx icon-name="Facebook" size="1.5rem"></icon-mdx>
                    </a>
                </li>
                <li>
                    <a  href="#">
                        <a-icon-mdx icon-name="Twitter" size="1.5rem"></icon-mdx>
                    </a>
                </li>
                <li>
                    <a  href="#">
                        <a-icon-mdx icon-name="MessageCircle" size="1.5rem"></icon-mdx>
                    </a>
                </li>
                <li>
                    <a  href="#">
                        <a-icon-mdx icon-name="Mail" size="1.5rem"></icon-mdx>
                    </a>
                </li>
                <li>
                    <a  href="#">
                        <a-icon-mdx icon-name="Linkedin" size="1.5rem"></icon-mdx>
                    </a>
                </li>
            </ul>
        </ks-m-logo-list>
        <!-- /Social LogoList -->

        <!-- CMS Contentbereich 1 -->

        <!-- CMS Titel -->
        <ks-a-heading tag="h2">Title h2</ks-a-heading>
        <!-- /CMS Titel -->

        <!-- CMS RichText -->
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
            rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
            clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        <!-- /CMS RichText -->

        <!-- CMS Titel -->
        <ks-a-heading tag="h3">Title h3</ks-a-heading>
        <!-- /CMS Titel -->

        <!-- CMS RichText -->
        <p><strong>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                et justo duo dolores et ea rebum. </strong></p>
        <p>Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
            rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        <!-- /CMS RichText -->

        <!-- CMS Akkordeon Container -->
        <div class="margin-y-m">
            <m-details namespace="details-default-icon-right-">
                    <details>
                        <summary>
                            <h4>accordion 1</h4>
                        </summary>
                        <div>
                            <style>
                                :host details summary~* {
                                    --details-default-color-secondary: var(--color-hover);
                                }
                            </style>
                            <ks-a-heading tag="h3">test title</ks-a-heading>
                            <div>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                                    voluptua.</p>
                            </div>
                        </div>
                    </details>
            </m-details>
            <m-details namespace="details-default-icon-right-">
                    <details>
                        <summary>
                            <h4>accordion 2</h4>
                        </summary>
                        <div>
                            <style>
                                :host details summary~* {
                                    --details-default-color-secondary: var(--color-hover);
                                }
                            </style>
                            <div>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                                    voluptua.</p>
                            </div>
                        </div>
                    </details>
            </m-details>
            <m-details namespace="details-default-icon-right-">
                    <details>
                        <summary>
                            <h4>accordion 3</h4>
                        </summary>
                        <div>
                            <style>
                                :host details summary~* {
                                    --details-default-color-secondary: var(--color-hover);
                                }
                            </style>
                            <div>
                                <ks-a-button namespace="button-primary-" href="/de/" color="secondary"
                                    target="_self">
                                    <a-icon-mdx icon-name="ArrangeAndroid" size="1em" class="icon-left"
                                        tabindex="0"> </a-icon-mdx>
                                    <span id="label">btn</span>
                                </ks-a-button>
                            </div>
                        </div>
                    </details>
            </m-details>
        </div>
        <!-- /CMS Akkordeon Container -->

        <!-- CMS Bild -->
        <ks-m-figure>
            <ks-a-picture picture-load namespace="picture-default-"
                defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                open-modal open-modal-mobile></ks-a-picture>
            <figcaption>test</figcaption>
        </ks-m-figure>
        <!-- /CMS Bild -->

        <!-- CMS Video -->
        <ks-a-video namespace="video-default-">
            <iframe src="https://www.youtube.com/embed/Mq0TiSppMOU?rel=0" title="video beschreibung" width="560"
                height="315" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            <span></span>
            <p>video beschreibung</p>
        </ks-a-video>
        <!-- /CMS Video -->

        <!-- CMS Carousel -->
        <m-carousel-two namespace=carousel-two-image- nav-flex-wrap separate nav-justify-content="end" nav-align-self="end" no-default-arrow-nav no-default-nav no-default-nav-linking>
            <section>
                <ks-m-figure with-line>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/kenan-sulayman-FV3M7igu8Fs-unsplash.jpg" alt="Yosemite"></a-picture>
                </ks-m-figure>
                <ks-m-figure with-line>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/anastasia-dulgier-NCFTGtjY3EQ-unsplash.jpg" alt="Houses"></a-picture>
         
                    <figcaption>more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses</figcaption>
                </ks-m-figure>
                <ks-m-figure with-line>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/arnaud-mariat-IPXcUYHeErc-unsplash.jpg" alt="Galaxies"></a-picture>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/vladimir-kondriianenko-bxwzcFy9YwM-unsplash.jpg" alt="Minimalist nightmare"></a-picture>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/matthew-smith-9CV6WrxxdrM-unsplash.jpg" alt="Motel"></a-picture>
                    <figcaption>Some figcaption</figcaption>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/jakob-owens-EkxOtUljwhs-unsplash.jpg" alt="Hoops"></a-picture>
                    <figcaption>Another figcaption</figcaption>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/tim-bogdanov-4uojMEdcwI8-unsplash.jpg" alt="Gentleman"></a-picture>
                    <figcaption>more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses more Houses</figcaption>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/weston-mackinnon-caUtk0DTiR0-unsplash.jpg" alt="Stuff"></a-picture>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/a3ac1ed5abaedffd9947face7901e14c.jpg" alt="Stuff"></a-picture>
                </ks-m-figure>
                <ks-m-figure>
                    <a-picture namespace="picture-cover-" aspect-ratio="0.5625" picture-load defaultSource="../src/es/components/molecules/carouselTwo/default-/img/weston-mackinnon-caUtk0DTiR0-unsplash.jpg" alt="Stuff"></a-picture>
                </ks-m-figure>
            </section>
            <div>
                <p id="index">
                    some Text
                </p>
                <nav>
                    <a href="#previous" aria-label="previous slide">
                        <ks-a-button icon namespace="button-primary-" color="tertiary"><a-icon-mdx icon-name="ArrowLeft" size="1em"></a-icon-mdx></ks-a-button>
                    </a>
                    <a href="#next" aria-label="next slide">
                        <ks-a-button icon namespace="button-primary-" color="tertiary"><a-icon-mdx icon-name="ArrowRight" size="1em"></a-icon-mdx></ks-a-button>
                    </a>
                </nav>
            </div>
        </m-carousel-two>
        <!-- /CMS Carousel -->

        <!-- /CMS Contentbereich 1 -->
    </ks-o-body-section>
    <aside>
        <ks-a-heading tag="h2" style-as="h3">unter-navigation</ks-a-heading>
        <div>
            <ks-m-link-list namespace="link-list-default-">
                <ul>
                    <li>
                        <a href="#">
                            <span>Label</span>
                            <a-icon-mdx namespace="icon-link-list-" icon-name="ArrowRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>                        
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>Label</span>
                            <a-icon-mdx namespace="icon-link-list-" icon-name="ArrowRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>                        
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>Label</span>
                            <a-icon-mdx namespace="icon-link-list-" icon-name="ArrowRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>                        
                        </a>
                    </li>
                </ul>
            </ks-m-link-list>
        </div>
    </aside>
</o-grid>

<ks-o-body-section variant="narrow">
<!-- CMS Contentbereich 2 -->
    <ks-a-heading tag="h2" border-top="">titel CMS Contentbereich 2</ks-a-heading>
    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
        et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
        dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
        magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    
    <!-- CMS Global TextImage -->
    <ks-o-body-section variant="default">
        <ks-m-teaser namespace="teaser-text-image-" color="secondary" text-position="right" href="/de/">
            <a-picture picture-load namespace="picture-teaser-"
                defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A">
            </a-picture>
            <div>
                <h3>bild und text</h3> 
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                <ks-a-button big namespace="button-primary-" href="/de/" target="_self">
                    <a-icon-mdx icon-name="ArrowRight" size="1em" class="icon-left" tabindex="0"> </a-icon-mdx>
                    <span id="label">btn label</span>
                </ks-a-button>
            </div>
        </ks-m-teaser>
        <ks-m-teaser namespace="teaser-text-image-" color="secondary" text-position="left" href="/de/">
            <a-picture picture-load namespace="picture-teaser-"
                defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A">
            </a-picture>
            <div>
                <h3>bild und text</h3> 
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                <ks-a-button big namespace="button-primary-" href="/de/" target="_self">
                    <a-icon-mdx icon-name="ArrowRight" size="1em" class="icon-left" tabindex="0"> </a-icon-mdx>
                    <span id="label">btn label</span>
                </ks-a-button>
            </div>
        </ks-m-teaser>
    </ks-o-body-section>
    <!-- /CMS Global TextImage -->

    <!-- CMS Button -->
    <div class="center">
        <ks-a-button namespace="button-primary-" href="/de/" color="secondary" target="_self">
            <a-icon-mdx icon-name="AddToList" size="1em" class="icon-left" tabindex="0"> </a-icon-mdx>
            <span id="label">button label</span>
        </ks-a-button>
    </div>
    <!-- /CMS Button -->
    
    <!-- CMS Global Fullwidth Teaser -->
    <ks-m-teaser namespace="teaser-fullwidth-" color="secondary" text-position="right" href="/de/test-am/">
        <a-picture picture-load namespace="picture-teaser-"
            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"></a-picture>
        <div>
            <h3>Test</h3>
            <p>Text Inhalt</p> 
            <ks-a-button big namespace="button-tertiary-" color="secondary"
                target="_self">
                TEST AM
                <a-icon-mdx icon-name="ArrowRight" size="1em" rotate="0" no-hover-transform></a-icon-mdx>
            </ks-a-button>
        </div>
    </ks-m-teaser>
    <!-- /CMS Global Fullwidth Teaser -->

    <!-- CMS Content Container -->
    <ks-o-body-section variant="narrow" has-background background="var(--mdx-sys-color-accent-6-subtle1)">
        <!-- CMS Titel -->
        <ks-a-heading tag="h2">content container title</ks-a-heading>
        <!-- /CMS Titel -->

        <!-- CMS RichText -->
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
                sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet.</p>
        <!-- /CMS RichText -->

        <!-- CMS Bild -->
        <ks-m-figure>
            <ks-a-picture picture-load namespace="picture-default-"
                defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"></ks-a-picture>
        </ks-m-figure>
        <!-- CMS Bild -->

        <!-- CMS Button -->
        <div class="center">
            <ks-a-button namespace="button-primary-" href="/de/" color="secondary" target="_self">
                <span id="label">btn label</span>
                <a-icon-mdx icon-name="AddToList" size="1em" class="icon-right" tabindex="0"> </a-icon-mdx>
            </ks-a-button>
        </div>
        <!-- /CMS Button -->
        
        <!-- CMS Video -->
        <ks-a-video namespace="video-default-">
            <iframe src="https://www.youtube.com/embed/Mq0TiSppMOU?rel=0" title="ks video" width="560"
                height="315" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            <span></span>
            <p>ks video</p>
        </ks-a-video>
        <!-- /CMS Video -->
    </ks-o-body-section>
    <!-- /CMS Content Container -->

    <!-- CMS Akkordeon Container -->
    <div class="margin-y-m">
        <m-details namespace="details-default-icon-right-">
                <details>
                    <summary>
                        <h4>accordion 1</h4>
                    </summary>
                    <div>
                        <style>
                            :host details summary~* {
                                --details-default-color-secondary: var(--color-hover);
                            }
                        </style>
                        <ks-a-heading tag="h3">test title</ks-a-heading>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                                voluptua.</p>
                        </div>
                    </div>
                </details>
        </m-details>
        <m-details namespace="details-default-icon-right-">
                <details>
                    <summary>
                        <h4>accordion 2</h4>
                    </summary>
                    <div>
                        <style>
                            :host details summary~* {
                                --details-default-color-secondary: var(--color-hover);
                            }
                        </style>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                                voluptua.</p>
                        </div>
                    </div>
                </details>
        </m-details>
        <m-details namespace="details-default-icon-right-">
                <details>
                    <summary>
                        <h4>accordion 3</h4>
                    </summary>
                    <div>
                        <style>
                            :host details summary~* {
                                --details-default-color-secondary: var(--color-hover);
                            }
                        </style>
                        <div>
                            <ks-a-button namespace="button-primary-" href="/de/" color="secondary"
                                target="_self">
                                <a-icon-mdx icon-name="ArrangeAndroid" size="1em" class="icon-left"
                                    tabindex="0"> </a-icon-mdx>
                                <span id="label">btn</span>
                            </ks-a-button>
                        </div>
                    </div>
                </details>
        </m-details>
    </div>
    <!-- /CMS Akkordeon Container -->

    <!-- CMS Table -->
        <div>
            <table>
                <thead>
                    <tr>
                        <th>
                            header 1
                        </th>
                        <th>
                            header 2
                        </th>
                        <th>
                            header 3
                        </th>
                    </tr>
                </thead>
                <tr>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </td>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </td>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et</p>
                    </td>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et</p>
                    </td>
                    <td>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et</p>
                    </td>
                </tr>
            </table>
        </div>
    <!-- /CMS Table -->

    <!-- CMS StoryTeaser -->
    <ks-o-body-section variant="default">
        <ks-a-heading tag="h2" style-as="h1" border-top>weitere stories</ks-a-heading>
        <o-grid namespace="grid-12er-" class="extended-container-mobile">
            <div col-sm="12" col-lg="8">
                <ks-m-teaser namespace=teaser-story- color="quaternary" href="/de/entdecken/story-1/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio"></a-picture>
                    </figure>
                </ks-m-teaser>
            </div>
            <div col-sm="12" col-lg="4">
                <ks-m-teaser namespace=teaser-story- color="septenary" href="/de/entdecken/story-zwei/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (2)"></a-picture>
                    </figure>
                </ks-m-teaser>
            </div>
            <div col-sm="12" col-lg="4">
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
            </div>
            <div col-sm="12" col-lg="4">
                <ks-m-teaser namespace=teaser-story- color="septenary" href="/de/entdecken/story-zwei-again/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (2)"></a-picture>
                    </figure>
                </ks-m-teaser>
            </div>
            <div col-sm="12" col-lg="4">
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink-again-nomol/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
            </div>
        </o-grid> 
    </ks-o-body-section>
    <!-- /CMS StoryTeaser -->

    <!-- CMS Teaser Slider -->
    <ks-o-body-section variant="default">
        <m-carousel-two namespace=carousel-two-3-column- nav-flex-wrap separate nav-justify-content="end" nav-align-self="end" no-default-arrow-nav no-default-nav no-default-nav-linking>
            <section>
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink-again-nomol/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink-again-nomol/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink-again-nomol/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
                <ks-m-teaser namespace=teaser-story- color="quinary" href="/de/entdecken/story-pink-again-nomol/">
                    <figure>
                        <figcaption>
                            <strong>pretitle</strong>
                            <h3>title</h3>
                            <span>beitrag lesen<a-icon-mdx icon-name="ArrowRight" size="1em"
                                    no-hover></a-icon-mdx></span>
                        </figcaption> <a-picture picture-load namespace="picture-teaser-"
                            defaultSource="https://www.klubschule.ch/-/media/Images/Slider/Kreativitaet/Intensivklassen-Schreiben-2024-960x480.ashx?gzip=true&hash=A56E1E24ABBD29CF26BE14EE07240780E586748A"
                            aspect-ratio="0.5625" alt="Aspectratio (1)"></a-picture>
                    </figure>
                </ks-m-teaser>
            </section>
            <div>
                <nav>
                    <a href="#previous" aria-label="previous slide">
                        <ks-a-button icon namespace="button-primary-" color="tertiary"><a-icon-mdx icon-name="ArrowLeft" size="1em"></a-icon-mdx></ks-a-button>
                    </a>
                    <a href="#next" aria-label="next slide">
                        <ks-a-button icon namespace="button-primary-" color="tertiary"><a-icon-mdx icon-name="ArrowRight" size="1em"></a-icon-mdx></ks-a-button>
                    </a>
                </nav>
            </div>
        </m-carousel-two>
    </ks-o-body-section>
    <!-- /CMS Teaser Slider -->

<!-- /CMS Contentbereich 2 -->
</ks-o-body-section>
`
