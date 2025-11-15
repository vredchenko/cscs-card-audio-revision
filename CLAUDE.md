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
- Text-to-speech narration for questions and answers
- Touch-friendly UI optimized for mobile devices
- Dyslexia-friendly design considerations

### Learning Experience
- Randomized question presentation from JSON content
- Multiple choice answer format
- Real-time score tracking
- Immediate feedback with correct answers shown on incorrect responses
- Session-based progress tracking

## Project Milestones

### Milestone 1: Generic Revision PWA Framework
Build a content-agnostic revision application that:
- Accepts structured JSON input for revision content
- Renders questions with multiple choice answers
- Implements text-to-speech using Chrome Web Speech API
- Provides touch-optimized answer selection
- Tracks and displays user scores
- Shows correct answers when user answers incorrectly
- Randomizes question order for varied practice sessions

**JSON Structure** (to be defined):
- Question bank format
- Answer options structure
- Metadata (categories, difficulty, etc.)

### Milestone 2: CSCS Content Integration
Source and parse actual CSCS revision content:
- Research existing online resources
- Potential web scraping of public content
- Reverse-engineering existing services/apps (where legally permissible)
- Convert content into the JSON format defined in Milestone 1

## Deployment Strategy

- Static bundle deployment (no server-side logic)
- Host on GitHub Pages or Cloudflare Pages
- PWA manifest for "Add to Home Screen" functionality
- Service worker for offline capabilities (optional)

## Open Questions & Considerations

### Content Structure
- How many answer choices per question? (e.g., 4 options)
- Question categorization needed? (by topic/difficulty)
- Should questions have explanations for correct answers?

### Accessibility & UX
- Specific font preferences for dyslexia (e.g., OpenDyslexic, Comic Sans)?
- Color contrast requirements?
- Text size controls?
- Speed controls for text-to-speech?

### Score & Progress Tracking
- Session-based only or persistent storage (localStorage)?
- Progress analytics (questions attempted, accuracy rate)?
- Review mode for incorrectly answered questions?

### Browser & Device Support
- Chrome on Android (primary)
- iOS Safari support needed?
- Desktop browser support priority?
- Minimum Android/Chrome version?

### PWA Features
- Offline mode capability?
- Install prompts?
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
