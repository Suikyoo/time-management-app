import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useWeeklyTaskTemplates } from "@/lib/task/task";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Create() {
  const db = useSQLiteContext();

  const addToTemplates = useWeeklyTaskTemplates(s => s.createTask);

 const onSubmit = async(t: TaskTemplate) => {
    const weeklyTemplate = {...t, timestamp: t.timestamp!, duration: t.duration!, visible: false};
    await addToTemplates(db, weeklyTemplate);

    router.back();

  }

  return (
    <TaskCreation title="Create Weekly Task Template" onSubmit={onSubmit} />
  )
}
