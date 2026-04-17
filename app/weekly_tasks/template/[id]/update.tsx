import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates, useWeeklyTasks, useWeeklyTaskTarget, useWeeklyTaskTemplates } from "@/lib/task/task";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Page() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();

  const taskTemplates = useWeeklyTaskTemplates(state => state.tasks);
  const updateTaskTemplate = useWeeklyTaskTemplates(state => state.updateTask);
  const loadTasks = useWeeklyTasks(state => state.loadTasksFromId);
  const setTarget = useWeeklyTaskTarget(state => state.setTask);

  const template = taskTemplates.find(t => t.id === Number(id));

  if (!template) {
    throw new Error("Task template not found. ");
  }

  const submit = async(t: TaskTemplate) => {
    await updateTaskTemplate(db, {...t, id: template.id, duration: t.duration || 0});
    await loadTasks(db, template.id);
    setTarget(null);

  }
  return (
    <TaskCreation startTemplate={template} title="Update Weekly Task Template" onSubmit={submit} disableTime inputDuration/>
  )
}
