import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates, useWeeklyTasks} from "@/lib/task/task";
import { router } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {colorScheme} = useColorScheme();

  return (
    <NewPage>
      <ThemedText>Templates: </ThemedText>
      <TaskCard.List useFunc={useWeeklyTasks}/>
      <FooterPlusButton onPressOut={() => router.push("/weekly_tasks/template/create")}/>
    </NewPage>
  );

}
