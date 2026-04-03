import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates} from "@/lib/task/task";
import { router } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {colorScheme} = useColorScheme();

  const taskList = useTasks(state => state.tasks);
  const deleteTask = useTasks(state => state.deleteTask);
  const deleteTemplate = useTaskTemplates(state => state.deleteTask);

  const delFunct = async(db: SQLiteDatabase, template: TaskTemplate) => {
    const tasks = taskList.filter(t => t.template_id === template.id);
    for (const t of tasks) {
      deleteTask(db, t.id);
    }

    deleteTemplate(db, template.id);

  }

  return (
    <NewPage>
      <ThemedText>Templates: </ThemedText>
      <TaskCard.List useFunc={useTaskTemplates}/>
      <FooterPlusButton onPressOut={() => router.push("/tasks/template/create")}/>
    </NewPage>
  );

}
