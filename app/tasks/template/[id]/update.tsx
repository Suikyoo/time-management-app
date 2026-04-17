import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates } from "@/lib/task/task";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Update() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();
  const taskTemplates = useTaskTemplates(state => state.tasks);
  const updateTaskTemplate = useTaskTemplates(state => state.updateTask);
  const loadTasks = useTasks(state => state.loadTasksFromId);

  const template = taskTemplates.find(t => t.id === Number(id));

  if (!template) {
    throw new Error("Task template not found. ");
  }

  const submit = async(t: TaskTemplate) => {
    await updateTaskTemplate(db, {...t, id: template.id});
    await loadTasks(db, template.id);
  }
  return (
    <TaskCreation startTemplate={template} title="Update Task Template" onSubmit={submit} timeOptional/>
  )
}
