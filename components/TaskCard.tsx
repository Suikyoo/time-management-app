import {Task, TaskTemplate, useTaskIndex} from "@/lib/task/task";
import {timeStampAfter, timeStampToString} from "@/lib/time/time";
import {useSQLiteContext} from "expo-sqlite";
import {View, Text, Button} from "react-native";
import {ThemedText, ThemedView} from "./ThemedComponents";

interface Props {
  task: TaskTemplate;
  className?: string; 
}
export default function TaskCard({task, className}: Props) {
  const db = useSQLiteContext();
  const deleteTask = useTaskIndex( state => state.deleteTask );
  const press = () => {
    if (task.id) {
      deleteTask(db, task.id);
    }
  }
  const defaultStyle = "box-border px-7"
  return (
    <ThemedView className={`${defaultStyle} ${className || ""}`} style={{outlineWidth: 0.6, outlineOffset: -6, outlineColor: task.color}}>
      <ThemedText>{task.title}</ThemedText>
      <ThemedText>{task.description}</ThemedText>
      {
        task.timestamp && task.duration ? <Text>{timeStampToString(task.timestamp)}-{timeStampToString(timeStampAfter(task.timestamp, task.duration))}</Text>: <Text></Text>
      }
      
      <Button title="X" onPress={press} />
      

    </ThemedView>
  );
}
