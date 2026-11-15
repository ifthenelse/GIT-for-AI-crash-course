# Identità visiva implementata

Laboratorio chiaro e leggibile, superfici neutre e accento teal. Il tema scuro
conserva gli stessi ruoli, con accento più luminoso. I colori effettivi sono token
CSS in `apps/web/src/styles.css`; gli stati usano anche testo o simboli.

| Ruolo | Chiaro | Scuro |
| --- | --- | --- |
| Sfondo | #F9FBFA | #101C23 |
| Superficie | #FFFFFF | #17262F |
| Testo | #172D39 | #E2EDEA |
| Secondario | #526570 | #ADC1C5 |
| Azione | #087568 | #7CE3C3 |
| Link | #086257 | #96EBD3 |
| Superficie evidenziata | #E5F4EF | #203E39 |
| Bordo decorativo | #D9E3DF | #344B52 |
| Bordo controllo | #7C8D86 | #78959C |
| Focus | #8F4400 | #FFD28F |

Inter variabile serve titoli, testo didattico, navigazione, HUD e classifica.
JetBrains Mono serve terminale, file, comandi e identificativi. I WOFF2 sono
self-hosted con `font-display: swap`, fallback e licenze OFL distribuite. Provenienza,
dimensioni e SHA-256 in `apps/web/public/fonts/sources.json`.

Il pittogramma originale collega tre nodi con un percorso di branch/merge.
`logo.svg` e `logo-dark.svg` contengono path e cerchi vettoriali su sfondo
trasparente, senza raster incorporati. Il concept generativo ha orientato la
geometria; il file finale è SVG nativo. Il registry è `brand-assets.json`.

Derivati: favicon.svg, PNG 192/512 con trasparenza, social.svg/social.png e
social-it.svg/social-it.png da 1200×630. Le social card hanno fondo pieno adatto
alla condivisione; i loghi rimangono trasparenti. Il marchio viene usato nell'header
e nella home. La mock repository della hero è decorativa e separata dal laboratorio.

Contrasti e verifiche dei due temi sono nel [report di accessibilità](accessibility.md).
