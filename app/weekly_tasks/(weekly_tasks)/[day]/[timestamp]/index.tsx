import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedText} from "@/components/ThemedComponents";
import {TaskTemplate, useWeeklyTasks, useWeeklyTaskTemplates} from "@/lib/task/task";
import { getTimeStampfromString } from "@/lib/time/time";
import { router, useLocalSearchParams } from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {day, timestamp} = useLocalSearchParams<{day: string, timestamp: string}>();
  const {colorScheme} = useColorScheme();

  const db = useSQLiteContext();
  const addTask = useWeeklyTasks(s => s.createTask);

  const onPick = async(t: TaskTemplate) => {
    await addTask(db, {day: Number(day), timestamp: getTimeStampfromString(timestamp), template_id: t.id, duration: t.duration!, ...t});
    router.back();
  }

  const delFunc = async(t: TaskTemplate) => {
    console.log("ehe");
    router.push({
      pathname: "/weekly_tasks/[id]/confirm_delete",
      params: {
        id: t.id.toString(),
      }
    });
  }

  return (
    <NewPage>
      <ThemedText className="!text-black dark:!text-white">Select from Weekly Templates: </ThemedText>
      <TaskCard.Picker useFunc={useWeeklyTaskTemplates} onPick={onPick}/>
      <ThemedText className="!text-black dark:!text-white">Tasks: </ThemedText>
      <TaskCard.List useFunc={useWeeklyTasks} delFunc={delFunc}/>
      <FooterPlusButton onPressOut={() => router.push({
        pathname: "/weekly_tasks/[day]/[timestamp]/create",
        params: {
          day: day,
          timestamp: timestamp,
        }

      })} 
      />
    </NewPage>
  );

}
