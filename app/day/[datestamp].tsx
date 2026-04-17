import DayView from "@/components/DayView"
import { ThemedButton, ThemedText, ThemedView } from "@/components/ThemedComponents"
import { styles } from "@/lib/style/style"
import { router, useLocalSearchParams } from "expo-router"


export default function Day() {
  const params = useLocalSearchParams<{datestamp: string}>()

  return (
    <ThemedView className="bg-white dark:bg-zinc-800 m-auto w-3/4 h-80 box-border p-5">
      <ThemedView>
        <ThemedView className="flex flex-row">
          <ThemedButton className="w-8 mr-2" onPressOut={() => router.back()}>
            <ThemedText> &lt; </ThemedText>
          </ThemedButton>
          <ThemedText className="dark:!text-white">Go Back</ThemedText>
        </ThemedView>
      </ThemedView>

      <DayView date={new Date(params.datestamp)} className="p-2 box-border rounded-lg " style={styles.shadow}/>
    </ThemedView>
  )
}
