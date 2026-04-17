import {ExtendedTaskState, Task, TaskState, TaskTemplate} from "@/lib/task/task";
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
  onUpdate?: () => Promise<void>
}
export default function TaskCard({task, className, onDelete, onUpdate, opaque}: TaskCardProps) {
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
      {
        onUpdate && (
      <ThemedButton className="h-12 rounded-xl" onPressOut={onUpdate}>
        <ThemedText >Update</ThemedText>
      </ThemedButton>
        )
      }

    </ThemedView>
  );
}

interface Props<T> {
  useFunc: TaskState<T>;
  filterFunc?: (t: T) => boolean;
}

//troop func represents the members of template-types that can be massacred if the user says so
interface ListProps<T> extends Props<T> {
  delFunc?: (t: TaskTemplate) => Promise<void>; 
  updateFunc?: (t: TaskTemplate) => Promise<void>;
}

interface PickerProps<T> extends Props<T> {
  onPick: (t: TaskTemplate) => Promise<void>;
}
 
TaskCard.List = <T extends TaskTemplate,>({useFunc, filterFunc, delFunc=async(t) => {}, updateFunc=async(t) => {}}: ListProps<T>) => {
  const tasks = useFunc(s => s.tasks).filter((filterFunc) || (t => t.visible));

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        {
          tasks.map(t => (
            <TaskCard task={t} key={t.id.toString()} onUpdate={async() => await updateFunc(t)} onDelete={async() => {await delFunc(t)}} className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
          ))
        }
      </ThemedView>
    </ScrollView>
  )
}

TaskCard.Picker = <T extends TaskTemplate,>({useFunc, onPick, filterFunc}: PickerProps<T>) => {
  const tasks = useFunc(s => s.tasks).filter((filterFunc) || (t => t.visible));
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
