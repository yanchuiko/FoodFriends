# FoodFriends – Setup Guide

Welcome to **FoodFriends**, a mobile food social media network for sharing your cooking experiences with friends.

This guide will help you set up and run the app on your local machine.

## Requirements

Before running the project, make sure the following are installed:

- [Node.js (LTS version)](https://nodejs.org/) – includes `npm`
- [Git](https://git-scm.com/) – to clone the repository
- [Expo Go SDK 52](https://expo.dev/go) – for running the app on mobile devices

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yanchuiko/FoodFriends.git
cd FoodFriends
```

### 2. Environment Variables

- Add a `.env` file from the REPORT

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the App

```bash
npx expo start
```

## Running the App

### 1. On a Physical Mobile Device

- Install the **Expo Go** app from the [App Store](https://apps.apple.com/app/apple-store/id982107779) (iOS) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
- Run the command `npx expo start` in your terminal
- Scan the QR code displayed in your terminal or browser:
  - iOS: Use the Camera app
  - Android: Use the Expo Go app

### 2. On a Mobile Simulator/Emulator

- **iOS**:
  - Install Xcode from the Mac App Store
  - Start the iOS Simulator
  - Run `npx expo start --ios` or `npm run ios` in your terminal
- **Android**:
  - Install Android Studio
  - Set up an Android Virtual Device
  - Start the emulator
  - Run `npx expo start --android` or `npm run android` in your terminal

## Testing

FoodFriends uses Maestro for end-to-end testing.

### 1. Installing Maestro

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

### 2. Running Tests

```bash
# For iOS tests
cd tests/ios/testName
maestro test testName.yaml

# For Android tests
cd tests/android/testName
maestro test testName.yaml
```

## Additional

### 1. Existing Users Credentials

| **Name**      | **Email**        | **Password** |
| ------------- | ---------------- | ------------ |
| Ben Smith     | ben@gmail.com    | ben123       |
| Phoebe Miller | phoebe@gmail.com | phoebe123    |
| Leo Walker    | leo@gmail.com    | leo123       |
| Freya Green   | freya@gmail.com  | freya123     |

### 2. 24 Hour Post Feature

- Go to the 'app/(tabs)/index.tsx' file. Uncomment the "twentyFourHoursAgo" fucntion. Uncomment the "postsQuery" REAL version. Comment the "postsQuery" DEMO version.
- This will allow you to see posts from the last 24 hours.

```javascript
const twentyFourHoursAgo = Timestamp.fromDate(
  new Date(Date.now() - 24 * 60 * 60 * 1000)
);
```

```javascript
const postsQuery = query(
  collection(db, "posts"),
  where("userId", "in", friendIds),
  where("createdAt", ">=", twentyFourHoursAgo),
  orderBy("createdAt", "desc")
);
```
