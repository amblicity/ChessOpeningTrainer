# Chess Opening Trainer
An app that allows you to train opening theory in Chess. 

Planned release date iOS: March 2024 // Planned release date Android: May 2024

## Roadmap 
- Add UI design
- Add "Show me the lines" functionality
- Add co-piloting for progress
- Add IAP
- Add a Settings-Screen & Imprint

## Maybe
- Add ads(?) & add user-consent
- Add CloudKit (?) & Apple-Login

## Changelog
### 0.4.0
- Adds redux as state management
- Adds redux-persist
- Adds react-navigation

### 0.3.0
- Adds remaining/completed lines logic
- Adds opening selection screen

### 0.2.0
- Adds playing as black/white logic
- Adds different openings

### 0.1.0
- Adds chessboard
- Adds logic to play against a CPU
- Adds King's Indian Defense 

## Getting Started
>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Then (in theory):
You'll need --force for npm installations due to mismatching versions of flipper & redux-debugging

```cd .
npm i --force
npx pod-install ios
npx react-native run-ios --simulator 'iPhone SE (3rd generation)'
```

Then start Flipper-Debugger.
