import TaskCreation from "@/components/TaskCreation";
import { useTaskTemplates } from "@/lib/task/task";
import { useSQLiteContext } from "expo-sqlite";

export default function Create() {
  const db = useSQLiteContext();
  const addTask = useTaskTemplates(state => state.createTask);
  return (
    <TaskCreation title="Create Task Template" onSubmit={async(t) => {addTask(db, t)}} timeOptional/>
  )
}
