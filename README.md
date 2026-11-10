# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Backend connection

The app connects to the API at port `5167`. By default, it uses the host running
Expo during development. For a physical device or a different backend host, set
`EXPO_PUBLIC_API_URL` to the backend origin (for example,
`http://192.168.1.10:5167`, without `/api`) and restart Expo. The device and
backend must be reachable on the same network.

Account settings support Vietnamese and English, plus USD and VND display. Prices
returned by the API are treated as USD; VND display uses the latest USD/VND rate
from ExchangeRate-API, cached until its published next-update time. A network
connection is required to fetch a fresh rate. Language and currency preferences
are stored on the device.

Notification categories (booking updates, trip reminders, and promotions) are
also stored on the device. They do not filter server-delivered notifications
until the backend provides category-specific preference support. Push and email
notification switches continue to use the account API.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
