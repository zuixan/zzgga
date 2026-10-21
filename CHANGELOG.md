# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it-IT/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.0.0] - 2026-01-15

### Aggiunto
- **Gameplay completo**:
  - Serpente con movimento interpolato fluido
  - Mela con effetti di pulsazione (+10 punti)
  - Stella bonus dorata ogni 5 mele (+50 punti) con timer visivo
  - Sistema di accelerazione progressiva (4% ogni 4 mele)
  - Rilevamento collisioni con muri e autoscontro
  - Vittoria quando il tabellone è completamente riempito

- **4 livelli di difficoltà**:
  - Facile: griglia 17×17, velocità rilassata
  - Normale: griglia 19×19, velocità classica
  - Difficile: griglia 21×21, velocità elevata
  - Estrema: griglia 23×23, velocità massima

- **Controlli**:
  - Tastiera desktop (frecce, WASD, SPAZIO, R, M, P)
  - Touch mobile (swipe sul tabellone)
  - D-pad virtuale per mobile
  - Pausa automatica al cambio scheda

- **Interfaccia**:
  - HUD completo con punteggio, record, lunghezza, mele
  - Pannello laterale per desktop con tutte le info
  - HUD compatto per mobile
  - Selettore difficoltà con persistenza
  - Schermate di stato (pronto, pausa, game over, vittoria)
  - Badge "NUOVO RECORD!" animato
  - Ticker arcade con suggerimenti

- **Effetti visivi**:
  - Particelle esplosive quando mangi
  - Screen-shake e flash rosso alla morte
  - Occhi a X quando il serpente muore
  - Lingua animata del serpente
  - Effetto CRT con scanline e vignettatura
  - Lucciole animate sullo sfondo
  - Cornice arcade con angoli decorativi
  - Animazioni di pulsazione e pop per i numeri

- **Audio**:
  - Effetti sonori WebAudio sintetizzati
  - Suoni per: avvio, pausa, ripresa, morte, mangiare, bonus
  - Toggle audio con persistenza
  - Nessun file audio esterno richiesto

- **Persistenza**:
  - Record salvati in localStorage per ogni difficoltà
  - Preferenza difficoltà persistente
  - Stato audio persistente

- **Responsive**:
  - Layout adattivo per desktop e mobile
  - Tabellone ridimensionabile con ResizeObserver
  - Supporto per dispositivi touch
  - Protezione anti-ghost click

- **Accessibilità**:
  - Meta tag completi
  - Label ARIA per i controlli
  - Supporto per screen reader
  - Contrasti elevati

### Tecnologie
- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Canvas API
- WebAudio API
- localStorage API

### Performance
- Build ottimizzato: ~177KB JS (56KB gzip), ~25KB CSS (6KB gzip)
- Rendering a 60fps con interpolazione
- Nessun asset esterno (tutto inline o generato)
- Lazy loading font da Google Fonts

### Compatibilità
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

---

## [0.1.0] - 2026-01-14

### Aggiunto
- Setup iniziale del progetto
- Configurazione Vite + React + TypeScript + Tailwind
- Struttura base del codice
- Prototipo del motore di gioco
- Primi test di rendering canvas
