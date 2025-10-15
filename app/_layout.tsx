import {migrateDB} from "@/lib/db/db";
import { Stack } from "expo-router";
import {SQLiteProvider} from "expo-sqlite";

import "@/app.css"
import {ExtendedStackNavigationOptions} from "expo-router/build/layouts/StackClient";
import {SafeAreaProvider} from "react-native-safe-area-context";

const pageModal: ExtendedStackNavigationOptions = { headerBackButtonDisplayMode: "minimal", presentation: "modal"}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="main.db" onInit={migrateDB}>
        <Stack screenOptions={{headerShown: false}} />
      </SQLiteProvider>
    </SafeAreaProvider>
      );
}
