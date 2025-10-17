import { ThemedView, ThemedText, ThemedInput, ThemedButton } from "@/components/ThemedComponents";
import { colors } from "@/lib/color/color";
import { TaskTemplate, useTaskIndex } from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { Pressable, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const db = useSQLiteContext();
  const {colorScheme} = useColorScheme();
  const tasks = useTaskIndex(state => state.tasks);
  const addTask = useTaskIndex(state => state.createTask);
  const [task, setTask] = useState<TaskTemplate>({
    id: -1,
    color: "",
    title: "",
    description: "",
    timestamp: undefined,
    duration: undefined,
    native: true,
  })

  const [status, setStatus] = useState("");
  const submit = async () => {
    if (!task.title.length && !task.description.length && !task.color.toString().length) {
      setStatus("unfilled");
      return
    }
    if (tasks.find(t => t.title == task.title)) {
      setStatus("same title");
      return;
    }

    await addTask(db, task);
    setTask({...task, title: "", description: "", color: ""})
  }
  return (
    <SafeAreaView className="">
      <ThemedView reset>
        <Pressable onPressOut={() => router.back()} className="flex flex-col justify-start items-center fixed w-full h-full z-0">
            <Pressable onPressOut={(e) => e.stopPropagation()} className="z-1 mt-20 flex flex-col justify-start py-5 px-7 bg-zinc-100 dark:bg-zinc-900 box-border rounded-xl w-3/4 aspect-3/4">
              <ThemedText>Create Task: </ThemedText>
              <ThemedText>title: </ThemedText>
              <ThemedInput value={task.title} onChangeText={(s) => {setTask({...task, title: s})}}/>
              <ThemedText>description: </ThemedText>
              <ThemedInput value={task.description} onChangeText={(s) => setTask({...task, description: s})}/>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <ThemedView className="flex-row flex-1 py-2 my-2">
                {
                  colors.map((c, index) => (
                    <TouchableOpacity 
                    onPressOut={() => setTask({...task, color: c})}
                    key={index.toString()}
                    >
                      <ThemedView className="w-6 h-6 m-2 rounded-full" style={[{backgroundColor: c, outlineColor: "white", outlineOffset: 2}, task.color === c ? {outlineWidth: 2} : {}]}>
                    </ThemedView>
                    </TouchableOpacity>
                  ))
                }
                </ThemedView>
              </ScrollView>

              <ThemedText>{status}</ThemedText>
              <ThemedButton onPressOut={submit} className="rounded-md">
                <ThemedText className="text-white dark:text-black text-center">Submit</ThemedText>
              </ThemedButton>
          </Pressable>
        </Pressable>
      </ThemedView>
    </SafeAreaView>

  )
}
