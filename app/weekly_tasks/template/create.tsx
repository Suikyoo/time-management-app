import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useWeeklyTaskTemplates, WeeklyTaskTemplate } from "@/lib/task/task";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Create() {
  const db = useSQLiteContext();

  const addToTemplates = useWeeklyTaskTemplates(s => s.createTask);

 const onSubmit = async(t: TaskTemplate) => {
    const weeklyTemplate: WeeklyTaskTemplate = {...t, timestamp: t.timestamp, duration: t.duration!, visible: true};
    await addToTemplates(db, weeklyTemplate);

    router.back();

  }

  return (
    <TaskCreation title="Create Weekly Task Template" onSubmit={onSubmit} disableTime inputDuration/>
  )
}
