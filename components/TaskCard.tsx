import {Task, TaskState, TaskTemplate} from "@/lib/task/task";
import {timeStampAfter, timeStampToString} from "@/lib/time/time";
import {ThemedButton, ThemedText, ThemedView} from "./ThemedComponents";
import { UseBoundStore } from "zustand";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";

interface TaskCardProps {
  task: TaskTemplate;
  className?: string; 
  opaque?: boolean;
  onDelete?: () => Promise<void>
}
export default function TaskCard({task, className, onDelete, opaque}: TaskCardProps) {
  const defaultStyle = "flex flex-row justify-between items-center box-border px-7"
  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} style={opaque ? {backgroundColor: task.color} : {borderWidth: 2, borderColor: task.color}}>
      <ThemedView textInherit={opaque ? "!text-black dark:!text-black" : ""}>
        <ThemedText>{task.title}</ThemedText>
        <ThemedText>{task.description}</ThemedText>
        <ThemedText>
          {
            task.timestamp ? (
              `${timeStampToString(task.timestamp)}` + " - " + (task.duration ? 
                 `${timeStampToString(timeStampAfter(task.timestamp!, task.duration))}` : "" )
            ) : ''
          }
        </ThemedText>

      </ThemedView>
      
      {
        onDelete && (
      <ThemedButton className="h-12 rounded-xl" onPressOut={onDelete}>
        <ThemedText >Delete</ThemedText>
      </ThemedButton>
        )
      }
      

    </ThemedView>
  );
}

interface Props<T> {
  useFunc: TaskState<T>;
}

interface PickerProps<T> extends Props<T> {
  onPick: (t: TaskTemplate) => Promise<void>;
}

TaskCard.List = <T extends TaskTemplate, >({useFunc}: Props<T>) => {
  const db = useSQLiteContext();
  const tasks = useFunc(s => s.tasks).filter(t => t.visible);
  const deleteTask = useFunc(s => s.deleteTask);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        {
          tasks.map(t => (
            <TaskCard task={t} key={t.id.toString()} onDelete={async() => {await deleteTask(db, t.id)}} className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
          ))
        }
      </ThemedView>
    </ScrollView>
  )
}

TaskCard.Picker = <T extends TaskTemplate,>({useFunc, onPick}: PickerProps<T>) => {
  //const db = useSQLiteContext();
  const tasks = useFunc(s => s.tasks).filter(t => t.visible);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        {
          tasks.map(t => (
            <TouchableOpacity 
              key={t.id.toString()} 
              onPressOut={async() => {
                await onPick(t)
                //await addTask(db, {...t, day: Number(day), template_id: t.id});
                router.back();
              }}>
              <TaskCard task={t} opaque className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
            </TouchableOpacity>
          ))
        }
      </ThemedView>
    </ScrollView>

  )
}
