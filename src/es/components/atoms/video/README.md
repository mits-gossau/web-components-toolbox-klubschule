# Video Component - WCAG 2.2 AA Konform

## Für CMS-Entwickler: Accessibility-Guidelines

### ✅ Korrekte Implementierung (WCAG 2.2 AA)

```html
<ks-a-video namespace="video-default-" role="region" aria-label="Video: [Beschreibender Titel]">
    <iframe src="[VIDEO_URL]"
            title="[Detaillierte Beschreibung des Videoinhalts]"
            width="560"
            height="315"
            style="border: none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            tabindex="0"
            aria-describedby="video-description-[UNIQUE_ID]">
    </iframe>
    <div id="video-description-[UNIQUE_ID]" class="sr-only">
        [Detaillierte Beschreibung des Videoinhalts für Screenreader]
    </div>
</ks-a-video>
```

### 📋 Checkliste für CMS-Integration

#### ✅ Pflichtfelder:

- **`title`-Attribut**: Aussagekräftige Beschreibung des Videos (nicht leer!)
- **`aria-label`**: Kurze Beschreibung für Screenreader
- **`aria-describedby`**: Verknüpfung zur detaillierten Beschreibung
- **Einzigartige ID**: Für `video-description-[ID]` verwenden

#### ✅ Accessibility-Features:

- **`role="region"`**: Semantische Struktur für Assistive Technologien
- **`tabindex="0"`**: Keyboard-Navigation ermöglichen
- **`loading="lazy"`**: Performance-Optimierung
- **`.sr-only` Beschreibung**: Versteckte aber zugängliche Informationen

#### ❌ Vermeide:

- Leere `title`-Attribute (`title=""`)
- Veraltete `frameborder`-Attribute
- Fehlende oder unklare Beschreibungen

### 🎯 Beispiel: Kochkurs-Video

```html
<ks-m-figure>
    <ks-a-video namespace="video-default-" role="region" aria-label="Video: Orientalische Küche - Kochkurs Impression">
        <iframe src="https://player.vimeo.com/video/1010117722?color=7a634d"
                title="Video: Orientalische Küche - Einblicke in den Kochkurs mit orientalischen Gewürzen und Zubereitungstechniken"
                width="560"
                height="315"
                style="border: none;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
                tabindex="0"
                aria-describedby="video-description-1010117722">
        </iframe>
        <div id="video-description-1010117722" class="sr-only">
            Dieses Video zeigt Impressionen aus unserem Kochkurs "1001 Nacht - Orientalische Küche", 
            in dem Sie die Zubereitung orientalischer Gerichte mit traditionellen Gewürzen und 
            Zubereitungstechniken erlernen können.
        </div>
    </ks-a-video>
    <figcaption class="sr-only">
        Kochkurs-Video: Orientalische Küche mit traditionellen Zubereitungsmethoden
    </figcaption>
</ks-m-figure>
```

### 🔧 CSS-Klasse für Screenreader

Stelle sicher, dass folgende CSS-Klasse verfügbar ist:

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

### 📖 WCAG 2.2 Erfüllte Kriterien

- **2.4.2 Page Titled**: Aussagekräftige Titel
- **1.3.1 Info and Relationships**: Semantische Struktur
- **2.1.1 Keyboard**: Tastaturzugänglichkeit
- **4.1.2 Name, Role, Value**: Korrekte Accessibility-Attribute

### 🎯 Live Demo

[Demo ansehen](http://localhost:3000/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/generator/https---dev-klubschule-ch-kurs-1001-nacht-orientalische-kuche--D_97351_1013_306.html)

---

**Wichtig**: Diese Guidelines sicherstellen, dass alle Videos WCAG 2.2 AA konform sind und für alle Nutzer zugänglich bleiben.
