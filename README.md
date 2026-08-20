# LevelUp — frontend

React + Vite + Tailwind frontend for the LevelUp gamified habit tracker, matching the dark/teal dashboard theme.

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## What's included

- `src/App.jsx` — layout (sidebar + topbar) and routes
- `src/components/` — reusable pieces: LevelRing, StatCard, HabitItem, BadgeCard, FeatureCard, StreakDay, JourneyMilestone
- `src/pages/`
  - `Dashboard.jsx` — main dashboard (matches the reference image), habits are clickable and update XP/level live
  - `Features.jsx` — feature overview page (matches the reference image)
  - `Habits.jsx` — add/delete habits
  - `Progress.jsx` — weekly progress bar chart
  - `Achievements.jsx` — badge grid with locked/unlocked states
  - `Rewards.jsx` — redeemable rewards list
  - `Profile.jsx` — user profile summary

## Next steps for the team

- Replace the local `useState` habit/XP data in `Dashboard.jsx` with data from your Express + MongoDB API
- Add login/signup pages and wrap routes with auth
- Hook the "Redeem" buttons in `Rewards.jsx` up to a real XP-spending endpoint
- Wire the optional AI feature into a small panel (e.g. on `Dashboard.jsx` or `Features.jsx`) calling your backend, which calls OpenAI
