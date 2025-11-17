# Video Component - WCAG 2.2 AA Konform

## Für CMS-Entwickler: Accessibility-Guidelines

### Korrekte Implementierung (WCAG 2.2 AA)

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

### Checkliste für CMS-Integration

#### Pflichtfelder

- **`title`-Attribut**: Aussagekräftige Beschreibung des Videos (nicht leer!)
- **`aria-label`**: Kurze Beschreibung für Screenreader
- **`aria-describedby`**: Verknüpfung zur detaillierten Beschreibung
- **Einzigartige ID**: Für `video-description-[ID]` verwenden

#### Accessibility-Features

- **`role="region"`**: Semantische Struktur für Assistive Technologien
- **`tabindex="0"`**: Keyboard-Navigation ermöglichen
- **`loading="lazy"`**: Performance-Optimierung
- **`.sr-only` Beschreibung**: Versteckte aber zugängliche Informationen

#### Vermeide

- Leere `title`-Attribute (`title=""`)
- Veraltete `frameborder`-Attribute
- Fehlende oder unklare Beschreibungen

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

### WCAG 2.2 Erfüllte Kriterien

- **2.4.2 Page Titled**: Aussagekräftige Titel
- **1.3.1 Info and Relationships**: Semantische Struktur
- **2.1.1 Keyboard**: Tastaturzugänglichkeit
- **4.1.2 Name, Role, Value**: Korrekte Accessibility-Attribute

### Live Demo

[Demo ansehen](http://localhost:3000/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/generator/https---dev-klubschule-ch-kurs-1001-nacht-orientalische-kuche--D_97351_1013_306.html)

---

**Wichtig**: Diese Guidelines sicherstellen, dass alle Videos WCAG 2.2 AA konform sind und für alle Nutzer zugänglich bleiben.

---

## Video-Transkription mit Azure Speech Service

### Azure Speech Service Integration

Für WCAG 2.2 AA Konformität müssen Videos mit Transkripten versehen werden. Hier eine mögliche Implementierung mit Azure Cognitive Services:

#### Setup Azure Speech Service

```javascript
// config/azure-speech.js
const AZURE_CONFIG = {
  subscriptionKey: process.env.AZURE_SPEECH_SUBSCRIPTION_KEY,
  serviceRegion: 'westeurope', // oder 'switzerlandnorth'
  endpoint: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken'
};
```

#### Transkription Service

```javascript
// services/transcription-service.js
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

class VideoTranscriptionService {
  constructor() {
    this.speechConfig = SpeechConfig.fromSubscription(
      AZURE_CONFIG.subscriptionKey, 
      AZURE_CONFIG.serviceRegion
    );
    this.speechConfig.speechRecognitionLanguage = "de-CH"; // Schweizerdeutsch
  }

  /**
   * Transkribiert Audio von Video-URL
   * @param {string} videoUrl - URL des Videos (Vimeo/YouTube)
   * @param {string} videoId - Eindeutige Video-ID
   * @returns {Promise<Object>} Transkript mit Zeitstempel
   */
  async transcribeVideo(videoUrl, videoId) {
    try {
      // 1. Audio aus Video extrahieren
      const audioUrl = await this.extractAudioFromVideo(videoUrl);
      
      // 2. Azure Speech Recognition
      const audioConfig = AudioConfig.fromWavFileInput(audioUrl);
      const recognizer = new SpeechRecognizer(this.speechConfig, audioConfig);
      
      return new Promise((resolve, reject) => {
        const transcript = [];
        
        recognizer.recognized = (s, e) => {
          if (e.result.text) {
            transcript.push({
              text: e.result.text,
              timestamp: e.result.offset / 10000000, // Convert to seconds
              duration: e.result.duration / 10000000,
              confidence: e.result.confidence
            });
          }
        };

        recognizer.sessionStopped = () => {
          recognizer.close();
          resolve({
            videoId,
            transcript,
            language: 'de-CH',
            generatedAt: new Date().toISOString()
          });
        };

        recognizer.startContinuousRecognitionAsync();
      });
    } catch (error) {
      console.error('Transcription failed:', error);
      throw error;
    }
  }

  /**
   * Audio-Extraktion aus Video
   * @param {string} videoUrl 
   * @returns {Promise<string>} Audio URL
   */
  async extractAudioFromVideo(videoUrl) {
    // Implementierung je nach Video-Provider (Vimeo/YouTube API)
    // Hier vereinfachtes Beispiel
    if (videoUrl.includes('vimeo.com')) {
      return this.getVimeoAudioUrl(videoUrl);
    }
    if (videoUrl.includes('youtube.com')) {
      return this.getYouTubeAudioUrl(videoUrl);
    }
    throw new Error('Unsupported video provider');
  }
}
```

#### CMS Integration

```javascript
// cms/video-transcript-integration.js
class CMSVideoTranscript {
  constructor(transcriptionService) {
    this.transcriptionService = transcriptionService;
  }

  /**
   * Fügt Transkript zu Video-Komponente hinzu
   * @param {string} videoId - Video ID
   * @param {Object} transcript - Transkript-Daten
   */
  async addTranscriptToVideo(videoId, transcript) {
    const transcriptHTML = this.generateTranscriptHTML(transcript);
    
    // In CMS/Database speichern
    await this.saveTranscript(videoId, transcript);
    
    // HTML-Template erweitern
    return this.enhanceVideoHTML(videoId, transcriptHTML);
  }

  /**
   * Generiert HTML für Transkript
   */
  generateTranscriptHTML(transcript) {
    const transcriptItems = transcript.transcript.map(item => 
      /* html */`<p data-timestamp="${item.timestamp}">
         <span class="timestamp">[${this.formatTime(item.timestamp)}]</span>
         ${item.text}
       </p>`
    ).join('');

    return /* html */`
      <details class="video-transcript">
        <summary>Video-Transkript anzeigen</summary>
        <div class="transcript-content">
          <h3>Automatisch generiertes Transkript</h3>
          <div class="transcript-text">
            ${transcriptItems}
          </div>
          <p class="transcript-note">
            <small>Automatisch erstellt mit Azure Speech Service. 
            Bei Fehlern kontaktieren Sie das Content-Team.</small>
          </p>
        </div>
      </details>
    `;
  }

  /**
   * Erweitert Video-HTML mit Transkript
   */
  enhanceVideoHTML(videoId, transcriptHTML) {
    return /* html */`
      <ks-m-figure>
        <ks-a-video namespace="video-default-" role="region" aria-label="Video mit Transkript">
          <!-- Video iframe hier -->
        </ks-a-video>
        ${transcriptHTML}
      </ks-m-figure>
    `;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
```

#### CSS für Transkript-Anzeige

```css
/* Transkript Styling */
.video-transcript {
  margin-top: var(--mdx-sys-spacing-fix-s);
  border: 1px solid var(--mdx-sys-color-neutral-subtle2);
  border-radius: var(--mdx-sys-border-radius-small);
}

.video-transcript summary {
  padding: var(--mdx-sys-spacing-fix-s);
  cursor: pointer;
  background: var(--mdx-sys-color-neutral-subtle1);
  font-weight: 500;
}

.transcript-content {
  padding: var(--mdx-sys-spacing-fix-s);
  max-height: 400px;
  overflow-y: auto;
}

.transcript-text p {
  margin-bottom: var(--mdx-sys-spacing-fix-xs);
  line-height: 1.5;
}

.timestamp {
  color: var(--mdx-sys-color-neutral-default);
  font-family: monospace;
  font-size: 0.875em;
  margin-right: var(--mdx-sys-spacing-fix-xs);
}

.transcript-note {
  margin-top: var(--mdx-sys-spacing-fix-s);
  padding-top: var(--mdx-sys-spacing-fix-s);
  border-top: 1px solid var(--mdx-sys-color-neutral-subtle2);
  color: var(--mdx-sys-color-neutral-default);
}
```

#### Workflow für Content-Team

```javascript
// tools/transcript-workflow.js
class TranscriptWorkflow {
  /**
   * Vollständiger Workflow für neues Video
   */
  async processNewVideo(videoUrl, videoMetadata) {
    console.log(`Processing video: ${videoMetadata.title}`);
    
    // 1. Automatische Transkription
    const transcript = await this.transcriptionService.transcribeVideo(
      videoUrl, 
      videoMetadata.id
    );
    
    // 2. Content-Team benachrichtigen für Review
    await this.notifyContentTeam(videoMetadata, transcript);
    
    // 3. Transkript in CMS integrieren
    await this.cmsIntegration.addTranscriptToVideo(
      videoMetadata.id, 
      transcript
    );
    
    // 4. WCAG-Compliance prüfen
    const complianceCheck = await this.validateWCAGCompliance(videoMetadata.id);
    
    return {
      videoId: videoMetadata.id,
      transcriptGenerated: true,
      wcagCompliant: complianceCheck.isCompliant,
      reviewRequired: transcript.confidence < 0.8 // Low confidence needs review
    };
  }
}
```

#### Kostenschätzung

- **Azure Speech Service**: ~€0.85 pro Audio-Stunde
- **Video < 5 Min**: ~€0.07 pro Video  
- **Video 5-15 Min**: ~€0.21 pro Video
- **Monatlich 100 Videos**: ~€21/Monat

#### Implementierungsschritte

1. **Azure Speech Service** Account einrichten
2. **Audio-Extraktion** von Vimeo/YouTube implementieren  
3. **CMS-Integration** für Transkript-Speicherung
4. **Content-Workflow** für Qualitätskontrolle
5. **Frontend-Templates** erweitern

---

Diese Lösung bietet **automatische Transkription** mit **manueller Qualitätskontrolle** und erfüllt die **WCAG 2.2 AA Anforderungen** für Video-Accessibility.
