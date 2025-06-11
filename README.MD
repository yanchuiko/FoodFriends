# FoodFriends – Setup Guide

Welcome to **FoodFriends**, a mobile food social media network for sharing your cooking experiences with friends.

This guide will help you set up and run the app on your local machine.

---

## Requirements

Before running the project, make sure the following are installed:

- [Node.js (LTS version)](https://nodejs.org/) – includes `npm`
- [Git](https://git-scm.com/) – to clone the repository
- [Expo Go SDK 52](https://expo.dev/go) – for running the app on mobile devices

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yanchuiko/FoodFriends.git
cd FoodFriends
```

### 2. Environment Variables

- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Add a new Web App in Firebase and copy the credentials
- Create a `.env` file in your project root using those values

### 3. Firebase Configuration

#### Security Rules

Copy the following Firebase security rules into your Firebase Console:

- **Firestore Rules:** Paste from `rules/firestore.rules`
- **Storage Rules:** Paste from `rules/storage.rules`

#### Firestore Composite Indexes

To enable proper querying, create these indexes in **Firestore > Indexes > Composite**:

1. **Collection:** `posts`
   - `userId` (Ascending)
   - `createdAt` (Descending)
   - `__name__` (Descending)
2. **Collection:** `chats`
   - `participants` (Array-contains)
   - `updatedAt` (Descending)
   - `__name__` (Descending)

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the App

```bash
npx expo start
```

---

## Running the App

### 1. On a Mobile Simulator/Emulator

- **iOS:**
  - Install Xcode from the Mac App Store
  - Start the iOS Simulator
  - Run:
    ```bash
    npx expo start --ios
    ```
- **Android:**
  - Install Android Studio
  - Set up an Virtual Device Manager
  - Start the emulator
  - Run:
    ```bash
    npx expo start --android
    ```

### 2. On a Physical Mobile Device (Expo Go SDK 52)

- Install the **Expo Go** app:
  - [iOS App Store](https://apps.apple.com/app/apple-store/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Run the command below in your terminal:

  ```bash
  npx expo start
  ```

- Scan the QR code displayed in your terminal or browser:
  - **iOS:** Use the Camera app
  - **Android:** Use the Expo Go app

---

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

---
