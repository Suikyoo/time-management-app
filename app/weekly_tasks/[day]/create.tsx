import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates, useWeeklyTasks, useWeeklyTaskTemplates } from "@/lib/task/task";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Create() {
  const db = useSQLiteContext();
  const {day} = useLocalSearchParams<{day: string}>();

  const addToTemplates = useWeeklyTaskTemplates(state => state.createTask);
  const addToTasks = useWeeklyTasks(state => state.createTask);

  const onSubmit = async(t: TaskTemplate) => {
    //add invisible template

    const weeklyTemplate = {...t, timestamp: t.timestamp!, duration: t.duration!, visible: false};
    const id = await addToTemplates(db, weeklyTemplate);

    //instantiate a task of that invisible template
    await addToTasks(db, {...weeklyTemplate, day: Number(day), template_id: id});
  }

  return (
    <TaskCreation title="Create Task" onSubmit={onSubmit} durationOffset={}/>
  )
}

