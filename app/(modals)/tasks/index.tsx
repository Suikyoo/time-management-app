import TaskCard from "@/components/TaskCard";
import {colors} from "@/lib/color/color";
import {Task, useTaskIndex, useTaskList, useTaskTarget} from "@/lib/task/task";
import {FormEventHandler, useState} from "react";
import {FlatList} from "react-native";
import {Button, TextInput, TouchableOpacity, View, Text, GestureResponderEvent} from "react-native";

export default function Index() {
  const tasks = useTaskIndex(state => state.tasks);
  const addTask = useTaskIndex(state => state.createTask);

  const [task, setTask] = useState<Task>({title: "", description: "", color: ""})
  const [status, setStatus] = useState("");

  const submit = (e: GestureResponderEvent) => {
    if (!task.title.length && !task.description.length && !task.color.toString().length) {
      setStatus("unfilled");
      return
    }
    if (tasks.find(t => t.title == task.title)) {
      setStatus("same title");
      return;
    }

    addTask(task);
  }
    

  return (
    <View>
      <FlatList data={tasks} keyExtractor={t => t.id ? `${t.id}` : ""} renderItem={t => <TaskCard task={t.item}/>}/>

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
