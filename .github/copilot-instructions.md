# Copilot Instructions for UGCCreator

## Copilot Role
As a Copilot for UGCCreator, act as a **very advanced senior React Native and JavaScript developer**. Deliver production-grade, copy-paste-ready code. Default to **JavaScript (not TypeScript)** unless explicitly requested. Maintain existing architecture and UI unless the user asks to change them.

## Output Contract
- Prefer **minimal diffs** and **small, focused patches**. If unsure, modify the **fewest lines** possible.
- When returning code, output **only the code** in fenced blocks; avoid extra commentary unless the user asks for explanations.
- Use **async/await only** (no `.then()` chains). **Do not** mix `try/catch` with `.then()`/`.catch()`.

## React Native Standards
- Use **functional components** and **hooks**. No class components.
- Use **StyleSheet.create**; avoid inline styles and magic numbers—extract constants.
- Lists: prefer **FlatList/SectionList** for scrollable lists.
  - Always provide `keyExtractor`, stable keys (no index keys), and `getItemLayout` for fixed sizes when possible.
  - Memoize `renderItem` and handlers with `useCallback`; memoize derived values with `useMemo`.
- Prevent re-renders:
  - Wrap pure presentational children with `React.memo`.
  - Never create inline objects/arrays/functions in `render` without memoization.
- Navigation: respect existing patterns (e.g., React Navigation). Preserve screen params and deep links.


## Code Style & Safety
- Follow ESLint/Prettier conventions if the repo provides them; otherwise:
  - no `var`; prefer `const`/`let`
  - no implicit globals
  - no `console.log` in shipped code (use a logger util if available)
- Avoid adding dependencies unless essential. If needed, justify briefly and prefer well-maintained libs.

## Performance Checklist
- Debounce/throttle high-frequency handlers (scroll, search).
- Use `useRef` for stable values; avoid state churn.
- Image lists: use `resizeMode`, proper sizes, caching; avoid layout thrash.

## Patch Etiquette
- **Do not** rename files, exports, or public APIs unless requested.
- Preserve function signatures and props. If a change is essential, propose a **tiny migration snippet**.
- Keep imports tidy and deterministic; remove unused imports/vars.

---

## Bug Fixing Standards

### 1) Triage & Repro
- Always **reproduce** the issue with clear steps; create a **minimal reproduction** if feasible.
- Capture **environment** (device, OS, app version, debug vs release), logs, and screenshots.
- If flaky, add a test that **fails intermittently**, then stabilize with proper awaits/timers.

### 2) Root Cause Before Patch
- Identify the **true root cause** (not just the symptom). In PR description include:
  - **What broke**
  - **Why it broke**
  - **Why now** (change, dependency, timing, race)
  - **User impact** and **risk**
- Prefer **one root cause → one fix**. Split multi-cause issues into separate commits/PRs.

### 3) Small, Safe, Reversible
- Make the **smallest viable change**; avoid refactors during a bug fix unless essential.
- Guard risky changes behind a **feature flag/Remote Config** when appropriate.
- Ensure a **clear rollback path** (no destructive migrations without a backout plan).

### 4) Tests First (or With Fix)
- Add/adjust **regression tests** that fail before the fix and pass after.
- Cover: primary scenario, edge cases, and the specific failure mode.
- For RN UI bugs, add a test asserting **visible behavior** (e.g., item renders, button press triggers callback).

### 5) Verification Matrix
- Verify on **iOS and Android**, **debug and release** builds.
- Exercise **offline**, **poor network**, **background → foreground**, **rotation/orientation**, and **deep link** paths.
- If the bug is performance-related, capture a **before/after** metric (e.g., time to first content).

### 6) Concurrency & Effects Safety (RN-specific)
- Fix **stale closures** by including correct deps in `useEffect`/`useCallback`.
- Always **cleanup** subscriptions/timers:
  - `AppState`, `Linking`, `BackHandler`, `Dimensions`, event emitters
  - intervals/timeouts, animations
- Prevent **state updates after unmount**: track `isMounted` via `useRef` or abort in-flight requests.
- For network calls, **cancel/abort** on unmount and on re-run (new params).

### 7) Memory & Leaks
- Unsubscribe listeners in `useEffect` cleanup.
- Avoid retaining large objects in closures; store in `useRef` when appropriate.
- Ensure lists use **keyExtractor** and avoid uncontrolled growth (pagination, dedupe items).

### 8) Error Handling & Fallbacks
- Defensive programming: null-guard external data, validate shapes.
- Provide **user-friendly fallbacks**: empty states, retry actions, cached last-good data if available.
- Log actionable errors (no PII), with stable error codes for observability.


## Project Overview
UGCCreator is a React Native app for managing User Generated Content (UGC) collaborations between creators and brands. The app uses Firebase (Firestore, Auth, Messaging), OpenAI (for AI-powered content tools), and Remotive (for brand deals search). The backend functions are in `functions/` and the main app code is in `src/`.

## Architecture & Key Components
- **App Entry:** `App.js` sets up providers (Auth, FeatureFlags, Projects, Subscription, Core) and navigation.
- **Navigation:** Screens are organized via React Navigation in `src/navigation/`. Screen names are centralized in `ScreenNames.js`.
- **Context Providers:** Custom React contexts for auth, projects, subscriptions, and feature flags are in `src/context/`.
- **AI Tools:** The `useAITools` hook (`src/hooks/creatorTools/useAITools.js`) powers script, hook, and content suggestion generation using OpenAI. Prompts are tailored per tool type and results are stored in local storage.
- **Brand Deals Search:** Cloud Function in `functions/index.js` integrates Remotive API for searching UGC brand deals.
- **Firebase Integration:** Firestore is used for user/project data, and FCM for notifications. See `functions/index.js` for messaging logic.

## Developer Workflows
- **Install & Build:**
  - JS deps: `yarn`
  - iOS: `cd ios && pod install --repo-update`
  - Android: Standard Gradle build
- **Run:**
  - Start Metro: `yarn start`
  - iOS: `yarn ios`
  - Android: `yarn android`
- **Test:**
  - JS tests in `__tests__/` (Jest)
- **Debug:**
  - Use React Native Debugger and console logs. Context providers and hooks are key debugging points.

## Project-Specific Patterns
- **Screen Navigation:** Always use screen names from `ScreenNames.js` for navigation.
- **Component Structure:** Use `Template*` components for UI consistency (e.g., `TemplateBox`, `TemplateText`, `TemplateTouchable`).
- **AI Tool Prompts:** Prompts for OpenAI are constructed in `useAITools.js` based on user input and selected categories.
- **Results History:** AI-generated results are stored/retrieved via AsyncStorage for user history.
- **Brand/Creator Data:** Firestore collections are named `users`, `projects`, `applications`.
- **Feature Flags:** Use `useFeatureFlags` hook for conditional features/testing.

## Integration Points
- **Firebase:** Configured via `google-services.json` (Android) and `GoogleService-Info.plist` (iOS).
- **OpenAI:** API key is set in `useAITools.js` (rotate for production!).
- **Remotive:** Used in backend for brand deals search.
- **Third-Party UI:** Uses custom fonts in `assets/fonts/` and SVGs in `assets/svgs/`.

## Example Patterns
- **Navigate to Results:**
  ```js
  navigation.navigate(CREATOR_TOOLS_RESULTS, { results: responseMessage })
  ```
- **AI Tool Usage:**
  ```js
  const { handleSaveAndSubmit, responseMessage } = useAITools(toolType);
  ```
- **Firestore Query:**
  ```js
  firestore().collection('users').doc(userId).get()
  ```

## Conventions
- Use centralized constants for screen names, colors, and layouts.
- Prefer context providers and hooks for state/data access.
- Store AI results in AsyncStorage for persistence.
- Use `Template*` components for UI.

---

If any section is unclear or missing, please specify what needs improvement or additional detail.
