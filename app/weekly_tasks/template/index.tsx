import TaskCard from "@/components/TaskCard";
import { FooterPlusButton, NewPage, ThemedText } from "@/components/ThemedComponents";
import { useWeeklyTaskTemplates } from "@/lib/task/task";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TemplateView() {
  const {colorScheme} = useColorScheme();

  return (
    <NewPage>
      <ThemedText>Templates: </ThemedText>
      <TaskCard.List useFunc={useWeeklyTaskTemplates}/>
      <FooterPlusButton onPressOut={() => router.push("/weekly_tasks/template/create")}/>
    </NewPage>
  );

}
