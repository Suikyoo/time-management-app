import Input from "@/components/Input";
import TaskCard from "@/components/TaskCard";
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
  }

  return (
    <View className="text-white dark:bg-slate-900">
      <FlatList data={tasks} keyExtractor={t => t.id.toString()} renderItem={t => <TaskCard task={t.item}/>}/>
      <View className="p-5 dark:text-white bg-slate-900 box-border">
        <Text>title: </Text>
        <Input onChangeText={(s) => setTask({...task, title: s})}/>
        <Text>description:</Text>
        <Input onChangeText={(s) => setTask({...task, description: s})}/>

        <ScrollView horizontal className="flex-1 h-5">
          <View className="flex-row flex-1 h-1">
            {
              colors.map((c, index) => (
              <TouchableOpacity 
              onPressOut={() => setTask({...task, color: c})}
              key={index.toString()}
              >
                <View className="w-10 h-10 m-2 rounded-full" style={{backgroundColor: c}}>
                </View>
              </TouchableOpacity>
              ))
            }
          </View>
        </ScrollView>

        <Text>{status}</Text>
        <Button title="submit" onPress={submit}/>
      </View>
    </View>
  );

}
