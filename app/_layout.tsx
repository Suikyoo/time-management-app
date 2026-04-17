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

          <Stack.Screen name="day/[datestamp]" options={{presentation: "modal"}}/>

          <Stack.Screen name="tasks/template" options={{presentation: "modal"}}/>
          <Stack.Screen name="tasks/(tasks)" options={{presentation: "modal"}}/>

          <Stack.Screen name="weekly_tasks/template" options={{presentation: "modal"}}/>
          <Stack.Screen name="weekly_tasks/(weekly_tasks)" options={{presentation: "modal"}}/>

        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
      );
}
          //<Stack.Screen name="tasks/template" options={{presentation: "transparentModal", contentStyle: {backgroundColor: "transparent"}}}/>
