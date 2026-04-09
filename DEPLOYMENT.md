# UGCCreator - Deployment Guide

## Overview

This project uses **Fastlane** + **GitHub Actions** for automated builds and deployments. When code is merged to `main`, both iOS and Android builds are triggered automatically.

- iOS builds are uploaded to **TestFlight** via App Store Connect API
- Android builds are uploaded to the **internal track** on Google Play via a service account

## Architecture

```
Push to main
    |
    +---> .github/workflows/ios-deploy.yml
    |         |
    |         +---> fastlane ios release
    |                   |
    |                   +---> Match (fetch certificates)
    |                   +---> Increment build number
    |                   +---> Build .ipa
    |                   +---> Upload to TestFlight
    |
    +---> .github/workflows/android-deploy.yml
              |
              +---> fastlane android release
                        |
                        +---> Increment versionCode
                        +---> Build .aab (signed)
                        +---> Upload to Play Store (internal)
```

## Prerequisites

### Accounts Required

1. **Apple Developer Account** with App Store Connect access
2. **Google Play Console** account with the app already published
3. **GitHub** repository (paid plan for macOS runner minutes)

### Tools (local development only)

- Ruby (>= 2.6.10, recommended 3.2.x via rbenv)
- Bundler (`gem install bundler`)
- Node.js (>= 18)
- Yarn
- Xcode (latest stable)
- Android Studio with SDK

## Setup Instructions

### Step 1: Install Fastlane and dependencies

```bash
bundle install
```

### Step 2: Set up iOS code signing with Match

Match stores your certificates and provisioning profiles in a private Git repository so any machine (including CI) can build the app.

1. Create a **private** GitHub repo (e.g. `ugccreator-certificates`)
2. Run Match to generate certificates:

```bash
bundle exec fastlane match init
# Choose "git" storage
# Enter URL of your private certificates repo

bundle exec fastlane match appstore
# This creates App Store certificates and profiles
# You'll be prompted for a passphrase — save it as MATCH_PASSWORD
```

### Step 3: Generate App Store Connect API key

1. Go to [App Store Connect > Users and Access > Integrations > App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api)
2. Click **Generate API Key** (must be a Team Key, not Individual)
3. Give it "App Manager" role
4. Download the `.p8` file
5. Note the **Key ID** and **Issuer ID** shown on the page
6. Base64 encode the key file:

```bash
base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy
# This copies the base64 content to your clipboard
```

### Step 4: Set up Google Play service account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a service account with the "Service Account User" role
3. Generate a JSON key for the service account
4. In Google Play Console, go to **Settings > API access**
5. Link the service account and grant "Release manager" permissions

### Step 5: Configure GitHub Secrets

Go to your GitHub repo > Settings > Secrets and variables > Actions, and add:

**iOS Secrets:**

| Secret Name | Description |
|---|---|
| `ASC_KEY_ID` | App Store Connect API Key ID |
| `ASC_ISSUER_ID` | App Store Connect Issuer ID |
| `ASC_KEY_CONTENT` | Base64-encoded `.p8` key file content |
| `MATCH_GIT_URL` | URL of your private certificates repo (e.g. `https://github.com/org/ugccreator-certificates.git`) |
| `MATCH_PASSWORD` | Passphrase you set during `fastlane match init` |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_TEAM_ID` | Your Apple Developer Team ID (XW576HXDLG) |
| `ITC_TEAM_ID` | Your App Store Connect Team ID (often same as Team ID) |
| `KEYCHAIN_PASSWORD` | Any random string (used to create a temporary keychain on CI) |

**Android Secrets:**

| Secret Name | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded upload keystore: `base64 -i your-upload-key.jks \| pbcopy` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias in the keystore |
| `ANDROID_KEY_PASSWORD` | Key password |
| `GOOGLE_PLAY_JSON_KEY` | Full JSON content of the Google Play service account key |

### Step 6: Test locally (optional)

```bash
# iOS — build and upload to TestFlight
bundle exec fastlane ios release

# Android — build and upload to Play Store internal track
bundle exec fastlane android release
```

## How Deployments Work

1. Developer merges a PR to `main`
2. GitHub Actions triggers both workflows
3. iOS workflow runs on `macos-latest`, Android on `ubuntu-latest`
4. Fastlane increments build numbers automatically
5. Builds are uploaded to TestFlight / Play Store internal track
6. You can then promote from TestFlight / internal track to production via the respective consoles

## Manual Trigger

Both workflows support `workflow_dispatch`. Go to GitHub > Actions > select the workflow > "Run workflow" to trigger manually.

## Handover Checklist

When transferring this app to a new owner:

- [ ] Transfer Apple Developer account (or add new owner as Admin)
- [ ] Transfer Google Play Console app
- [ ] Transfer GitHub repository
- [ ] New owner creates their own App Store Connect API key (Step 3)
- [ ] New owner creates their own Google Play service account (Step 4)
- [ ] New owner creates a new private repo for Match certificates
- [ ] New owner runs `fastlane match nuke appstore` then `fastlane match appstore` to generate fresh certificates
- [ ] New owner updates all GitHub Secrets (Step 5)
- [ ] New owner updates Firebase project ownership
- [ ] New owner updates RevenueCat, Stream Chat, and Facebook app credentials
- [ ] New owner copies `.env.example` to `.env` and fills in their values

## Troubleshooting

**iOS build fails with signing error:**
Run `bundle exec fastlane match appstore --force` to regenerate certificates.

**Android build fails with keystore error:**
Verify the base64 encoding: `base64 -i your-key.jks | base64 -d > test.jks` and compare sizes.

**GitHub Actions runner out of minutes:**
macOS minutes count as 10x. A typical iOS build takes ~20 minutes = 200 macOS minutes. With GitHub Team plan's 3,000 minutes/month, you get ~15 iOS builds/month. Android runs on Ubuntu (1x multiplier) so it's essentially free.

## Cost

- Fastlane: free (open source)
- GitHub Actions: included with your paid GitHub plan (3,000 min/month on Team)
- Match: free (uses a private Git repo you own)
- Total additional cost: **$0**
