# ⌨️ Thock

A minimalist mechanical typing playground focused on satisfying keyboard sounds, responsive keypress animations, and a premium clean typing experience.

Designed to make writing feel like home.

---

## ✨ Features

* **🔊 Rich Mechanical Acoustics**: Premium, realistic mechanical keyboard sounds powered by the **Web Audio API** and a customizable sound pack engine.
* **🎹 2D Keyboard Visualization**: Responsive on-screen physical key visualizer reacting dynamically to your real keystrokes with smooth layout adjustments and **PWA** supports.
* **📈 Staggered Spring Stats & Count-Up**: fluid entrance spring animations and atomic number increments for WPM and Accuracy metrics powered by `motion` and `react-countup`.
* **☁️ Live Global Counter**: A real-time, global aggregate counter of total thocks typed by all users worldwide, powered by **Upstash Redis** (via HTTP serverless REST).
* **⚡ Ultra-Optimized Sync Engine**: Employs `@uidotdev/usehooks`'s `useDebounce` to batch local keypresses and flush incremental deltas only when paused. Idle background reads are **exactly zero**, making it 100% serverless-safe and completely free.
* **🖼️ HD Stats Card Exporter**: Export your typing metrics as a high-definition, retina-ready sharing image using `html-to-image`.
* **🛡️ Desktop-Only Blocker**: Immersive mobile/tablet blocker screen utilizing responsive CSS logic and a floating 3D keycap icon to keep the playground focused on desk-bound physical keyboards.
* **🎨 Premium Minimalist Aesthetic**: Stylized handwriting prompts, off-angle tilted badges, custom hand-drawn arrows, and beautiful clean typography.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router, Turbopack)
* **Core**: React 19 & TypeScript
* **Styling**: Tailwind CSS v4
* **Animations**: Motion (Framer Motion)
* **Audio**: Web Audio API
* **Database**: Upstash Redis (serverless key-value)
* **Libraries**:
  * `react-countup` (smooth metrics count)
  * `html-to-image` (retina card exports)
  * `@uidotdev/usehooks` (smart input debouncing)
  * `@tabler/icons-react` (minimal stroke icons)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of your project:

```env
# Upstash Redis serverless credentials
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Custom branding URL for stats card
NEXT_PUBLIC_APP_URL=thock.app
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience Thock locally.

---

## 📦 Production Deployment

To build a highly optimized production bundle:

```bash
npm run build
npm run start
```

This project compiles and type-checks successfully under Next.js Turbopack and is fully compatible with serverless Edge environments like **Vercel** or **Netlify**.

---

*Built with ❤️ by Lwant.*
