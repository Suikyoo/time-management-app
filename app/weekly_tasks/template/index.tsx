import TaskCard from "@/components/TaskCard";
import { FooterPlusButton, NewPage, ThemedText } from "@/components/ThemedComponents";
import { TaskTemplate, useWeeklyTaskTemplates } from "@/lib/task/task";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TemplateView() {
  const {colorScheme} = useColorScheme();

  const delFunc = async(t: TaskTemplate) => {
    router.push({
      pathname: "/weekly_tasks/template/[id]/confirm_delete",
      params: {
        id: t.id.toString(),
      }
    });
  }
  const updateFunc = async(t: TaskTemplate) => {
    router.push({
      pathname: "/weekly_tasks/template/[id]/update",
      params: {
        id: t.id.toString()
      }
    })
  }
  return (
    <NewPage>
      <ThemedText>Templates: </ThemedText>
      <TaskCard.List useFunc={useWeeklyTaskTemplates} delFunc={delFunc} updateFunc={updateFunc}/>
      <FooterPlusButton onPressOut={() => router.push("/weekly_tasks/template/create")}/>
    </NewPage>
  );

}
