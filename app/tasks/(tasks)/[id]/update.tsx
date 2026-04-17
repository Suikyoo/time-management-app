import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates } from "@/lib/task/task";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Update() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();

  const tasks = useTasks(state => state.tasks);
  const updateTask = useTasks(state => state.updateTask);

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    throw new Error("task not found");
  }

  const onSubmit = async(t: TaskTemplate) => {
    updateTask(db, {...task, timestamp: t.timestamp, duration: t.duration});
  }

  return (
    <TaskCreation title="Update Task" startTemplate={task} onSubmit={onSubmit} disableTitle disableDescription disableColor/>
  )
}

