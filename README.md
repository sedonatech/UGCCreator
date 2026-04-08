# UGCCreator

A cross-platform React Native mobile application that connects User Generated Content (UGC) creators with brands. Creators discover brand partnerships, manage projects, chat with brands, access AI-powered content tools, and build their portfolio. Brands manage campaigns, browse creator profiles, post events, and recruit talent.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Architecture Overview](#architecture-overview)
7. [Navigation](#navigation)
8. [Feature Modules](#feature-modules)
9. [State Management](#state-management)
10. [Firebase Services](#firebase-services)
11. [Cloud Functions](#cloud-functions)
12. [AI Integration](#ai-integration)
13. [Subscriptions and Monetization](#subscriptions-and-monetization)
14. [Internationalization](#internationalization)
15. [Push Notifications](#push-notifications)
16. [Theming](#theming)
17. [Testing](#testing)
18. [Deployment](#deployment)
19. [Handover Checklist](#handover-checklist)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native (bare workflow) | 0.81.0 |
| Language | JavaScript / TypeScript | ES2021 / TS 5.8 |
| React | React | 19.1.0 |
| Navigation | React Navigation (stack, bottom-tabs) | 6.x |
| Backend | Firebase (Auth, Firestore, Storage, Functions, Analytics, Crashlytics, Remote Config, Messaging) | 23.5.x |
| Subscriptions | RevenueCat | 9.6.x |
| Chat | Stream Chat SDK + Gifted Chat | - |
| AI | Groq API (LLaMA models) | - |
| i18n | i18next + react-i18next | 25.x / 16.x |
| CI/CD | GitHub Actions + Fastlane | - |
| Linting | ESLint + Prettier | 8.x / 2.8 |

### Key Dependencies

The app relies on approximately 80 production dependencies. Notable ones include `react-native-reanimated` for animations, `react-native-fast-image` for performant image loading, `fuse.js` for client-side fuzzy search, `date-fns` for date manipulation, `react-native-purchases` (RevenueCat) for subscription management, and `react-native-video` for media playback.

---

## Prerequisites

You will need the following installed on your development machine:

- **Node.js** >= 18 (see `engines` in `package.json`)
- **Yarn** (package manager, `yarn.lock` is committed)
- **Ruby** >= 2.6.10 (for Fastlane/CocoaPods; 3.2.x recommended via `rbenv`)
- **Bundler** (`gem install bundler`)
- **Xcode** (latest stable, iOS development)
- **Android Studio** with Android SDK (Android development)
- **CocoaPods** (installed via `bundle install`)
- **Firebase CLI** (`npm install -g firebase-tools`, for deploying cloud functions)

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url> && cd UGCCreator

# 2. Install JS dependencies
yarn install

# 3. Copy environment variables
cp .env.example .env
# Fill in your API keys (see Environment Variables below)

# 4. Install Ruby dependencies (Fastlane + CocoaPods)
bundle install

# 5. Install iOS native dependencies
cd ios && bundle exec pod install && cd ..

# 6. Start Metro bundler
yarn start

# 7. Run on device/simulator
yarn ios     # or: yarn android
```

If you encounter pod install issues, the `Podfile` uses `use_frameworks! :linkage => :static` which is required for Firebase compatibility. Run `bundle exec pod install --repo-update` if pods fail to resolve.

---

## Environment Variables

The app uses `react-native-dotenv` (a Babel-only plugin with zero native code) to inject environment variables at build time. All variables are imported from the `@env` module.

Create a `.env` file at the project root with the following keys:

```
REVENUECAT_ANDROID_KEY=<your-revenuecat-android-key>
REVENUECAT_IOS_KEY=<your-revenuecat-ios-key>
FIREBASE_SERVER_KEY=<your-firebase-server-key>
STREAM_API_KEY=<your-stream-chat-api-key>
STREAM_API_SECRET=<your-stream-chat-api-secret>
STREAM_APP_ID=<your-stream-chat-app-id>
FACEBOOK_APP_ID=<your-facebook-app-id>
MAIN_DOMAIN=<your-app-domain>
APPLE_APP_ID=<your-apple-app-id>
GOOGLE_PACKAGE_NAME=com.ugccreatorapp
GROQ_API_KEY=<your-groq-api-key>
```

TypeScript declarations for these variables live in `types/env.d.ts`. The Babel plugin is configured in `babel.config.js` under the `module:react-native-dotenv` entry.

---

## Project Structure

```
UGCCreator/
├── App.js                     # Root component, provider hierarchy
├── index.js                   # App registry entry point
├── babel.config.js            # Babel config (RN preset + dotenv plugin)
├── metro.config.js            # Metro bundler configuration
├── firebase.json              # Firebase emulator/deploy config
├── app.json                   # App display name
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
│
├── config/                    # App-level configuration
│   ├── index.js               # Central config (RevenueCat, Stream, etc.)
│   └── defaultFeatures/       # Default JSON data for features
│       ├── index.js            # Aggregates all defaults
│       ├── features.json       # Feature toggles
│       ├── platformBrands.json # Seeded brand data
│       ├── subscriptionBenefits.json
│       └── ...                 # Other default configs
│
├── src/
│   ├── config/                # Runtime configs
│   │   └── aiConfig.js        # Groq API key export
│   │
│   ├── navigation/            # React Navigation setup
│   │   ├── MainNavigator.js   # Root navigator (auth gating)
│   │   ├── ScreenNames.js     # All screen name constants
│   │   ├── auth/              # Auth flow stack
│   │   ├── app/               # Creator tab navigator + stacks
│   │   ├── brands/            # Brand tab navigator + stacks
│   │   ├── chats/             # Shared chat stack
│   │   ├── creatorTools/      # Creator tools stack
│   │   └── subscription/      # Paywall stack
│   │
│   ├── screens/               # ~157 screen components
│   │   ├── auth/              # Login, SignUp, ResetPassword
│   │   ├── onboarding/        # Welcome, Onboarding, Education
│   │   ├── app/               # Creator screens
│   │   │   ├── home/          # Home, brands, projects, deals
│   │   │   ├── explore/       # Browse brands and projects
│   │   │   ├── feeds/         # Content feeds
│   │   │   ├── offers/        # Challenges and current projects
│   │   │   ├── courses/       # Learning modules
│   │   │   └── profile/       # Portfolio, settings, AI tools, media kit
│   │   ├── brands/            # Brand screens
│   │   │   ├── admin/         # Admin panel, project management
│   │   │   ├── profile/       # Brand profile editing
│   │   │   ├── events/        # Brand events management
│   │   │   └── creators/      # Browse creator profiles
│   │   ├── chats/             # Chat rooms and messaging
│   │   ├── subscriptions/     # Paywall and purchase hooks
│   │   └── webview/           # In-app browser
│   │
│   ├── components/            # ~70 reusable components
│   │   ├── cards/             # BrandCard, OfferCard, StatsCard, etc.
│   │   ├── carousels/         # Generic and specialized carousels
│   │   ├── header/            # Header options and buttons
│   │   ├── icons/             # Dynamic icon components
│   │   ├── modals/            # BrandDetail, SampleWork, Challenges, etc.
│   │   ├── tabs/              # Tab bar button and label
│   │   └── ...                # Wrapper, Loading, Button, Avatar, etc.
│   │
│   ├── hooks/                 # ~42 custom hooks
│   │   ├── auth/              # useAppleAuth, useAuthContext, useAuthState
│   │   ├── brands/            # useBrands, useEvents, useSeedBrands, etc.
│   │   ├── chats/             # useChatMessages, useChatRooms
│   │   ├── creatorTools/      # useAITools
│   │   ├── featureFlags/      # useFeatureFlags
│   │   ├── imageUpload/       # Firebase Storage hooks
│   │   ├── notifications/     # FCM token, permissions, interactions
│   │   ├── subscription/      # useSubscriptionConfig
│   │   ├── user/              # useProfile
│   │   └── ...                # useTranslation, useAppReview, etc.
│   │
│   ├── context/               # React Context providers
│   │   ├── AuthProvider.js    # Auth state, profile CRUD
│   │   ├── ProjectsProvider.js# Projects and enrollment
│   │   ├── ChatsProvider.js   # Real-time messaging
│   │   ├── ProjectApplicationProvider.js
│   │   ├── FeatureFlagsContext.tsx  # Remote Config flags
│   │   └── core/              # Core app config provider
│   │
│   ├── i18n/                  # Internationalization
│   │   ├── index.js           # i18next setup
│   │   └── locales/           # en, de, fr, es, pt-BR, pt-PT
│   │
│   ├── theme/                 # Design system tokens
│   │   ├── Colors.js          # Full color palette
│   │   ├── Layout.ts          # Dimensions, spacing, radii
│   │   └── Shadow.js          # Shadow presets
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── brandApplications.ts
│   │   ├── brandApplicationNotifications.ts
│   │   ├── courses.js
│   │   ├── courseTranslations.js
│   │   └── sampleWorks.ts
│   │
│   ├── Utils/                 # Platform helpers
│   │   ├── Platform.js
│   │   └── getResponsiveSize.js
│   │
│   └── consts/                # App constants
│
├── functions/                 # Firebase Cloud Functions
│   ├── index.js               # Function exports
│   ├── helpers/               # FCM helpers
│   └── scheduled/             # Scheduled notification logic
│
├── fastlane/                  # Deployment automation
│   ├── Fastfile               # iOS and Android lanes
│   ├── Appfile                # App identifiers
│   └── Matchfile              # Certificate management
│
├── assets/                    # Static assets
│   ├── fonts/                 # 23 custom font files
│   ├── images/                # PNGs and JPGs
│   ├── svgs/                  # 22 SVG components
│   └── docs/                  # Documentation assets
│
├── android/                   # Android native project
├── ios/                       # iOS native project
├── patches/                   # patch-package patches
├── scripts/                   # Build/utility scripts
├── types/                     # TypeScript type declarations
│   └── env.d.ts               # @env module types
└── __tests__/                 # Test files
```

---

## Architecture Overview

### Provider Hierarchy

The app wraps the entire component tree in a nested provider structure defined in `App.js`:

```
AuthProvider                      ← Firebase Auth state
  → FeatureFlagProvider           ← Remote Config values
    → CoreProvider                ← App configuration
      → SubscriptionProvider      ← RevenueCat purchases
        → ProjectsProvider        ← Firestore projects CRUD
          → ProjectApplicationProvider
            → ActionSheetProvider ← Bottom sheet actions
              → NavigationContainer
                → ChatsProvider   ← Real-time messaging
                  → MainNavigator ← Root routing
```

### Dual User Types

The app serves two distinct user personas with separate navigation trees:

**Creators** get access to brand discovery, project enrollment, AI content tools, courses, portfolio management, and a subscription paywall. **Brands** get an admin panel for managing projects, browsing creators, posting events, and messaging.

The `MainNavigator` determines which experience to render based on the authenticated user's `profile.type` field (`"creator"` or `"brand"`) and their subscription status:

- Creator + subscribed: `AppStack` (full creator experience)
- Creator + no subscription: `SubscriptionStack` (paywall)
- Brand (any): `BrandsStack` (full brand experience)
- Unauthenticated: `AuthStack` (login / signup)

### Data Flow

Firestore is the primary data store. Feature flags come from Firebase Remote Config with JSON defaults as fallback. The `brands` collection in Firestore is the unified source of truth for all brand data (migrated from JSON files and Remote Config). Brand account signups write to both the `users` and `brands` collections to keep the directory in sync.

---

## Navigation

### Screen Names

All route names are centralized in `src/navigation/ScreenNames.js` as exported constants. Always import from this file rather than using string literals.

### Creator Navigation (AppStack)

Bottom tab navigator with five tabs:

| Tab | Stack | Icon | Key Screens |
|---|---|---|---|
| Home | HomeStack | Home | Home, BrandsScreen, PlatformBrandsScreen, BrandDeals, BrandApplications, AffiliateBrands, ProjectDetails, ChallengeDetails |
| Challenges | ChallengesStack | Trophy | Challenges list, ChallengeDetails |
| Chats | ChatsStack | Chat | ChatRooms, ChatRoom, SupportChat |
| Level Up | CoursesStack | LevelUp | Courses list, CourseDetails |
| Portfolio | ProfileStack | Profile | Portfolio, Settings, UGC AI, ScriptsGenerator, MediaKit, UpdatePortfolio |

Modal screens (presented over tabs): Subscription, Events, FavoriteEvents, EventDetails, SampleDetails, WebView.

### Brand Navigation (BrandsStack)

Bottom tab navigator with four tabs:

| Tab | Stack | Icon | Key Screens |
|---|---|---|---|
| Admin | AdminPanelStack | Home | AdminPanel, AddProject, BrandProjects, BrandProjectDetails, CreatorProjectStatus, BrandOffers |
| Explore | CreatorsProfilesStack | People | CreatorProfiles, CreatorProfile details |
| Chats | ChatsStack | Chat | ChatRooms, ChatRoom, SupportChat |
| Profile | BrandsProfileStack | Profile | BrandProfile, UpdateBrandProfile, Settings |

Modal screens: Subscription, UpdateBrandProfile, BrandEvents, AddEvent, ActiveCreators, SampleDetails, WebView.

### Auth Navigation (AuthStack)

Linear flow: Welcome → Onboarding → OnboardingEducation → SignUp/Login → ForgotPassword. Includes a WebView screen for external links (terms, privacy).

---

## Feature Modules

### Brand Discovery

Creators can browse brands in multiple ways. The home screen features carousels for platform brands, affiliate brands, trending categories, and brand deals. The `PlatformBrandsScreen` and `BrandsScreen` provide full-list views with search (powered by Fuse.js) and category filtering. All brand data is fetched from the Firestore `brands` collection via the `useBrands` hook.

### Projects and Challenges

Brands create projects that creators can enroll in. The `ProjectsProvider` context manages the full lifecycle including creation, enrollment, status tracking, and creator management. Challenges are time-bound content competitions with submission tracking and leaderboards.

### AI Content Tools

Creators have access to three AI-powered tools, all driven by the `useAITools` hook which calls the Groq API (LLaMA 3.1 models):

- **Scripts Generator**: Produces UGC video scripts based on brand/product info (220 token limit)
- **Content Suggester**: Suggests content ideas and angles (140 token limit)
- **Hooks Generator**: Creates attention-grabbing opening hooks (120 token limit)

Rate limits: 8 requests per day, 12-second cooldown between requests. Results are cached locally for 7 days (max 15 entries) and history is persisted in AsyncStorage (max 20 items).

### Courses (Level Up)

Educational content for creators stored in Firestore. Courses have weekly structures with tasks, progress tracking, and pro tips. The system supports course translations and admin-only seeding functionality.

### Portfolio and Media Kit

Creators build their portfolio with sample work, rates, categories, and brands worked with. The `MediaKitScreen` renders a PDF media kit via `react-native-pdf`. Portfolio images are managed through Firebase Storage hooks (`useImageStorage`).

### Chat System

Real-time messaging between creators and brands using a combination of Firestore (chat rooms, message persistence) and the Gifted Chat UI. The `ChatsProvider` manages room creation/deletion, message state, and unread counts. A dedicated support chat flow is also available.

### Events

Brands can create and manage events. Creators can browse events, view details, and save favorites. Events have their own CRUD operations within the brand admin panel.

### Brand Deal Search

The `userGeneratedContentBrandDealsSearch` cloud function provides a free public API that searches external job boards (via the Remotive API) for UGC-related opportunities, normalizes the results, and identifies platform-specific content (TikTok, Instagram, YouTube).

---

## State Management

The app uses React Context for global state rather than a dedicated state management library. There are six context providers:

| Provider | Purpose | Key State |
|---|---|---|
| AuthProvider | User authentication and profile | user, profile, loading, profile completion ratio |
| FeatureFlagProvider | Firebase Remote Config values | Dynamic config object from Remote Config |
| CoreProvider | App-level configuration | Config values from `config/index.js` |
| SubscriptionProvider | RevenueCat purchase state | Entitlements, packages, subscription status |
| ProjectsProvider | Projects CRUD and enrollment | projects, allProjects, enrolledProjects |
| ChatsProvider | Real-time messaging | chatRooms, messages, unread counts |

Local component state is managed with `useState` and `useReducer` hooks. AsyncStorage is used for persistent flags (seeding status, language preference, AI tool cache/quotas).

---

## Firebase Services

The app uses the `@react-native-firebase` modular SDK (v23.5.x). All Firebase imports use the modular API pattern (e.g., `getFirestore()`, `collection()`, `doc()`).

| Service | Usage |
|---|---|
| **Auth** | Email/password, Apple Sign-In, Facebook Login. `onAuthStateChanged` listener in `AuthProvider`. |
| **Firestore** | Primary database. Collections: `users`, `brands`, `projects`, `courses`, `chatRooms`, `messages`, and more. Security rules require `request.auth != null` for reads and writes. |
| **Storage** | Profile images, portfolio media, sample work uploads. Managed via `useFirebaseSetStorage`, `useFirebaseGetStorage`, `useFirebaseDeleteStorage`. |
| **Remote Config** | Feature flags and dynamic configuration. Defaults in `config/defaultFeatures/`. Consumed via `useFeatureFlags` hook. |
| **Cloud Messaging** | Push notifications via FCM. Token management in `useFCMToken`. Local notification display via Notifee. |
| **Analytics** | Event tracking integrated via `useTrackEvent` hook. |
| **Crashlytics** | Automatic crash reporting. |
| **Cloud Functions** | Server-side logic (see Cloud Functions section). |

### Firestore Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | User accounts (creators and brands) | type, name, email, fcmToken, profile data |
| `brands` | Unified brand directory | name, email, link, category, description, isActive, isBlocked, source, ownerId |
| `projects` | Brand campaigns/projects | title, description, brand info, status, enrolled creators |
| `courses` | Educational content | title, weeks, tasks, translations |
| `chatRooms` | Chat room metadata | participants, lastMessage, timestamps |

The `brands` collection is the single source of truth. It contains both platform-seeded brands (`source: "migration"`) and brands who signed up through the app (`source: "account"`). The `useSeedBrands` hook performs a one-time migration from `platformBrands.json` into Firestore on first authenticated load.

---

## Cloud Functions

Deployed to Firebase Cloud Functions (Node.js). Source code is in `functions/`.

### sendPushNotification (HTTPS)

Protected endpoint requiring a Firebase ID token as a Bearer token. Sends a push notification via the FCM v1 API. Accepts `token`, `title`, `body`, and `data` parameters.

### userGeneratedContentBrandDealsSearch (HTTPS, public)

Free GET endpoint that searches external job boards for UGC opportunities. Accepts optional `keywords` and `page` query parameters. Returns normalized lead objects with platform detection (TikTok, Instagram, YouTube). Default keywords include UGC, creator, influencer, and social media.

### Scheduled Functions

Three scheduled functions send periodic push notifications to creators: `scheduledBrandsCatalogueNotification`, `scheduledBrandsHiringNotification`, and `scheduledChallengesNotification`. These use the `getCreatorsWithTokens` and `sendBatchNotifications` helpers from `functions/helpers/fcm.js`.

---

## AI Integration

AI features are powered by the **Groq API** using LLaMA models. The configuration lives in `src/config/aiConfig.js` (API key from `.env`) and the core logic is in `src/hooks/creatorTools/useAITools.js`.

### Model Selection

Primary model: `llama-3.1-8b-instant`. Fallback: `llama3-8b-8192`. These are fast inference models suitable for short-form content generation.

### Rate Limiting and Caching

- 8 daily requests per user (tracked via AsyncStorage with date-based reset)
- 12-second cooldown between consecutive requests
- 7-day local cache with a maximum of 15 entries
- Generation history persisted to AsyncStorage (20 items max)

### Tool Types

Each tool type has a different max token limit to produce appropriately-sized outputs: Scripts (220 tokens), Hooks (120 tokens), and Default/Content suggestions (140 tokens).

---

## Subscriptions and Monetization

In-app subscriptions are managed through **RevenueCat** (`react-native-purchases`). The subscription flow gates the creator experience: creators without an active subscription see `SubscriptionStack` (paywall) instead of the main app.

Key hooks in `src/screens/subscriptions/`:

- `useHasSubscription` - checks entitlement status
- `useAvailablePackages` - fetches available plans
- `usePurchase` - handles purchase flow
- `useRestorePurchases` - restores previous purchases
- `useSubscriptionInfo` - detailed subscription metadata
- `useUserCurrency` - currency detection for localized pricing

Platform keys (Android/iOS) are configured in `config/index.js` from environment variables. Subscription benefits are defined in `config/defaultFeatures/subscriptionBenefits.json` with localized variants for each supported language.

---

## Internationalization

The app supports six languages using `i18next` and `react-i18next`:

| Language | Code | Flag |
|---|---|---|
| English | en | US |
| German | de | DE |
| French | fr | FR |
| Spanish | es | ES |
| Portuguese (Brazil) | pt-BR | BR |
| Portuguese (Portugal) | pt-PT | PT |

Configuration is in `src/i18n/index.js`. Translation files are in `src/i18n/locales/`. The app detects the device language on first launch and persists the user's choice in AsyncStorage under the key `@ugc_creator_language`. The user's language preference is also stored on their Firestore profile.

Use the `useTranslation` hook (from `src/hooks/useTranslation.js`) to access the `t()` function in any component:

```javascript
const { t } = useTranslation();
// Usage: t('tabs.home'), t('screens.settings.title'), etc.
```

Helper functions available from the i18n module: `changeLanguage(code)`, `getCurrentLanguage()`, `getLanguageInfo()`.

---

## Push Notifications

Push notifications use Firebase Cloud Messaging (FCM) for delivery and Notifee for local notification display and channel management.

### Hooks

- `useFCMToken` - registers and manages the device FCM token
- `useNotificationPermissions` - requests notification permission on tab load
- `useNotificationInteraction` - handles notification tap actions and deep linking
- `useNotifications` - sends notifications via the `sendPushNotification` cloud function

### Flow

1. On app launch, `useNotificationPermissions` requests permission
2. `useFCMToken` obtains a token and stores it on the user's Firestore document
3. When a notification needs to be sent (e.g., new chat message), the app calls the `sendPushNotification` cloud function with the recipient's FCM token
4. The cloud function authenticates the request and sends via the FCM v1 API
5. Scheduled cloud functions send batch notifications for brand catalogues, hiring updates, and challenges

---

## Theming

Design tokens are centralized in `src/theme/`:

### Colors (`Colors.js`)

The color palette includes brand colors (`BRAND_BLUE: #A5C4FD`, `PRIMARY: #56CCF2`), a full grayscale range (GRAY_50 through GRAY_900), semantic colors for success/error/warning states, and a complete Tailwind-inspired extended palette. Opacity variants are available via suffixes like `_10`, `_20`, `_50`, etc.

### Layout (`Layout.ts`)

Provides responsive constants: `SCREEN_HEIGHT`, `SCREEN_WIDTH`, device detection flags (`IS_SMALL_DEVICE`, `IS_SHORT_DEVICE`, `IS_ANDROID`), and a spacing/sizing scale from `SPACE_XSMALL` (5) to `SPACE_XXLARGE` (35). Border radii range from `RADIUS_XSMALL` (5) to `RADIUS_XXLARGE` (30).

### Shadow (`Shadow.js`)

Platform-aware shadow presets (`shadowStyle.default`, `shadowStyle.card`) with Android elevation fallback.

---

## Testing

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage
```

Tests use **Jest** (v29) with `react-test-renderer`. The configuration lives in `jest.config.js`.

---

## Deployment

CI/CD is automated with **GitHub Actions** and **Fastlane**. Merging to `main` triggers both iOS and Android builds automatically.

- **iOS**: Built on `macos-latest` runner, uploaded to TestFlight via App Store Connect API
- **Android**: Built on `ubuntu-latest` runner, uploaded to Google Play internal track

### App Identifiers

| Platform | Identifier |
|---|---|
| iOS | `com.ugccreator.app` |
| Android | `com.ugccreatorapp` |

### Current Version

Android: 2.1.8 (versionCode 76). Build numbers are incremented automatically by Fastlane.

### Quick Commands

```bash
# iOS - build and upload to TestFlight
bundle exec fastlane ios release

# Android - build and upload to Play Store internal track
bundle exec fastlane android release
```

### GitHub Secrets Required

**iOS**: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT`, `MATCH_GIT_URL`, `MATCH_PASSWORD`, `APPLE_ID`, `APPLE_TEAM_ID`, `ITC_TEAM_ID`, `KEYCHAIN_PASSWORD`

**Android**: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `GOOGLE_PLAY_JSON_KEY`

For full deployment setup instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Handover Checklist

When transferring this app to a new owner:

1. Transfer Apple Developer account (or add new owner as Admin)
2. Transfer Google Play Console app
3. Transfer GitHub repository
4. New owner creates their own App Store Connect API key
5. New owner creates their own Google Play service account
6. New owner creates a new private repo for Match certificates
7. New owner runs `fastlane match nuke appstore` then `fastlane match appstore`
8. New owner updates all GitHub Secrets
9. New owner updates Firebase project ownership
10. New owner updates RevenueCat, Stream Chat, and Facebook app credentials
11. New owner copies `.env.example` to `.env` and fills in their values

---

## Troubleshooting

**Pod install fails**: Run `bundle exec pod install --repo-update`. The Podfile requires `use_frameworks! :linkage => :static` for Firebase compatibility. Do not change this.

**ESLint parsing errors**: The `.eslintrc.json` uses `@babel/eslint-parser` with a relative config path (`./babel.config.js`). If you move the project, ESLint should still resolve correctly.

**Firestore composite index errors**: The app avoids composite indexes by doing filtering and sorting client-side. If you add new Firestore queries with `where()` + `orderBy()`, you may need to create indexes via the Firebase Console.

**iOS build signing issues**: Run `bundle exec fastlane match appstore --force` to regenerate certificates.

**Android keystore issues**: Verify the base64 encoding with `base64 -i your-key.jks | base64 -d > test.jks` and compare file sizes.

---

*Built with React Native 0.81.0. Last updated April 2026.*
