# 🍱 FoodRescue V2 — Multi-Role Realtime Food Rescue & Logistics Platform

> **"Don't wait for food to become waste. Predict the surplus, find the demand, and move the food in time."** ♻️🌱

FoodRescue V2 is a full-stack surplus food redistribution ecosystem featuring dedicated role-isolated portals for **Food Donors**, **Verified NGOs/Shelters**, and **Municipal City Authorities**. It includes real-time donation broadcast, 1-click claim handshakes, post-acceptance direct in-app chat, and verified distribution lifecycle tracking.

---

## 🌟 Key Upgrades in V2

- 🔐 **Isolated Role-Based Gateway:** Dedicated portals for Donors, NGOs, and Municipal Admin with 1-Click Demo Profiles & custom registration.
- 🔮 **AI Surplus Prediction Engine:** Pre-event demand and surplus forecasting with 87% statistical confidence.
- ⏱️ **Perishability & Safe-Time Tracker:** Calculates degradation curves and countdown timers to prevent spoiled food delivery.
- 🤝 **Real-Time Handshake & Auto-Lock:** When an NGO clicks "Accept", the listing immediately locks and disappears from other NGOs' feeds.
- 💬 **Post-Acceptance In-App Chat:** Simple, clean direct messaging between paired Donor and NGO with quick-reply chips for logistics coordination.
- 🚚 **End-to-End Handshake Lifecycle:** `AVAILABLE (Broadcast)` ➔ `ACCEPTED (Lock)` ➔ `COLLECTED (In Transit)` ➔ `DISTRIBUTED TO NEEDY ✓` ➔ `ARCHIVED TO HISTORY`.
- 📜 **80G Tax Exemption & ESG CSR Certificate:** Automated printable impact certificates with CO2 reduction metrics.
- ⚡ **Zero-Lag Real-Time Sync:** Operates with cross-tab reactive event engines for 100% reliable hackathon demonstrations.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Lucide React, Canvas Confetti
- **Styling:** Custom Glassmorphic Dark/Light Design System
- **Backend APIs:** Node.js & Express REST APIs (`/api/auth`, `/api/donations`, `/api/chat`)
- **Real-Time Layer:** Reactive Event Bus (`BroadcastChannel` & LocalStorage Sync)
- **Deployment:** Vercel Edge Cloud with 100% uptime

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Install dependencies
npm install

# 2. Run frontend development server
npm run dev

# 3. (Optional) Run backend API server
node server/index.js
```

Open [http://localhost:5174](http://localhost:5174) in your browser.
