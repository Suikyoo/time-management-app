import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="[datestamp]/index" />
      <Stack.Screen name="[datestamp]/create" options={{presentation: "transparentModal"}}/>
      <Stack.Screen name="[id]/confirm_delete" options={{presentation: "transparentModal"}}/>
      <Stack.Screen name="[id]/update" options={{presentation: "transparentModal"}}/>
    </Stack>
  )
}
