import DayView from "@/components/DayView"
import { ThemedButton, ThemedText, ThemedView } from "@/components/ThemedComponents"
import { styles } from "@/lib/style/style"
import { router, useLocalSearchParams } from "expo-router"


export default function Day() {
  const params = useLocalSearchParams<{datestamp: string}>()

  return (
    <ThemedView className="bg-white dark:bg-zinc-800 m-auto w-96 h-64 box-border p-5">
      {/*header*/}
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
