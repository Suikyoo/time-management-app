import TaskCard from "@/components/TaskCard";
import {ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {colors} from "@/lib/color/color";
import {Task, TaskTemplate, useTaskIndex, useTaskList, useTaskTarget} from "@/lib/task/task";
import {useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";
import {useState} from "react";
import {FlatList, ScrollView} from "react-native";
import {Button, TextInput, TouchableOpacity, View, Text,} from "react-native";

export default function Index() {
  const db = useSQLiteContext();
  const tasks = useTaskIndex(state => state.tasks);
  const addTask = useTaskIndex(state => state.createTask);

  const {colorScheme} = useColorScheme();

  const [task, setTask] = useState<TaskTemplate>({title: "", description: "", color: "", native: true, id: -1})
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
    setTask({title: "", description: "", color: "", native: true, id: -1})
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView className="p-5 box-border bg-zinc-100 dark:bg-zinc-950" inherited="text-black dark:text-white">
        <ThemedView>
        {
          tasks.map(t => (
            <TaskCard task={t} key={t.id.toString()} className="w-full p-5 my-5 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
          ))
        }
        </ThemedView>

        <ThemedView className="flex flex-col justify-start p-5 bg-zinc-950 dark:bg-zinc-800 box-border rounded-xl">
          <ThemedText>title: </ThemedText>
          <ThemedInput onChangeText={(s) => setTask({...task, title: s})}/>
          <ThemedText>description: </ThemedText>
          <ThemedInput onChangeText={(s) => setTask({...task, description: s})}/>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ThemedView className="flex-row flex-1 py-2 my-2">
              {
                colors.map((c, index) => (
                <TouchableOpacity 
                onPressOut={() => setTask({...task, color: c})}
                key={index.toString()}
                >
                  <ThemedView className="w-6 h-6 m-2 border-2 border-white rounded-full" style={{backgroundColor: c}}>
                  </ThemedView>
                </TouchableOpacity>
                ))
              }
            </ThemedView>
          </ScrollView>

          <Text>{status}</Text>
          <Button title="submit" onPress={submit}/>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );

}
