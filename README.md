# CSCS Card Audio Revision

A Progressive Web App (PWA) for revising CSCS (Construction Skills Certification Scheme) certification exam with text-to-speech support, designed specifically for dyslexic learners.

## Features

- 🎯 **Flexible Multiple Choice**: Supports variable number of answer options
- 🔊 **Text-to-Speech**: Web Speech API integration with manual/auto-play modes
- ♿ **Accessibility**: Normal and dyslexia-friendly display modes
- 📱 **Touch-Optimized**: Mobile-first design for Android Chrome
- 📊 **Score Tracking**: Session-based scoring with immediate feedback
- 🎲 **Randomized Questions**: Continuous question flow for effective revision
- 🖼️ **Image Support**: Questions can include photos for visual content
- 📴 **Offline Support**: PWA capabilities for offline use

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Fast build tool
- **vite-plugin-pwa** - PWA support with Workbox
- **Web Speech API** - Text-to-speech functionality

## Project Structure

```
cscs-card-audio-revision/
├── public/
│   └── data/
│       ├── schema.json          # JSON schema for revision content
│       └── sample-data.json     # Sample CSCS questions
├── src/
│   ├── components/              # React components
│   ├── contexts/                # React contexts
│   │   └── AppContext.tsx       # App settings & session state
│   ├── hooks/                   # Custom hooks
│   │   └── useSpeech.ts         # Text-to-speech hook
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   └── contentLoader.ts     # Content loading & shuffling
│   └── styles/                  # Global styles
├── CLAUDE.md                    # Project documentation
└── vite.config.ts               # Vite + PWA configuration
```

## Getting Started

### Prerequisites

- Node.js 22+ and npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser (preferably Chrome on Android for full TTS support).

### Build

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to GitHub Pages or Cloudflare Pages.

### Preview Production Build

```bash
npm run preview
```

## Content Format

Revision content should follow the JSON schema in `public/data/schema.json`. Example:

```json
{
  "version": "1.0.0",
  "metadata": {
    "title": "CSCS Health & Safety Questions",
    "description": "Revision questions for CSCS certification"
  },
  "questions": [
    {
      "id": "q001",
      "question": "What is the main reason for wearing a hard hat?",
      "answers": [
        "To keep warm",
        "To protect from falling objects",
        "To look professional"
      ],
      "correctAnswerIndex": 1,
      "explanation": "Hard hats protect your head from falling objects",
      "category": "PPE"
    }
  ]
}
```

## Development Milestones

### ✅ Milestone 0: Project Setup
- [x] Define JSON schema
- [x] Generate sample CSCS content
- [x] Initialize React + TypeScript project
- [x] Configure PWA support
- [x] Set up project structure

### 🚧 Milestone 1: Generic Revision PWA Framework
- [ ] Build question display component
- [ ] Implement answer selection UI
- [ ] Integrate text-to-speech
- [ ] Add scoring and feedback system
- [ ] Create settings menu (display mode, TTS options)
- [ ] Implement continuous question flow
- [ ] Add dyslexia-friendly mode styles

### 📋 Milestone 2: CSCS Content Integration
- [ ] Research CSCS content sources
- [ ] Scrape/parse actual exam questions
- [ ] Handle image content in questions
- [ ] Convert to JSON format
- [ ] Build comprehensive question bank

### 🎯 Milestone 3: Persistent Storage & Smart Revision
- [ ] Implement localStorage/IndexedDB
- [ ] Track historical performance
- [ ] Identify weak areas
- [ ] Prioritize incorrectly answered questions
- [ ] Session history and analytics
- [ ] Optional: Spaced repetition algorithm

## Deployment

This is a static PWA with no backend. Deploy to:

- **GitHub Pages**: Push to `gh-pages` branch
- **Cloudflare Pages**: Connect repository and deploy

## License

See project documentation for content licensing considerations.

## Contributing

This project is designed to help dyslexic learners prepare for CSCS certification. Contributions welcome!