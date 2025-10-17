import {Task, TaskTemplate, useTaskIndex} from "@/lib/task/task";
import {timeStampAfter, timeStampToString} from "@/lib/time/time";
import {useSQLiteContext} from "expo-sqlite";
import {View, Text, Button} from "react-native";
import {ThemedButton, ThemedText, ThemedView} from "./ThemedComponents";

interface Props {
  task: TaskTemplate;
  className?: string; 
  deletable?: boolean;
  opaque?: boolean;
}
export default function TaskCard({task, className, deletable, opaque}: Props) {
  const db = useSQLiteContext();
  const deleteTask = useTaskIndex( state => state.deleteTask );
  const press = () => {
    if (task.id) {
      deleteTask(db, task.id);
    }
  }
  const defaultStyle = "flex flex-row justify-between items-center box-border px-7"
  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} style={opaque ? {backgroundColor: task.color} : {borderWidth: 2, borderColor: task.color}}>
      <ThemedView textInherit={opaque ? "!text-black dark:!text-black" : ""}>
        <ThemedText>{task.title}</ThemedText>
        <ThemedText>{task.description}</ThemedText>
        <ThemedText style={{display: task.timestamp && task.duration ? "contents" : "none"}}>
          {task.timestamp && task.duration ? `${timeStampToString(task.timestamp)} - ${timeStampToString(timeStampAfter(task?.timestamp, task.duration))}` : ""}
        </ThemedText>

      </ThemedView>
      
      {
        deletable && (
      <ThemedButton className="h-12 rounded-xl" onPressOut={press}>
        <ThemedText >Delete</ThemedText>
      </ThemedButton>
        )
      }
      

    </ThemedView>
  );
}
