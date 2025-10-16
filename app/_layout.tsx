import {migrateDB} from "@/lib/db/db";
import { Stack } from "expo-router";
import {SQLiteProvider} from "expo-sqlite";

import "@/app.css"
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="main.db" onInit={migrateDB}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="tasks/template" options={{presentation: "transparentModal"}}/>
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
      );
}
          //<Stack.Screen name="tasks/template" options={{presentation: "transparentModal", contentStyle: {backgroundColor: "transparent"}}}/>
