# AthleteIQ React App — Setup & Deployment Guide

## 🎯 Overview

This is a complete modular React application with three major sections:

1. **Super Admin Portal** (`/admin/portal`) — Global system administration
2. **Invite-to-Claim Workflow** (`/register?token=XYZ`) — Token-based player registration
3. **Player Portal** (`/player/dashboard`) — Player performance tracking & insights

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SuperAdmin/
│   │   ├── AdminPortal.jsx        (Main admin dashboard)
│   │   ├── SearchOmnibar.jsx       (Global search)
│   │   ├── MetricsPanel.jsx        (KPIs display)
│   │   └── OrgTable.jsx            (Organization master table)
│   ├── InviteToClaim/
│   │   └── RegisterWithToken.jsx   (Token validation + registration)
│   └── PlayerPortal/
│       ├── PlayerDashboard.jsx     (Main player dashboard)
│       ├── PlayerSidebar.jsx       (Navigation)
│       ├── PerformancePassport.jsx (Stats overview)
│       ├── FastLogForm.jsx         (Quick data entry)
│       ├── InsightsWidget.jsx      (LLM placeholder)
│       ├── Financials.jsx          (Payment tracking)
│       └── P2PPaymentModal.jsx     (P2P payment interface)
├── context/
│   └── AuthContext.jsx             (Global auth state)
├── utils/
│   ├── tokenUtils.js               (Token generation/validation)
│   └── authUtils.js                (RBAC & session management)
├── App.jsx                         (Main router setup)
├── index.jsx                       (Entry point)
├── index.css                       (Tailwind + custom styles)
└── public/
    └── index.html                  (HTML template)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 16+ (download from [nodejs.org](https://nodejs.org))
- npm 7+

### Installation

1. **Navigate to project directory:**

```bash
cd /Users/jasaandabney/Documents/Claude/Projects/Athlete\ IQ\ App\ Live
```

2. **Initialize npm project (if not already done):**

```bash
npm init -y
```

3. **Install dependencies:**

```bash
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

4. **Initialize Tailwind:**

```bash
npx tailwindcss init -p
```

5. **Update `tailwind.config.js`:**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#080808',
        brand: '#F59E0B',
        clinical: '#F9F9F9',
        borderLight: '#E5E5E5',
        borderDark: '#D1D5DB',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

6. **Create `vite.config.js`:**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

7. **Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

8. **Run development server:**

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔑 Key Features

### Super Admin Portal

- **Global Search:** Search organizations, directors, athlete names
- **Metrics Dashboard:** Total users, programs, tier breakdown
- **Organization Table:** Master directory with tier & status
- **Organization Details:** View/edit individual org data
- **Demo Data:** Organizations loaded from localStorage

**Access:** Sign in as `super_admin` role

### Invite-to-Claim Workflow

- **Token Generation:** Directors create invitations with player data
- **Token Validation:** Automatic validation & expiration checking
- **Pre-filled Registration:** Player name & age group auto-populate
- **Claim Flow:** Create credentials → Performance Passport
- **Demo Storage:** Tokens stored in localStorage

**Access:** Visit `/register?token=<base64_encoded_token>`

**Sample Token Generation:**

```javascript
import { generatePlayerToken, storeToken } from './utils/tokenUtils.js';

const token = generatePlayerToken({
  id: 'player_001',
  name: 'Noah Dabney',
  ageGroup: '14U',
  organizationId: 'org_001',
});

storeToken(token, 'Noah Dabney');
console.log(`Invitation link: http://localhost:3000/register?token=${token}`);
```

### Player Portal

**Components:**

- **Performance Passport:** Stats overview (training, shooting, nutrition, sleep)
- **Fast Log:** Mobile-optimized quick logging (<30 seconds)
  - RPE (Rate of Perceived Exertion)
  - Shots Made/Attempted
  - Hydration & Protein Intake
  - Sleep Quality (1-5)
  - Recovery Status
- **AthleteIQ Insights:** Placeholder widget for LLM integration
- **Financials:** Balance tracking + P2P payment modal
  - Venmo & Cash App QR codes
  - Direct transfer options
  - Transaction history with confirmation numbers
  - Audit trail support

**Access:** Sign in as `player` role

---

## 🔐 Authentication & RBAC

### Roles

- `super_admin` — Full platform access, admin portal
- `director` — Organization management, roster, scheduling
- `player` — Personal performance tracking
- `parent` — Parent/guardian access to child athlete data

### Protected Routes

```javascript
<Route 
  path="/admin/portal" 
  element={
    <ProtectedRoute requiredRole="super_admin">
      <AdminPortal />
    </ProtectedRoute>
  } 
/>
```

### Session Management

- Stored in `sessionStorage` for demo mode
- Auto-loads on page refresh
- Clear session on logout

---

## 💾 Demo Data Storage

### localStorage Keys

- `athleteiq_session` — Current user session
- `athleteiq_organizations` — Master organization list
- `athleteiq_players` — Player profiles
- `athleteiq_tokens` — Invitation tokens

### Clearing Demo Data

```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🔗 API Integration Points

### InsightsWidget (LLM-Ready)

Currently uses placeholder insights. Replace with:

```javascript
const fetchInsights = async (athleteId) => {
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ athleteId }),
  });
  return response.json();
};
```

### P2P Payment Modal (Payment Gateway-Ready)

Currently accepts manual transaction IDs. Integrate:

```javascript
const processPayment = async (data) => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

---

## 📦 Production Build

### Build for Deployment

```bash
npm run build
```

This creates an optimized `dist/` folder.

### Deploy to Vercel

1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Set build command:** `npm run build`
4. **Set output directory:** `dist`
5. **Deploy**

### Deploy to Netlify

```bash
npm run build
# Drag `dist/` folder to Netlify
```

---

## 🎨 Styling Notes

- **Tailwind CSS:** All components use Tailwind utility classes
- **Custom Colors:** Dark theme (#080808), Brand gold (#F59E0B), Clinical white (#F9F9F9)
- **Typography:** Barlow Condensed (display), Barlow (body), JetBrains Mono (code)
- **Clip-path:** `.brutal-clip` class for angular corners

---

## 🐛 Troubleshooting

### Module Not Found Errors

```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use

```bash
npm run dev -- --port 3001
```

### localStorage Quota Exceeded

Clear browser storage:

```javascript
localStorage.clear();
```

---

## 📋 Checklist Before Production

- [ ] Replace demo authentication with real login system
- [ ] Connect to actual database (replace localStorage)
- [ ] Integrate LLM API for Insights
- [ ] Connect payment processor for P2P payments
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment variables
- [ ] Add error logging & monitoring
- [ ] Security audit: RBAC, data validation, XSS prevention
- [ ] Performance optimization: code splitting, lazy loading
- [ ] Mobile responsiveness testing

---

## 📞 Support

For questions or issues, refer to:

- React Docs: [react.dev](https://react.dev)
- React Router Docs: [reactrouter.com](https://reactrouter.com)
- Tailwind Docs: [tailwindcss.com](https://tailwindcss.com)
- Vite Docs: [vitejs.dev](https://vitejs.dev)

---

**Version:** 1.0  
**Last Updated:** June 2026
