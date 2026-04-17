import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="[day]/[timestamp]/index" />
      <Stack.Screen name="[day]/[timestamp]/create" options={{presentation: "transparentModal"}}/>

      <Stack.Screen name="[id]/confirm_delete" options={{presentation: "transparentModal"}}/>
      <Stack.Screen name="[id]/update" options={{presentation: "transparentModal"}}/>
      <Stack.Screen name="[id]/update_or_delete" options={{presentation: "transparentModal"}}/>
    </Stack>
  )
}
