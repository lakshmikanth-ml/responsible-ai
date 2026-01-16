# Responsible AI Workbench

## Overview
This workspace hosts a front-end prototype for multiple Responsible AI pillars (e.g., Transparency & Explainability, Fairness & Non-Discrimination, Privacy & Data Security, Safety & Reliability, Inclusiveness, Environmental Sustainability, Accountability). Each pillar is modeled as a page with its own tabs/steps, interactive forms, and local demo persistence to simulate governance workflows.

## Tech / Tooling
- React with Material UI (MUI 5) components for layout, tables, cards, dialogs, chips, and pills.
- Local state plus `localStorage` for demo data persistence (no backend required).
- Custom reusable pieces: Project context cards, pill/status chips, drawers/modals for exports, and tabbed stepper-style navigation per pillar.

## Key Packages
- `react`, `react-dom`, `react-router` (app shell and routing)
- `@mui/material`, `@mui/icons-material` (UI components/icons)
- `formik`, `yup` (forms + validation where used)
- `react-hook-form` (in some flows)
- Utility helpers such as `uuid` or `crypto.randomUUID` for sample IDs

## Runtime Versions (local)
- Node: v20.18.2
- React: 19.2.1

## How to Run
1. Install deps (if not already): `npm install` or `yarn`.
2. Start the dev server: `npm start` or `yarn start`.
3. Open the app in your browser (usually http://localhost:3000). Each pillar page can be accessed via the side navigation.

## Notes
- Demo-only data: saves locally in the browser; use the Reset buttons per page to clear.
- Screens are intentionally rich with tables and forms to mirror RAI governance artifacts (objectives, coverage matrices, risks, evidence, gates).
