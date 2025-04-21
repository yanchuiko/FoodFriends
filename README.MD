# FoodFriends – Setup Guide

Welcome to **FoodFriends**, a mobile food social media network for sharing your cooking experiences with friends.

This guide will help you set up and run the app on your local machine.

## Requirements

Before running the project, make sure the following are installed:

- [Node.js (LTS version)](https://nodejs.org/) – includes `npm`
- [Git](https://git-scm.com/) – to clone the repository

- A code editor like **Visual Studio Code** (optional, but recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yanchuiko/final-project.git
cd FoodFriends
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

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
  - Run `npx expo start --ios`
- **Android**:
  - Install Android Studio
  - Set up an Android Virtual Device
  - Start the emulator
  - Run `npx expo start --android`

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

## 24 Hour Post Feature
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
