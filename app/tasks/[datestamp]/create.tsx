import TaskCreation from "@/components/TaskCreation";
import { TaskTemplate, useTasks, useTaskTemplates } from "@/lib/task/task";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Create() {
  const db = useSQLiteContext();
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();

  const addToTaskTemplate = useTaskTemplates(state => state.createTask);
  const addToTasks = useTasks(state => state.createTask);

  const onSubmit = async(t: TaskTemplate) => {
    //add invisible template
    const id = await addToTaskTemplate(db, {...t, visible: false});
    //instantiate a task of that invisible template
    await addToTasks(db, {...t, date: new Date(datestamp), template_id: id});
  }

  return (
    <TaskCreation title="Create Task" onSubmit={onSubmit} timeOptional/>
  )
}

