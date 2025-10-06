import {migrateDB} from "@/lib/db/db";
import { Stack } from "expo-router";
import {SQLiteProvider} from "expo-sqlite";

import "@/app.css"

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="main.db" onInit={migrateDB}>
      <Stack>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="(modals)/day/[datestamp]" options={{presentation: "modal"}}/>
        <Stack.Screen name="(modals)/tasks/index" options={{presentation: "modal"}}/>
      </Stack>
    </SQLiteProvider>
      );
}
