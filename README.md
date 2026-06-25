<h1 align="center">
  <br>
  ✨ AuraHabit
  <br>
</h1>

<h4 align="center">A premium, client-side habit tracker built with pure HTML, CSS & JavaScript.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/license-ISC-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/built%20with-Vanilla%20JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="Built with JS">
  <img src="https://img.shields.io/badge/no%20backend-client--side%20only-success?style=for-the-badge" alt="Client-side only">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-license">License</a>
</p>

---

## 🚀 About the Project

**AuraHabit** is a beautifully designed, fully client-side habit tracking web application. Built with zero frameworks and zero backend dependencies, it runs entirely in the browser using `localStorage` for persistent data. It features a glassmorphism-inspired dark/light UI, rich analytics, a gamified badge system, and a fully responsive layout for both desktop and mobile.

> Track. Improve. Succeed.

---

## ✨ Features

### 🔐 Authentication (Client-Side)
- **Sign Up / Login / Forgot Password** — multi-screen auth flow with form validation
- Per-user data isolation via `localStorage`
- Optional **mock data pre-population** on sign-up to explore the app immediately

### 📋 Habit Management
- **Create, Edit & Delete** habits with full detail control
- Set a **name**, **description**, **category**, **time of day**, and **frequency** (specific days of the week)
- Categories: Health 💪, Mind 🧠, Work 💼, Finance 💵, Social 🤝, Custom ⭐

### 🏠 Dashboard
- **Radial progress ring** showing today's completion percentage
- **Current streak** counter with animated flame icon
- **Weekly completion rate** at a glance
- Filter habits by time of day: All / Morning / Afternoon / Evening
- Mark any habit as complete with a single click

### 📊 Performance Analytics
- **Weekly Completions** bar chart (Chart.js)
- **Category Distribution** doughnut chart (Chart.js)
- **Habit Standings** table with per-habit streak, total completions, and a progress bar
- Stats overview: total completions, longest streak, monthly %, and badge count

### 🏆 Achievements & Badges
- **8 unique SVG badges** to unlock based on real milestones
- Animated **celebration modal** with confetti when a badge is earned
- Progress bar showing your badge collection status
- Badge alert count shown in the sidebar nav

### 📆 Habit Details Page
- Full **interactive calendar** showing monthly completion history
- Stats: current streak, longest streak, total done, completion rate
- Per-day status: Completed ✅ / Incomplete / Rest Day

### ⚙️ Settings
- **Profile editing** — update display name and choose an avatar accent color
- **Password change** (stored securely in localStorage)
- Toggle **Dark / Light mode** — preference persisted across sessions
- System notifications toggle

### 🎨 Design
- **Dark & Light themes** with smooth CSS variable transitions
- **Glassmorphism UI**, gradient accents, and vibrant color palette
- **Fully responsive** — sidebar on desktop, bottom nav bar on mobile
- Micro-animations and hover effects throughout
- Inter & Outfit typefaces via Google Fonts

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** (Vanilla) | Full design system — variables, grid, flex, animations |
| **JavaScript** (Vanilla ES6+) | All app logic, routing, state, and data management |
| **Chart.js** | Bar and doughnut analytics charts |
| **Lucide Icons** | Icon set via CDN |
| **Google Fonts** | Inter & Outfit typefaces |
| **localStorage** | Client-side persistence (multi-user support) |

> ⚠️ **No build step required.** No React, no Node.js, no backend. Just open `index.html`.

---

## 📁 Project Structure

```
habit-tracker/
│
├── index.html        # Full app markup — auth screens, all views, modals
├── styles.css        # Complete design system — themes, components, layouts
├── app.js            # All application logic — state, routing, CRUD, charts
└── package.json      # Optional dev server config (http-server)
```

The app is structured as a **Single Page Application (SPA)** using CSS `hidden` class toggling for view routing — no framework needed.

---

## 🏁 Getting Started

### Option 1 — Open directly (zero setup)

Just double-click `index.html` or drag it into any modern browser. That's it.

### Option 2 — Local dev server (recommended)

Requires [Node.js](https://nodejs.org/) installed.

```bash
# Clone the repository
git clone https://github.com/your-username/aurahabit.git

# Navigate into the project folder
cd aurahabit

# Start the local server on port 3000
npm run dev
```

Then open your browser at **http://localhost:3000**

### First Run

1. Click **"Create one now"** to sign up
2. ✅ Check **"Prepopulate with mock habits"** to instantly see the app with demo data
3. Explore the Dashboard, Analytics, and Achievements pages

---

## 🗂 Data Storage

All data is stored in **`localStorage`** under namespaced keys per user account. This means:

- ✅ Data persists across browser sessions
- ✅ Multiple user accounts supported on the same browser
- ❌ Data is local to the device/browser (not synced to a server)
- ❌ Clearing browser storage will erase all data

---

## 🏆 Badge Unlock Criteria

| Badge | Requirement |
|---|---|
| 🌱 First Step | Complete your very first habit |
| 🔥 Consistency King | Maintain a 7-day streak |
| ⚡ Power Week | Complete all habits for 7 days in a row |
| 💎 Diamond Habit | Reach a 30-day streak on any habit |
| 🌟 Century Club | Log 100 total habit completions |
| 🎯 Perfect Day | Complete 100% of habits in a single day |
| 🦁 Habit Master | Unlock all other badges |
| 🚀 Early Adopter | Sign up and create your first habit |

---

## 🌗 Theme Support

AuraHabit ships with a **full dark/light theme system** using CSS custom properties. The theme is toggled via the sun/moon button in the header and persisted to `localStorage`.

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and ✨ — <strong>AuraHabit</strong>
</p>
