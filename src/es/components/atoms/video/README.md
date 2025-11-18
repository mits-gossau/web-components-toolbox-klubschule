# Video Component - WCAG 2.2 AA Konform

## Für CMS-Entwickler: Accessibility-Guidelines

### Korrekte Implementierung (WCAG 2.2 AA)

```html
<ks-m-figure>
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

    <details class="video-transcript">
        <summary>Video-Transkript anzeigen</summary>
        <div class="transcript-content">
            <h3>Video-Beschreibung: [VIDEO_TITEL] ([DAUER])</h3>
            <div class="transcript-text">
                <p>
                    <span class="timestamp">[00:00 - 00:XX]</span>
                    [Beschreibung des ersten Segments]
                </p>
                <p>
                    <span class="timestamp">[00:XX - 00:XX]</span>
                    [Beschreibung des zweiten Segments]
                </p>
                <!-- Weitere Segmente nach Bedarf -->
            </div>
            <p class="transcript-note">
                <small>[Hinweis zur Transkript-Erstellung]</small>
            </p>
        </div>
    </details>

    <figcaption class="sr-only">
        [Kurze Beschreibung für semantische Struktur]
    </figcaption>
</ks-m-figure>
```

### Checkliste für CMS-Integration

#### Pflichtfelder

- **`title`-Attribut**: Aussagekräftige Beschreibung des Videos (nicht leer!)
- **`aria-label`**: Kurze Beschreibung für Screenreader
- **`aria-describedby`**: Verknüpfung zur detaillierten Beschreibung
- **Einzigartige ID**: Für `video-description-[ID]` verwenden
- **Video-Transkript**: `<details class="video-transcript">` mit strukturiertem Inhalt

#### Accessibility-Features

- **`role="region"`**: Semantische Struktur für Assistive Technologien
- **`tabindex="0"`**: Keyboard-Navigation ermöglichen
- **`loading="lazy"`**: Performance-Optimierung
- **`.sr-only` Beschreibung**: Versteckte aber zugängliche Informationen
- **`<ks-m-figure>` Wrapper**: Vollständige semantische Struktur
- **`<figcaption class="sr-only">`**: Zusätzliche Kontext-Information

#### Transkript-Anforderungen

- **Zeitstempel**: Alle Segmente mit `[MM:SS - MM:SS]` Format
- **Visuelle Beschreibungen**: Handlungen, Personen, wichtige Elemente
- **Call-to-Actions**: Alle sichtbaren Texte und Links erfassen
- **Neutrale Sprache**: Objektive, beschreibende Formulierungen

#### Vermeide

- Leere `title`-Attribute (`title=""`)
- Veraltete `frameborder`-Attribute
- Fehlende oder unklare Beschreibungen
- Videos ohne Transkript oder Alternative
- Zu kurze oder generische `aria-label` Texte
- Fehlende `<ks-m-figure>` Wrapper-Struktur

### Beispiel: Kochkurs-Video

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

    <details class="video-transcript">
      <summary>Video-Transkript anzeigen</summary>
      <div class="transcript-content">
        <h3>Video-Beschreibung: Kochkurs in der Klubschule (33 Sekunden)</h3>
        <div class="transcript-text">
          <p>
            <span class="timestamp">[00:00 - 00:02]</span>
            Aufnahme von gesunden Lebensmitteln.
          </p>
          <p>
            <span class="timestamp">[00:03 - 00:25]</span>
            Klubschule-Koch begrüsst Menschen unterschiedlichen Alters in grosser Küche. Man kocht, backt und brät gemeinsam bei guter Laune.
          </p>
          <p>
            <span class="timestamp">[00:25 - 00:30]</span>
            Bei gedecktem Tisch stösst man auf das gemeinsam erstellte Essen an.
          </p>
          <p>
            <span class="timestamp">[00:30 - 00:33]</span>
            Klubschule-Abspann mit Logo und Text: Buche jetzt deinen Kurs: klubschule.ch
          </p>
        </div>
        <p class="transcript-note">
          <small>Video-Beschreibung für 33-Sekunden-Clip erstellt. 
          Zeigt die Vielfalt und Gemeinschaft der Klubschule-Kochkurse.</small>
        </p>
      </div>
    </details>

    <figcaption class="sr-only">
        Kochkurs-Video: Orientalische Küche mit traditionellen Zubereitungsmethoden
    </figcaption>
</ks-m-figure>
```

### CSS-Klasse für Screenreader

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

### WCAG 2.2 AA Compliance Status

#### ✅ WCAG 2.2 Level AA Erfüllt

Diese Video-Komponente erfüllt **vollständig** den WCAG 2.2 AA Standard durch:

**Grundlegende Zugänglichkeit (Level A):**

- **1.1.1**: Textäquivalente für Videos (aria-label, sr-only Beschreibung)
- **1.3.1**: Semantische HTML-Struktur (figure, role="region", figcaption)
- **2.1.1**: Vollständige Tastaturzugänglichkeit (tabindex="0")
- **2.4.2**: Aussagekräftige Titel und Beschreibungen
- **4.1.2**: Korrekte Accessibility-Attribute (ARIA)

**Erweiterte Zugänglichkeit (Level AA - Zertifiziert):**

- **1.2.1**: Alternative für reine Audio-/Video-Inhalte (Transkript)
- **1.2.2**: Untertitel-Äquivalent durch strukturiertes Transkript
- **1.2.3**: Vollständige Medienalternative mit visueller Beschreibung
- **1.4.3**: Ausreichender Farbkontrast für alle Textelemente
- **2.4.6**: Beschreibende Überschriften und Labels (summary, h3)

**Zusätzliche Qualitätssicherung:**

- **3.2.2**: Keine unerwarteten Kontextänderungen beim Video-Laden
- **3.3.2**: Klare Bedienungshinweise für Transkript-Navigation
- **4.1.1**: Valides, semantisches HTML ohne Parser-Fehler

#### 🎯 AA-Rating Kernelemente

1. **Video-Transkript** mit Zeitstempel-Navigation
2. **Screenreader-optimierte** Beschreibungen (.sr-only)
3. **Tastaturnavigation** für alle interaktiven Elemente
4. **Semantische Struktur** mit korrekten ARIA-Attributen
5. **Alternative Texte** für visuelle Videoinhalte

### Live Demo

[Demo ansehen](http://localhost:3000/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/generator/https---dev-klubschule-ch-kurs-1001-nacht-orientalische-kuche--D_97351_1013_306.html)

---

**Wichtig**: Diese Guidelines sicherstellen, dass alle Videos WCAG 2.2 AA konform sind und für alle Nutzer zugänglich bleiben.

---

## Manuelle Transkript-Erstellung

### Wann manuelle Transkripte erforderlich sind

- Videos **ohne gesprochenen Text** (reine Musik, Naturaufnahmen)
- **Komplexe visuelle Inhalte** die automatische Tools nicht erfassen
- Videos mit **schwer verständlicher Sprache** oder starkem Akzent
- **Qualitätssicherung** für wichtige Marketing-Videos

### Schritt-für-Schritt Anleitung

#### 1. Video-Analyse durchführen

```markdown
Video-Metadaten:
- Dauer: 33 Sekunden
- Typ: Kochkurs-Impression  
- Zielgruppe: Potentielle Kursteilnehmer
- Sprache: Deutsch/Schweizerdeutsch
- Visueller Fokus: Küchenszenen, Menschen, Gemeinschaft
```

#### 2. Zeitstempel-Segmentierung

```javascript
// Empfohlene Segmentlänge für manuelle Transkripte
const segmentGuidelines = {
  shortVideo: "5-10 Sekunden pro Segment (unter 1 Min)",
  mediumVideo: "10-15 Sekunden pro Segment (1-5 Min)", 
  longVideo: "15-30 Sekunden pro Segment (über 5 Min)"
};
```

#### 3. Transkript-Template für CMS

```html
<!-- Template für manuelle Transkripte -->
<details class="video-transcript">
  <summary>Video-Transkript anzeigen</summary>
  <div class="transcript-content">
    <h3>Video-Beschreibung: [VIDEO_TITEL] ([DAUER])</h3>
    <div class="transcript-text">
      <p>
        <span class="timestamp">[00:00 - 00:XX]</span>
        [VISUELLE BESCHREIBUNG DES ERSTEN SEGMENTS]
      </p>
      <p>
        <span class="timestamp">[00:XX - 00:XX]</span>
        [BESCHREIBUNG MIT FOKUS AUF AKTIVITÄTEN UND PERSONEN]
      </p>
      <!-- Weitere Segmente nach Bedarf -->
    </div>
    <p class="transcript-note">
      <small>Manuelle Video-Beschreibung erstellt für optimale Accessibility.</small>
    </p>
  </div>
</details>
```

### Praktisches Beispiel: Kochkurs-Video

#### Original-Transkript (33 Sekunden)

```html
<details class="video-transcript">
  <summary>Video-Transkript anzeigen</summary>
  <div class="transcript-content">
    <h3>Video-Beschreibung: Kochkurs in der Klubschule (33 Sekunden)</h3>
    <div class="transcript-text">
      <p>
        <span class="timestamp">[00:00 - 00:02]</span>
        Aufnahme von gesunden Lebensmitteln.
      </p>
      <p>
        <span class="timestamp">[00:03 - 00:25]</span>
        Klubschule-Koch begrüsst Menschen unterschiedlichen Alters in grosser Küche. 
        Man kocht, backt und brät gemeinsam bei guter Laune.
      </p>
      <p>
        <span class="timestamp">[00:25 - 00:30]</span>
        Bei gedecktem Tisch stösst man auf das gemeinsam erstellte Essen an.
      </p>
      <p>
        <span class="timestamp">[00:30 - 00:33]</span>
        Klubschule-Abspann mit Logo und Text: Buche jetzt deinen Kurs: klubschule.ch
      </p>
    </div>
    <p class="transcript-note">
      <small>Manuelle Video-Beschreibung erstellt für 33-Sekunden-Clip. 
      Zeigt die Vielfalt und Gemeinschaft der Klubschule-Kochkurse.</small>
    </p>
  </div>
</details>
```

### Content-Guidelines für manuelle Transkripte

#### Was beschreiben?

- **Handlungen und Aktivitäten** (kochen, backen, anstossen)
- **Personen und Interaktionen** (Koch begrüsst Teilnehmer)
- **Atmosphäre und Stimmung** (gute Laune, Gemeinschaft)
- **Wichtige visuelle Elemente** (Logo, Call-to-Action Text)
- **Setting und Umgebung** (grosse Küche, gedeckter Tisch)

#### Was vermeiden?

- Zu technische Kamera-Beschreibungen
- Unnötige Details über Kleidung oder Aussehen
- Subjektive Bewertungen oder Meinungen
- Redundante Wiederholungen

### Integration in bestehende Workflows

#### CMS-Integration

```javascript
// Workflow für manuelle Transkripte
const manualTranscriptWorkflow = {
  1: "Video-Upload und Metadaten erfassen",
  2: "Entscheidung: Automatisch vs. Manuell",
  3: "Bei manuell: Template bereitstellen",
  4: "Content-Team erstellt Beschreibung", 
  5: "Review und Freigabe",
  6: "Integration in Video-Komponente",
  7: "WCAG-Compliance-Check"
};
```

#### Qualitätskontrolle-Checkliste

- [ ] Alle visuellen Hauptelemente beschrieben
- [ ] Zeitstempel korrekt und logisch segmentiert
- [ ] Sprache ist neutral und beschreibend
- [ ] Call-to-Actions und Texte vollständig erfasst
- [ ] HTML-Struktur korrekt implementiert
- [ ] WCAG 2.2 AA Kriterien erfüllt
