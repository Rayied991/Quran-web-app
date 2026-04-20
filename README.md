# Quran Web App

A modern, responsive web application for reading the Holy Quran with translations, built with Next.js and Tailwind CSS.

![Quran Web App](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)

## Features

- 📖 **Surah List** - Browse all 114 chapters of the Holy Quran
- 🌐 **Bilingual Display** - Arabic text with English transliteration and translation
- 🔍 **Search Functionality** - Search ayahs by translation text
- ⚙️ **Settings Panel** - Customize your reading experience:
  - Arabic font selection (4 font options)
  - Adjustable Arabic font size
  - Adjustable translation font size
- 💾 **Persistent Settings** - Your preferences are saved automatically
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **UI Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Data Source**: [quran-json](https://github.com/risan/quran-json) via jsDelivr CDN

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd quran-web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
quran-web-app/
├── app/
│   ├── components/
│   │   ├── SurahList.tsx          # List of all 114 surahs
│   │   ├── AyatView.tsx           # Display verses with Arabic + translation
│   │   ├── SearchBar.tsx          # Search functionality
│   │   ├── SettingsPanel.tsx      # Sidebar settings panel
│   │   └── SettingsPanelWrapper.tsx
│   ├── lib/
│   │   ├── quran.ts               # Fetch Quran data from CDN
│   │   ├── settings.ts            # localStorage persistence
│   │   └── settings-context.tsx   # React Context for settings
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── [surah]/
│   │   ├── page.tsx               # Dynamic route for surah details
│   │   └── SurahPageContent.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Home - Surah list
├── public/
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Data Source

Quran data is fetched from:
```
https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json
```

This includes:
- Uthmani Quran text from the Noble Qur'an Encyclopedia
- Transliteration from Tanzil.net
- English translation

## License

This project is for educational purposes. The Quran text and translations are from open-source sources.

---

Built with ❤️ using Next.js and Tailwind CSS