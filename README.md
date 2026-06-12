# Bhavani Shankar – Developer Portfolio

A highly theatrical, cinematic developer portfolio built with React, Vite, and Tailwind CSS. The design focuses on a premium editorial aesthetic, featuring fluid animations, webGL shaders, and a custom interactive timeline.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

## ✨ Key Features

- **Cinematic Entry Sequence:** A fully choreographed intro state machine featuring a suspenseful blackout and staggered typography reveals.
- **WebGL Background Shader:** A custom interactive WebGL fluid/aurora shader that reacts beautifully beneath the UI.
- **Editorial Typography:** High-contrast layout utilizing custom typography to create a "magazine cover" brutalist aesthetic.
- **Interactive Scroll Timeline:** A custom dashed scroll line that tracks scroll progress through the sections.

## 📂 Architecture & Content

- **`/src/components/`**: Houses all modular UI sections (`HeroSection`, `SkillsSection`, etc.) and visual logic.
- **`/src/data.ts`**: The central content hub. All text, bio details, projects, and skills are pulled from this file, separating the data layer from the UI presentation layer.
