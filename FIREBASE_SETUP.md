# Firebase Setup Guide

## ✅ Steps You Need to Complete in Firebase Console

### 1. Enable Google Authentication (REQUIRED - Do this NOW!)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **fittrack** project
3. In the left sidebar, click **Build** → **Authentication**
4. Click **Get Started** (if first time)
5. Click the **Sign-in method** tab at the top
6. Find **Google** in the providers list and click it
7. Toggle **Enable** to ON
8. Select a **Support email** (your email)
9. Click **Save**

**Without this step, login will fail with "auth/operation-not-allowed"**

---

### 2. Enable Firestore Database (REQUIRED)

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - This allows read/write for 30 days
   - We'll add security rules later
4. Choose your region (closest to you for better performance)
5. Click **Enable**

---

### 3. Add Firestore Security Rules (Do this before deploying)

Once Firestore is created:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

This ensures each user can only read/write their own data.

---

### 4. Add Authorized Domain (When Deploying to Vercel)

After you deploy to Vercel:

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add your Vercel domain (e.g., `fittrack.vercel.app`)
4. Click **Add**

`localhost` is already authorized for development.

---

## ✅ What's Already Done

✅ Firebase project created  
✅ Firebase SDK installed  
✅ Firebase config added to code  
✅ Google OAuth integrated  
✅ Login page updated  
✅ User context updated  
✅ Firestore helpers created  

---

## 🧪 Testing

After enabling Google Auth and Firestore:

1. Run `npm run dev`
2. Go to http://localhost:3000
3. Click "Sign In with Google"
4. Select your Google account
5. You should be redirected to goal-setup or dashboard

---

## 📊 Firebase Free Tier Limits

| Service    | Free Limit          | Your Usage  |
|-----------|---------------------|-------------|
| Auth      | Unlimited users     | ~1-5 users  |
| Firestore | 1GB, 50K reads/day  | <1MB, <100  |
| Hosting   | 10GB transfer/month | <50MB       |

**You'll never hit these limits for a portfolio project.**

---

## 🔥 Common Issues

### "auth/operation-not-allowed"
→ You didn't enable Google sign-in provider in Firebase Console

### "auth/popup-blocked"
→ Browser blocked the popup. Allow popups for localhost

### Firestore permission denied
→ You didn't enable Firestore or set security rules

### "Firebase app not initialized"
→ Check that firebase config is correct in `lib/firebase.ts`

---

## Next Steps

1. ✅ Enable Google Auth in Firebase Console (DO THIS NOW)
2. ✅ Enable Firestore Database
3. Test login flow
4. Update GoalContext to use Firestore instead of localStorage
5. Update dashboard components to use Firestore
6. Deploy to Vercel
7. Add Vercel domain to Firebase authorized domains
