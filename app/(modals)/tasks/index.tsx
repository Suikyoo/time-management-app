import TaskCard from "@/components/TaskCard";
import {colors} from "@/lib/color/color";
import {Task, TaskTemplate, useTaskIndex, useTaskList, useTaskTarget} from "@/lib/task/task";
import {useSQLiteContext} from "expo-sqlite";
import {useState} from "react";
import {FlatList} from "react-native";
import {Button, TextInput, TouchableOpacity, View, Text,} from "react-native";

export default function Index() {
  const db = useSQLiteContext();
  const tasks = useTaskIndex(state => state.tasks);
  const addTask = useTaskIndex(state => state.createTask);

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
    <View>
      <FlatList data={tasks} keyExtractor={t => t.id} renderItem={t => <TaskCard task={t.item}/>}/>

      <View>
        <Text>title: </Text>
        <TextInput onChangeText={(s) => setTask({...task, title: s})}/>
        <Text>description:</Text>
        <TextInput onChangeText={(s) => setTask({...task, description: s})}/>

        <FlatList data={colors} renderItem={c => (
          <TouchableOpacity 
          onPressOut={() => setTask({...task, color: c.item})}
          >
            <View style={{borderRadius: 40, backgroundColor: c.item, width: 20, height: 20}}>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_, i) => i.toString()}
        />

        <Text>{status}</Text>
        <Button title="submit" onPress={submit}/>
      </View>
    </View>
  );

}
