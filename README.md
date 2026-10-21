# 🐍 Snake Arcade

Un'interpretazione moderna del classico gioco Snake, con estetica da sala giochi e supporto completo per desktop e mobile.

## ✨ Caratteristiche

### Gameplay
- **4 livelli di difficoltà**: Facile (17×17), Normale (19×19), Difficile (21×21), Estrema (23×23)
- **Sistema di punteggio**: 
  - Mela: +10 punti
  - Stella bonus: +50 punti (appare ogni 5 mele)
- **Accelerazione progressiva**: Il ritmo aumenta del 4% ogni 4 mele mangiate
- **Record personali**: Salvati in localStorage per ogni livello di difficoltà

### Controlli
**Desktop:**
- `↑↓←→` o `WASD`: Muovi il serpente
- `SPAZIO`: Pausa / Riprendi / Avvia
- `R` o `Invio`: Riavvia la partita
- `M`: Attiva/Disattiva audio
- `P`: Pausa

**Mobile:**
- Swipe sul tabellone per guidare il serpente
- D-pad touch con tasto centrale play/pausa
- Tap per iniziare/riprendere

### Effetti Visivi
- Movimento interpolato fluido
- Particelle esplosive quando mangi
- Screen-shake e flash rosso alla morte
- Occhi a X quando il serpente muore
- Animazioni di pulsazione per mela e stella
- Effetto CRT con scanline e vignettatura
- Lucciole animate sullo sfondo

### Audio
- Effetti sonori WebAudio sintetizzati (nessun file esterno)
- Suoni distinti per: avvio, pausa, ripresa, morte, mangiare, bonus
- Toggle audio persistente

## 🚀 Deploy

### Build di produzione
```bash
npm run build
```

I file compilati saranno nella cartella `dist/`:
- `dist/index.html` - Pagina principale
- `dist/assets/` - Asset ottimizzati (CSS, JS)

### Deploy su server statico
Copia il contenuto della cartella `dist/` sul tuo server web:
```bash
# Esempio con rsync
rsync -av dist/ user@server:/var/www/snake-arcade/
```

### Deploy su piattaforme
Il gioco è un'applicazione statica e può essere deployato su:
- **Netlify**: Trascina la cartella `dist/` o connetti il repository
- **Vercel**: Importa il repository, verrà rilevato automaticamente come Vite
- **GitHub Pages**: Configura il workflow per deploy dalla cartella `dist/`
- **Qualsiasi hosting statico**: Carica il contenuto di `dist/`

### Configurazione per sottodirectory
Se deployi in una sottodirectory (es. `example.com/games/snake/`), aggiungi in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/games/snake/',
  // ... resto della configurazione
})
```

## 📦 Struttura del progetto

```
snake-arcade/
├── src/
│   ├── game/
│   │   ├── types.ts          # Tipi e configurazioni
│   │   ├── useSnake.ts       # Hook principale del gioco
│   │   ├── render.ts         # Rendering canvas
│   │   └── audio.ts          # Sistema audio WebAudio
│   ├── components/
│   │   ├── icons.tsx         # Icone SVG
│   │   ├── Overlays.tsx      # Schermate di stato
│   │   ├── SidePanel.tsx     # Pannello desktop
│   │   ├── CompactHud.tsx    # HUD mobile
│   │   ├── TouchPad.tsx      # D-pad touch
│   │   └── DifficultyPicker.tsx # Selettore difficoltà
│   ├── App.tsx               # Componente principale
│   ├── main.tsx              # Entry point
│   └── index.css             # Stili globali
├── dist/                     # Build di produzione
├── index.html                # Template HTML
├── package.json              # Dipendenze
└── README.md                 # Questo file
```

## 🛠️ Sviluppo

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build di produzione
npm run build

# Verifica tipi TypeScript
npm run typecheck
```

## 📋 Requisiti

- Node.js 16+
- Browser moderni con supporto Canvas e WebAudio
- Supporto completo per:
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
  - iOS Safari 14+
  - Android Chrome 90+

## 🎨 Tecnologie

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-veloce
- **Tailwind CSS 4** - Styling
- **Canvas API** - Rendering gioco
- **WebAudio API** - Effetti sonori
- **localStorage** - Persistenza record

## 📝 Licenza

Questo progetto è fornito come-is per uso personale e commerciale.

## 🐛 Troubleshooting

**Il gioco non parte su mobile:**
- Assicurati di toccare direttamente il tabellone
- Alcuni browser richiedono un'interazione iniziale per abilitare l'audio

**I record non si salvano:**
- Verifica che i cookie/localStorage siano abilitati
- In modalità incognito i dati vengono persi alla chiusura

**Performance scarse:**
- Riduci la difficoltà per griglie più piccole
- Chiudi altre schede/app che consumano risorse

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Gennaio 2026
