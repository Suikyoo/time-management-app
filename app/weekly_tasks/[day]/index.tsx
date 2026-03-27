import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates, useWeeklyTasks, useWeeklyTaskTemplates} from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const {colorScheme} = useColorScheme();

  const db = useSQLiteContext();
  const addTask = useTasks(s => s.createTask);

  const onPick = async(t: TaskTemplate) => {
    await addTask(db, {...t, template_id: t.id, date: new Date(datestamp)});
    router.back();
  }

  return (
    <NewPage>
      <ThemedText className="!text-black dark:!text-white">Select from Templates: </ThemedText>
      <TaskCard.Picker useFunc={useWeeklyTaskTemplates} onPick={onPick}/>
      <ThemedText className="!text-black dark:!text-white">Tasks: </ThemedText>
      <TaskCard.List useFunc={useWeeklyTasks}/>
      <FooterPlusButton onPressOut={() => router.push("/weekly_tasks/[day]/create")}/>
    </NewPage>
  );

}
