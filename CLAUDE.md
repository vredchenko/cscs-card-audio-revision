# CSCS Card Audio Revision - Project Summary

## Overview

A Progressive Web App (PWA) designed to help dyslexic individuals revise for the CSCS (Construction Skills Certification Scheme) certification exam. The app focuses on accessibility through text-to-speech functionality and a touch-friendly interface.

**CSCS Certification**: https://www.cscs.uk.com/

## Target Audience

- Dyslexic learners preparing for the CSCS certification exam
- Mobile-first users (primary platform: Android with Chrome)
- Users requiring audio-based learning support

## Technical Stack

- **Frontend**: React + TypeScript
- **Architecture**: Static PWA (no backend)
- **Deployment**: GitHub Pages or Cloudflare Pages
- **Text-to-Speech**: Chrome on Android Web Speech API
- **Build Output**: Static web bundle

## Core Features

### Accessibility-First Design
- **Display Modes**:
  - Normal mode (default)
  - Dyslexia-friendly mode (optional, user-selectable)
- **Text-to-Speech**:
  - Manual trigger by default
  - Auto-play mode available via app menu
  - Narration for questions and answers
- Touch-friendly UI optimized for mobile devices

### Learning Experience
- Randomized question presentation from JSON content
- Flexible multiple choice answer format (variable number of options)
- Continuous question flow
- Real-time score tracking (session-based)
- Immediate feedback with correct answers shown on incorrect responses

## Project Milestones

### Milestone 1: Generic Revision PWA Framework
Build a content-agnostic revision application that:
- Accepts structured JSON input for revision content
- Renders questions with flexible multiple choice answers (variable number of options)
- Implements text-to-speech using Chrome Web Speech API (manual trigger + auto-play mode)
- Provides touch-optimized answer selection
- Tracks and displays user scores (session-based)
- Shows correct answers when user answers incorrectly
- Randomizes question order for continuous revision flow
- Normal and dyslexia-friendly display modes

**JSON Structure Requirements**:
- Flexible question bank format
- Variable number of answer options per question
- Support for optional image content in questions
- Metadata (categories, topics, etc.)

### Milestone 2: CSCS Content Integration
Source and parse actual CSCS revision content:
- **Content Focus**: Health and safety on UK building sites
- Research existing online resources
- Potential web scraping of public content
- Reverse-engineering existing services/apps (where legally permissible)
- Handle questions with photo/image content
- Convert content into the JSON format defined in Milestone 1

### Milestone 3: Persistent Storage & Smart Revision
Implement persistent progress tracking and intelligent question selection:
- Use localStorage or PWA APIs for cross-session storage
- Track historical scores and answer accuracy
- Identify weak areas based on previous performance
- Prioritize questions user has answered incorrectly
- Session history and progress analytics
- Optional: Spaced repetition algorithm for optimal learning

## Deployment Strategy

- Static bundle deployment (no server-side logic)
- Host on GitHub Pages or Cloudflare Pages
- PWA manifest for "Add to Home Screen" functionality
- Service worker for offline capabilities (optional)

## Design Decisions (Confirmed)

### Content Structure
- ✓ Flexible number of answer choices per question
- ✓ Questions may include photos/images
- ✓ Content focus: Health and safety on UK building sites
- ✓ Continuous question flow (no fixed session length)

### Accessibility & UX
- ✓ Normal mode (default) + Dyslexia-friendly mode (optional)
- ✓ Manual trigger TTS (default) + Auto-play mode (in menu)
- ✓ Touch-optimized for mobile
- Font/color preferences to be determined in implementation

### Score & Progress Tracking
- ✓ Milestone 1: Session-based scoring
- ✓ Milestone 3: Persistent storage with smart revision
- ✓ Show correct answers on incorrect responses

### Browser & Device Support
- ✓ Primary: Chrome on Android
- Secondary browser support TBD

## Open Questions

### Dyslexia-Friendly Mode Specifics
- Font choice (OpenDyslexic, Comic Sans, Arial, etc.)
- Background color (beige/cream vs white)
- Text spacing and line height
- Color coding for answers

### Additional Features
- Should questions have explanations for correct answers?
- Question categorization/filtering by topic?
- Practice vs exam mode?
- Timed questions (exam simulation)?

### PWA Features
- Offline mode capability priority?
- Install prompts and home screen icon?
- Push notifications for study reminders?

### Content Licensing
- Legal considerations for CSCS content usage
- Official content vs. user-generated practice questions
- Attribution requirements

## Development Approach

1. **Phase 1**: Set up React/TypeScript project with PWA configuration
2. **Phase 2**: Implement core UI components (question display, answer selection)
3. **Phase 3**: Integrate Web Speech API for text-to-speech
4. **Phase 4**: Build scoring and feedback system
5. **Phase 5**: Create JSON schema and sample content
6. **Phase 6**: Test on Android Chrome
7. **Phase 7**: Source and integrate real CSCS content

## Success Criteria

- Fully functional offline-capable PWA
- Smooth text-to-speech experience on Android Chrome
- Intuitive touch interface requiring no instructions
- Accurate score tracking and feedback
- Comprehensive CSCS question bank
- Dyslexia-friendly design validated by target users

---

**Note**: This is a living document that will be updated as requirements are clarified and the project evolves.
