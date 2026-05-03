# EduNova AI - Modern Student Chat Application

A modern, responsive AI-powered educational chat application built with React, TypeScript, and Vite.

## Features

### 🤖 AI Chat Interface
- Real-time conversation with Nova AI assistant
- Clean, modern dark UI design
- Message timestamps and typing indicators
- Voice input with Web Speech API
- Image upload and emoji picker
- Friend list and teacher contacts

### 🎮 Quiz Arena
- **Two Game Modes**: Single Player and Multiplayer
- **Modern Mobile Responsive Design**: Optimized for all devices
- **Real-time Multiplayer**: Compete with friends in game rooms
- **Enhanced Scoring System**: Points, streaks, time bonuses, and coins
- **Live Leaderboard**: Track performance and compete globally
- **Fun UI Elements**: Animations, confetti, visual feedback
- **Timer System**: 20-second questions with visual countdown
- **Difficulty Levels**: Easy, Medium, Hard question sets
- **Categories**: Programming, Math, Science, Geography, etc.

### Key Quiz Features:
- **Single Player**: Practice mode with personal statistics
- **Multiplayer Rooms**: Create or join rooms for competitive play
- **Live Player Rankings**: See how you stack up during games
- **Streak Bonuses**: Extra points for consecutive correct answers
- **Time Bonuses**: Faster answers earn more points
- **Confetti Celebrations**: Special effects for achievements
- **Persistent Leaderboards**: Save and compare high scores

## Quiz Gameplay

### Scoring System
- **Base Points**: 10 points per correct answer
- **Time Bonus**: Up to 40 bonus points for quick answers (2 points × remaining seconds)
- **Streak Bonus**: 5 points × current streak multiplier
- **Total Formula**: Base + Time Bonus + Streak Bonus

### Multiplayer Flow
1. **Menu Selection**: Choose Single Player or Multiplayer
2. **Room Creation**: Create a new room or join existing one
3. **Waiting Room**: Players join and get ready
4. **Live Competition**: Answer questions in real-time
5. **Live Rankings**: See player standings during the game
6. **Final Results**: Compare scores and save to leaderboard

### Mobile Experience
- Touch-optimized interface
- Responsive design for all screen sizes
- Swipe gestures and mobile-friendly interactions
- Optimized performance on mobile devices

### 🎤 Voice Input
- Microphone integration using Web Speech API
- Voice-to-text conversion for hands-free chatting
- Visual recording indicator

### 📸 Image Upload
- Drag-and-drop image upload functionality
- Image preview before sending
- Support for various image formats

### 😊 Emoji Picker
- Full emoji picker with categories
- Quick emoji insertion in messages
- Modern emoji picker interface

### 👥 Social Features
- Friend list with online/offline status
- Teacher list for educational contacts
- Contact management interface

### 📱 Mobile Responsive
- Fully responsive design for all devices
- Touch-friendly interface
- Optimized mobile chat experience

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: CSS with dark theme
- **Icons**: Lucide React
- **Emoji Picker**: emoji-picker-react
- **Build Tool**: Vite
- **Speech Recognition**: Web Speech API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd edunova-ai
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ...
├── pages/              # Page components
│   ├── Chat.tsx        # Main chat interface
│   └── ...
├── styles/             # Styling and themes
│   └── theme.ts        # Color theme definitions
├── types/              # TypeScript type definitions
│   └── speech.d.ts     # Web Speech API types
└── context/            # React context providers
```

## Key Components

### Chat Interface (`Chat.tsx`)
- Main chat component with all features
- Handles voice input, image upload, and emoji picker
- Manages friend/teacher contact lists
- Fully responsive design

### Features Implementation

#### Voice Input
```typescript
// Uses Web Speech API for voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
```

#### Image Upload
```typescript
// File input with image preview
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>
```

#### Emoji Picker
```typescript
// Integrated emoji picker component
<EmojiPicker onEmojiClick={onEmojiClick} />
```

## Browser Support

- Chrome/Edge: Full support (Speech API, modern features)
- Firefox: Limited support (Speech API may not work)
- Safari: Limited support (Speech API may not work)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
