# Firebase Integration Setup Guide

## ✅ What's Done

I've integrated Firebase/Firestore into your app:

- ✅ Created `/src/config/firebase.js` - Firebase initialization
- ✅ Created `/src/services/firebaseService.js` - All Firestore operations
- ✅ Updated `AuthContext` to use Firebase
- ✅ Updated `AdminPortal` to fetch organizations from Firestore
- ✅ Created `.env.example` template
- ✅ Added `firebase` package to dependencies

**Fallbacks:** All components fall back to localStorage if Firebase fails, so nothing breaks.

---

## 🔧 What You Need To Do

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click your project
3. Go to **Settings** (gear icon) → **Project Settings**
4. Scroll to **Your Apps** section
5. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 2: Create `.env.local` File

In your project root, create a file named `.env.local` (NOT `.env.example`):

```bash
VITE_FIREBASE_API_KEY=<paste your apiKey>
VITE_FIREBASE_AUTH_DOMAIN=<paste your authDomain>
VITE_FIREBASE_PROJECT_ID=<paste your projectId>
VITE_FIREBASE_STORAGE_BUCKET=<paste your storageBucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<paste your messagingSenderId>
VITE_FIREBASE_APP_ID=<paste your appId>
```

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Choose region closest to you
5. Click **Enable**

### Step 4: Install Dependencies Locally

```bash
cd /Users/jasaandabney/Documents/Claude/Projects/Athlete\ IQ\ App\ Live

npm install
npm run dev
```

### Step 5: Test Locally

1. Open `http://localhost:3000`
2. Sign in as "Super Admin"
3. You should see the Admin Portal loading (with or without data)
4. If you see data, Firebase is connected! ✅

---

## 📊 Firestore Collections (Auto-created)

Collections are created automatically when you first save data:

- **users** - User sessions
- **organizations** - Organization/program data
- **players** - Player/athlete profiles
- **invitationTokens** - Invite-to-claim tokens
- **transactions** - Payment history

---

## 🚀 Deploy to Production

Once everything works locally:

```bash
git add .
git commit -m "feat: Add Firebase integration for production"
git push
```

Vercel will auto-deploy. You'll need to add environment variables:

1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Go to **Environment Variables**
3. Add all 6 Firebase variables from Step 2
4. Redeploy

---

## 🔐 Security Rules (Important!)

By default, test mode allows anyone to read/write. For production, update Firestore rules:

**Firebase Console → Firestore → Rules**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow authenticated users to read organizations
    match /organizations/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🆘 Troubleshooting

**"Firebase is not defined"**
- Make sure you ran `npm install`
- Restart dev server: `npm run dev`

**"Missing environment variables"**
- Create `.env.local` file (not `.env`)
- Verify all 6 variables are set
- Restart dev server

**"Firestore permission denied"**
- Make sure Firestore database is created
- Check you're in test mode (allows reads/writes)
- Check browser console for exact error

**"Data still using localStorage"**
- Firebase will auto-use if credentials are correct
- Check `localStorage` → data is still there as fallback
- Open browser DevTools → Network to see Firestore calls

---

## 📝 What Components Use Firebase Now

- ✅ AdminPortal - Fetches organizations
- ✅ AuthContext - Saves user sessions
- ✅ (Coming) RegisterWithToken - Creates player accounts
- ✅ (Coming) PlayerDashboard - Loads player stats
- ✅ (Coming) Financials - Saves transactions

**All have fallbacks** to localStorage while we're integrating.

---

## ⏱️ Timeline

- **Now:** Get Firebase credentials + create `.env.local`
- **15 mins:** Test locally with `npm run dev`
- **5 mins:** Push to GitHub
- **2 mins:** Vercel auto-deploys with env variables
- **Done:** Live with real database! 🎉

---

Let me know when you have your Firebase credentials, and I'll walk you through the next steps!
