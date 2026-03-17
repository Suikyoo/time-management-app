import TaskCard from "@/components/TaskCard";
import {ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import { dateIsEqual } from "@/lib/calendar/calendar";
import {Task, TaskTemplate, useTaskList, useTaskTarget, useTaskTemplates} from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";
import {FlatList, ScrollView, TouchableOpacity} from "react-native";

export default function TemplateView() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const db = useSQLiteContext();
  const templates = useTaskTemplates(state => state.tasks).filter(t => t.visible);
  const tasks = useTaskList(s => s.tasks).filter(t => dateIsEqual(t.date, new Date(datestamp)))
  const deleteTask = useTaskList(s => s.deleteTask);
  const deleteTemplate = useTaskTemplates(s => s.deleteTask);

  const delFunct = async (db: SQLiteDatabase, task: Task) => {
    db.withExclusiveTransactionAsync(async tx => {
      await deleteTask(tx, task.id)

      if (!task.visible) {
          await deleteTemplate(tx, task.template_id)
      }

    })
  }

  const addTask = useTaskList(state => state.createTask);

  const {colorScheme} = useColorScheme();

  return (
    <ThemedView className="bg-white dark:bg-zinc-950 h-full w-full" reset>
      <ThemedText>Tasks: </ThemedText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView>
          {
            tasks.map(t => (
              <TaskCard task={t} key={t.id.toString()} onDelete={async() => await delFunct(db, t)} className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
            ))
          }
        </ThemedView>
      </ScrollView>
      <ThemedText className="!text-black dark:!text-white">Select from Templates: </ThemedText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView>
          {
            templates.map(t => (
              <TouchableOpacity 
                key={t.id.toString()} 
                onPressOut={() => {
                  addTask(db, {...t, date: new Date(datestamp), template_id: t.id});
                  router.back();
                }}>
                <TaskCard task={t} opaque className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
              </TouchableOpacity>
            ))
          }
        </ThemedView>
      </ScrollView>

      <ThemedButton 
        onPressOut={() => router.push({
          pathname: "/tasks/[datestamp]/create",
          params: {
            datestamp: datestamp,
          }
        })} 
        className="w-12 aspect-square absolute right-safe-or-4 bottom-safe-or-10 rounded-xl" >
        <ThemedText className="text-2xl text-center text-white dark:text-black">+</ThemedText>
      </ThemedButton>
    </ThemedView>
  );

}
