# Quran Web App

A modern Quran reading experience built with Next.js, TypeScript, Tailwind CSS, and Hono.

Read the full Quran with Arabic text, English translation, transliteration, audio playback, advanced search, and customizable settings — all with a clean, responsive UI inspired by QuranMazid.

---

## Features

**Reading**
- All 114 Surahs with Arabic text, English translation, and transliteration
- Right-aligned Arabic typography with adjustable font and size
- Surah metadata — Makkah/Madinah origin, verse count

**Audio**
- Per-ayah and full Surah playback
- Auto-advance to next ayah
- Seekable progress bar, pause/resume, current verse indicator

**Search**
- Search Arabic text, translation, or transliteration
- Keyboard navigation (↑↓ Enter Esc), loading state, empty state
- API-powered with 300ms debounce

**Customization**
- Multiple Arabic font options (Amiri Quran, Scheherazade New, Noto Naskh Arabic, and more)
- Adjustable Arabic and translation font sizes
- Dark / Light theme toggle
- All settings persisted via localStorage

**Performance**
- Static Site Generation (SSG) for all 114 Surahs
- Cached Quran data layer
- Next.js App Router with loading and error boundaries
- TypeScript throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |
| Backend | Hono + Node.js |
| State | React Context API |
| Data | quran-json |
| Audio | AlQuran Cloud API |

---

## Project Structure

```
quran-web-app/
├── app/
│   ├── api/
│   │   ├── search/route.ts
│   │   ├── surahs/route.ts
│   │   └── surah/[id]/route.ts
│   ├── components/
│   │   ├── AyatView.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── SurahList.tsx
│   │   ├── SurahSidebar.tsx
│   │   └── IconSidebar.tsx
│   ├── lib/
│   │   ├── quran.ts
│   │   ├── settings.ts
│   │   └── settings-context.tsx
│   ├── [surah]/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── layout.tsx
│   └── page.tsx
├── server/
│   ├── index.ts
│   └── server.ts
├── public/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## API Routes

```
GET /api/surahs          — list all 114 surahs
GET /api/surah/:id       — single surah with verses
GET /api/search?q=allah  — search ayahs
```

Hono backend (port 3001):
```
GET /                    — status
GET /health              — health check
```

---

## Getting Started

```bash
git clone https://github.com/Rayied991/Quran-web-app.git
cd quran-web-app
npm install
```

Run Next.js + Hono together:
```bash
npm run dev:all
```

Or separately:
```bash
npm run dev     # http://localhost:3000
npm run server  # http://localhost:3001
```

Production build:
```bash
npm run build
npm start
```

---

## 🔥 Key Features Implemented

- ✅ Next.js App Router
- ✅ Static Site Generation (SSG)
- ✅ Full Quran Reader
- ✅ Full Surah Audio Playback
- ✅ Arabic + English Search
- ✅ Dark Theme
- ✅ Responsive Design
- ✅ API Architecture
- ✅ Hono Backend
- ✅ Cached Quran Fetching
- ✅ Keyboard Search Navigation
- ✅ TypeScript Architecture
- ✅ Persistent User Settings

---

## Data Sources

- Quran text — [quran-json](https://github.com/risan/quran-json)
- Audio — [AlQuran Cloud API](https://alquran.cloud/api)

---

## ❤️ Acknowledgements

- QuranMazid inspiration
- quran-json
- AlQuran Cloud API
- Next.js
- Tailwind CSS

## License

Built for educational purposes. Quran text and translations are sourced from publicly available open-source datasets.