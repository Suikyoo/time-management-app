import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates} from "@/lib/task/task";
import { router } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {colorScheme} = useColorScheme();

  const delFunct = async(t: TaskTemplate) => {
    router.push({
      pathname: "/tasks/template/[id]/confirm_delete",
      params: {
        id: t.id.toString()
      }
    })
  }
  const updateFunc = async(t: TaskTemplate) => {
    router.push({
      pathname: "/tasks/template/[id]/update",
      params: {
        id: t.id.toString()
      }
    })
  }
  return (
    <NewPage>
      <ThemedText>Templates: </ThemedText>
      <TaskCard.List useFunc={useTaskTemplates} delFunc={delFunct} updateFunc={updateFunc}/>
      <FooterPlusButton onPressOut={() => router.push("/tasks/template/create")}/>
    </NewPage>
  );

}
