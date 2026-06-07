# AthleteIQ React — Quick Start (5 minutes)

## Step 1: Install Dependencies

```bash
cd /Users/jasaandabney/Documents/Claude/Projects/Athlete\ IQ\ App\ Live

npm install
```

This installs React, React Router, Tailwind CSS, and Vite.

## Step 2: Start Dev Server

```bash
npm run dev
```

Browser opens automatically at `http://localhost:3000`

## Step 3: Test the Flows

### Super Admin Portal
1. Click "Sign In to Continue"
2. Change role to "Super Admin" 
3. Click "Sign In"
4. Click "Admin Portal"
5. Browse organizations, search, view KPIs

### Invite-to-Claim Workflow
1. Open browser console (F12)
2. Run this to generate a token:

```javascript
// In console:
const tokenData = {
  playerId: "player_001",
  playerName: "Noah Dabney",
  ageGroup: "14U",
  organizationId: "org_001",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};
const token = btoa(JSON.stringify(tokenData));
localStorage.setItem('athleteiq_tokens', JSON.stringify({
  [token]: { playerName: "Noah Dabney", createdAt: new Date().toISOString(), claimed: false }
}));
console.log(`http://localhost:3000/register?token=${token}`);
```

3. Copy the URL and visit it
4. Fill in parent name, email, password
5. Click "Activate & Sign In"
6. You're now logged in as a player

### Player Portal
1. After invite-to-claim flow (above), you're auto-redirected
2. Or: Sign in directly as "Player" role
3. Browse tabs: Overview, Profile, Training, Shooting, etc.
4. Log metrics with Fast Log (<30 seconds)
5. View balance and P2P payment modal
6. Check transaction history

## File Structure

```
src/
├── components/          # All UI components
├── context/             # Auth state management
├── utils/               # Token & auth utilities
├── App.jsx              # Router setup
├── index.jsx            # Entry point
└── index.css            # Tailwind + styles

public/index.html        # HTML template
package.json             # Dependencies
vite.config.js          # Build config
tailwind.config.js      # Tailwind config
```

## Key Files to Know

- **Token generation:** `src/utils/tokenUtils.js`
- **Authentication:** `src/context/AuthContext.jsx`
- **Admin portal:** `src/components/SuperAdmin/AdminPortal.jsx`
- **Invite flow:** `src/components/InviteToClaim/RegisterWithToken.jsx`
- **Player dashboard:** `src/components/PlayerPortal/PlayerDashboard.jsx`
- **Routing:** `src/App.jsx`

## Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder. Deploy to Vercel:

```bash
# Vercel auto-detects React app
# Set build command: npm run build
# Set output directory: dist
```

## Common Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm install              # Install dependencies
npm list                 # Show installed packages
```

## Reset Demo Data

```javascript
// In console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Tailwind not working:**
- Restart dev server: `npm run dev`
- Clear cache: `npx tailwindcss -i ./src/index.css -o ./dist/output.css`

## API Integration Points

When ready to connect real backend:

1. **Replace localStorage** → Connect to database
2. **InsightsWidget** → Connect LLM API
3. **P2P Payment** → Connect payment processor
4. **Authentication** → Connect real login system

## Documentation

- Full setup guide: `REACT_SETUP_GUIDE.md`
- Complete summary: `REACT_BUILD_SUMMARY.md`
- Original brand/investor materials still in project root

---

**You now have a production-ready React application with:**
- ✅ Super Admin Portal
- ✅ Invite-to-Claim Workflow
- ✅ Player Performance Dashboard
- ✅ FastLog (mobile quick-logging)
- ✅ InsightsWidget (LLM-ready)
- ✅ P2P Payments
- ✅ Full RBAC
- ✅ Token-based invitations

**Ready to extend or deploy!**
