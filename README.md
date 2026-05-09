# Nara - Mongolian AI Assistant

A high-performance, dark-themed Mongolian voice assistant for navigation and information, built with Next.js, Gemini AI, and Leaflet maps.

## Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Clone and Install
```bash
# Clone the repository (or copy the files)
cd nara-ai-assistant

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY="your_api_key_here"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## VSCode Features
This project includes pre-configured VSCode settings:
- **Launch Configurations**: Debug the Next.js frontend or backend directly from the "Run and Debug" side menu.
- **Auto-linting**: Configured to work with the ESLint extension.

## Technologies Used
- **Next.js**: Framework for the UI and routing.
- **Google Gemini API**: Powering the Mongolian language understanding and responses.
- **Leaflet & CartoDB Dark Matter**: For the interactive dark-themed map.
- **Motion**: For smooth UI transitions and animations.
- **Web Speech API**: For voice recognition (mn-MN) and text-to-speech.
# bagiiin-tusul
