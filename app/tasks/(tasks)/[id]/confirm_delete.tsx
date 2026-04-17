import Prompt from "@/components/Prompt";
import { useTasks } from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";


export default function Delete() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();
  const delTask = useTasks(s => s.deleteTask);
  return (
    <Prompt.UrgentConfirm text="Delete task?" func={async() => {
      await delTask(db, Number(id));
      router.back();
    }}/>
  )
}
