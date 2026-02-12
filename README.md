# FitTrack

FitTrack is a modern fitness tracking web app built with Next.js and Firebase.

It helps users set goals, log daily progress (meals, workouts, sleep, and steps), and view insights from a single dashboard.

## Features

- Google Sign-In with Firebase Authentication
- Firestore-backed persistence (no localStorage data lock-in)
- Daily Check-In flow for easier logging
- Dashboard insights with status, streak, and trends
- Meal, sleep, workout, and steps tracking
- Reset Data flow to clear all user records safely

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Firebase Auth + Firestore
- Recharts for analytics visualizations
- Tailwind CSS

## Project Structure

```text
src/
	app/
		components/
		dashboard/
		goal-setup/
		login/
		signup/
	lib/
		auth.ts
		firebase.ts
		firestore.ts
context/
	GoalContext.tsx
	UserContext.tsx
utils/
	calculateMetrics.ts
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 3) Production build check

```bash
npm run build
npm run start
```

## Firebase Setup (Required)

Follow the full setup guide in [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

Minimum required before using the app:

1. Enable Google provider in Firebase Authentication
2. Enable Firestore Database
3. Add Firestore security rules (user can only access own data)
4. Add your deployed domain to Firebase Authorized Domains

## Environment Variables

Currently, Firebase web config is set in [src/lib/firebase.ts](src/lib/firebase.ts).

- There are no `.env` files required to run this repo in its current state.
- If you want cleaner environment management, you can migrate Firebase config to `NEXT_PUBLIC_*` variables later.

## Deployment

This project is configured for Vercel.

- Build command: `npm run build`
- Output: `.next`
- Vercel config file: [vercel.json](vercel.json)

## Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run lint checks

## Notes

- Firestore collections are created automatically on first write.
- Keep Firestore security rules strict in production.
- If login fails with `auth/operation-not-allowed`, enable Google sign-in in Firebase Console.
