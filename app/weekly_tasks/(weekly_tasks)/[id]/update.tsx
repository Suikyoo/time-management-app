import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates, useWeeklyTasks } from "@/lib/task/task";
import { getTimeStamp, getTimeStampfromString } from "@/lib/time/time";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Update() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();

  const tasks = useWeeklyTasks(state => state.tasks);
  const updateTask = useWeeklyTasks(state => state.updateTask);

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    throw new Error("task not found");
  }

  const onSubmit = async(t: TaskTemplate) => {
    updateTask(db, {...task, timestamp: t.timestamp || getTimeStamp(0), duration: t.duration || 5});
  }

  return (
    <TaskCreation title="Update Task" startTemplate={task} onSubmit={onSubmit} disableTitle disableDescription disableColor/>
  )
}

