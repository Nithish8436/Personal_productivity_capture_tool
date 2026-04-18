# Curator - Frontend Architecture

The frontend of **Curator** is a modern, high-performance single-page application (SPA) built with **React** and **Vite**. It focuses on a premium "Nordic" aesthetic—clean lines, glassmorphism, and smooth micro-animations.

## 🛠 Core Technologies
- **React 18**: Component-based UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for custom, premium styling.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios**: Promised-based HTTP client for API communication.
- **React Router Dom**: Declarative routing for the Dashboard, Analytics, and Profile pages.

## 🎨 Design System (The "Nordic" Aesthetic)
The application uses a custom-curated color palette defined in `tailwind.config.js`:
- **Nordic Navy (`#0f172a`)**: Deep, professional base color.
- **Nordic Mint (`#00f5d4`)**: Vibrant accent for progress and primary actions.
- **Nordic Teal (`#00bfa5`)**: Stability and secondary focus.
- **Glassmorphism**: Extensive use of `backdrop-blur` and translucent white overlays (`bg-white/80`) to provide a layered, modern depth.

## 📦 Key Component Highlights
- **CaptureBox**: Features integrated **Web Speech API** for voice-to-task recognition.
- **TaskCard**: A high-density information display component with built-in state management for SMS toggling and task decomposition.
- **Calendar**: A custom-built date selection component integrated with task filtering.
- **AuthContext**: A global state provider using React Context API to manage user sessions and JWT persistence.

## 🚀 Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
