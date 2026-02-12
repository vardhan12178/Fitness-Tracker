# FitTrack — Implementation Plan

> Saved: Feb 11, 2026 | Next session: Firebase + Feature improvements

---

## What FitTrack IS (Portfolio Pitch)

**One-liner:** A goal-based personal fitness tracker that calculates daily nutrition and activity targets, tracks your compliance, and tells you if you're on pace to hit your goal.

**How to describe it:**
> "FitTrack is a personal fitness dashboard where users set a weight goal (loss/gain/bulk), and the app calculates personalized daily calorie, protein, and activity targets. Users log meals, workouts, sleep, and steps daily — the app analyzes compliance, shows 7-day trends, and flags when you're falling behind. Built with Next.js 15, Firebase Auth (Google OAuth), Firestore, Recharts, and Tailwind CSS."

**Why it's not "just another dashboard":**
- It has a FEEDBACK LOOP: Goal → Targets → Logging → Analysis → Warnings
- Real auth with Google OAuth (not fake localStorage auth)
- Cloud-persisted data (Firestore)
- Smart validation that blocks unrealistic goals
- Progress tracking toward the actual goal

---

## Phase 1: Firebase Integration (Tomorrow)

### 1A. Firebase Setup
- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Authentication → Google sign-in provider
- [ ] Enable Firestore Database (start in test mode, add rules later)
- [ ] Install: `npm install firebase`
- [ ] Create `lib/firebase.ts` with config

### 1B. Google OAuth (Replace current login/signup)
- [ ] Create `lib/auth.ts` with signInWithGoogle, signOut helpers
- [ ] Replace UserContext to use Firebase Auth state (onAuthStateChanged)
- [ ] Replace login page with single "Sign in with Google" button
- [ ] Remove signup page entirely (Google handles registration)
- [ ] Add auth guard: redirect to login if not authenticated
- [ ] User info comes from Google (name, email, photo) — no forms needed

### 1C. Firestore Data Storage (Replace localStorage)
- [ ] Data structure:
  ```
  users/{uid}/
    goal: { goalType, currentWeight, targetWeight, timeframe, createdAt }
    workouts/{id}: { exercise, sets, reps, weight, date, createdAt }
    meals/{id}: { name, calories, protein, fiber, date, createdAt }
    sleepLogs/{id}: { date, hours, createdAt }
    steps/{id}: { date, count, goal, createdAt }
  ```
- [ ] Create `lib/firestore.ts` with CRUD helpers for each collection
- [ ] Update GoalContext to read/write Firestore
- [ ] Update dashboard components to use Firestore instead of localStorage
- [ ] Keep localStorage as offline fallback (progressive enhancement)

### 1D. Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Each user can only read/write their own data. Simple and secure.

### Firebase Free Tier Limits (Spark Plan — $0)
| Service        | Free Limit              | Our Usage     |
|---------------|-------------------------|---------------|
| Auth          | Unlimited users         | ~1-5 users    |
| Firestore     | 1 GB, 50K reads/day     | <1 MB, <100   |
| Hosting       | 10 GB, 360 MB/day       | <50 MB        |
| Functions     | 2M invocations/month    | Not needed    |

**We'll never come close to any limit.** It's free forever for this scale.

---

## Phase 2: Smart Validation (Block Unrealistic Goals)

### Problem
Right now someone can set: 20kg → 400kg in 1 day. That makes us look like jokers.

### Solution — Physiologically-Based Validation

```
Weight range: 35 kg – 200 kg (both current and target)
```

**Weight Loss:**
- Max safe rate: 1 kg/week (0.5-1 kg/week is healthy)
- Minimum timeframe = (weightToLose / 1) * 7 days
- Example: Lose 10kg → minimum 70 days (10 weeks)
- Max single goal: 30kg loss (beyond that = medical supervision)
- Target must be LESS than current weight

**Weight Gain:**
- Max safe rate: 0.5 kg/week (lean gain)
- Minimum timeframe = (weightToGain / 0.5) * 7 days
- Example: Gain 5kg → minimum 70 days (10 weeks)
- Max single goal: 15kg gain
- Target must be MORE than current weight

**Bulking:**
- Max safe rate: 0.75 kg/week
- Max single goal: 20kg
- Target must be MORE than current weight

**Validation messages should be helpful, not just "invalid":**
- "Losing 10kg in 30 days means ~2.3kg/week — doctors recommend max 1kg/week. Try at least 70 days."
- "A target weight of 400kg is outside the healthy range (35-200kg)."

**Calorie sanity check:**
- If calculated daily deficit > 1500 kcal → warn "This deficit is extreme"
- If daily surplus > 1000 kcal → warn "This surplus may cause excess fat gain"
- Show the user what their daily calorie target means in real terms

---

## Phase 3: Features That Add Real Purpose

### 3A. Goal Progress Tracker (HIGH PRIORITY)
Show how far along the user is toward their goal:
- **Progress bar**: Current weight → Target weight (update weekly)
- **Estimated completion date** based on current rate
- **"Weekly weigh-in" feature**: Log weight once a week, track trend
- **Pace indicator**: "On track" / "Behind" / "Ahead of schedule"

This is THE feature that makes it more than a logging app.

### 3B. Accountability / Missed Day Alerts (MEDIUM PRIORITY)
When user opens the dashboard:
- "You haven't logged meals for 2 days" — yellow banner at top
- "You haven't logged sleep since Tuesday" — yellow banner
- "Great! You've logged everything for 5 days straight!" — green streak banner

**Streak counter:**
- Track consecutive days with ALL data logged (meals + sleep + steps)
- Show streak in dashboard: "🔥 5-day streak"
- Motivating and creates habit

**Note:** We're NOT doing push notifications (needs service worker, overkill).
These are just in-app banners that show when you open the dashboard.

### 3C. Daily Score / Compliance Rating (MEDIUM PRIORITY)
Give each day a score out of 100:
- Calories within ±10% of target: 30 pts
- Protein ≥ target: 25 pts
- Sleep ≥ 7 hrs: 20 pts
- Steps ≥ goal: 15 pts
- At least 1 workout logged: 10 pts

Show weekly average score. This gamifies compliance without being gimmicky.

### 3D. Smart Insights (LOW PRIORITY — nice-to-have)
Based on 7-day data, show contextual tips:
- If calories consistently over: "You've exceeded your calorie target 5/7 days. Consider lower-calorie meal alternatives."
- If protein consistently low: "Protein has been below target all week. Try adding chicken, eggs, or a protein shake."
- If sleep inconsistent: "Your sleep varies from 4-9 hours. Consistent sleep improves recovery."
- If no workouts in 5+ days: "You haven't logged a workout in 5 days. Even a short session helps."

These are simple if/else rules, NOT AI. But they feel intelligent.

---

## Phase 4: UI Polish (If Time Permits)

- [ ] Add user's Google profile photo in sidebar/navbar
- [ ] Add a proper 404 page
- [ ] Weekly weigh-in modal
- [ ] Export data as CSV (nice portfolio feature)
- [ ] Dark/light mode toggle (currently dark only)
- [ ] Animations on page transitions (framer-motion)

---

## What We're NOT Building (Keep Scope Tight)

- ❌ Exercise database / workout plans — we're a TRACKER, not a coach
- ❌ Social features / leaderboards
- ❌ AI-generated meal plans
- ❌ Barcode scanning for food
- ❌ Wearable integration (Fitbit, Apple Watch)
- ❌ Mobile app (it's a responsive web app, that's fine)
- ❌ Push notifications (service workers are overkill for portfolio)
- ❌ Payment/premium tier

---

## Priority Order for Tomorrow

1. **Firebase Auth + Google OAuth** (replaces fake auth) — ~45 min
2. **Firestore integration** (replaces localStorage) — ~60 min  
3. **Smart validation** (block unrealistic goals) — ~20 min
4. **Goal progress tracker** (weekly weigh-in + progress bar) — ~30 min
5. **Missed day alerts + streak** — ~20 min
6. **Daily compliance score** — ~20 min
7. **Smart insights** — ~15 min

Total estimated: ~3.5 hours for everything

---

## Tech Stack (Final)

| Layer          | Technology                    |
|---------------|-------------------------------|
| Framework     | Next.js 15 (App Router)       |
| Language      | TypeScript                    |
| Auth          | Firebase Auth (Google OAuth)  |
| Database      | Cloud Firestore               |
| Styling       | Tailwind CSS 4                |
| Charts        | Recharts                      |
| Icons         | Lucide React                  |
| Dates         | Day.js                        |
| Deployment    | Vercel (free tier)            |

---

## Deployment Plan

After Firebase integration:
1. Deploy to Vercel (connect GitHub repo)
2. Add Firebase config as Vercel env variables
3. Add custom domain if available
4. Add to portfolio with screenshots + description

---

*This plan was auto-generated during development session. Update as needed.*
