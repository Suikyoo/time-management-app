import Prompt, {PromptButton} from "@/components/Prompt";
import { useTasks, useWeeklyTasks } from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";


export default function UpdateOrDelete() {
  const {id} = useLocalSearchParams<{id: string}>();
  const db = useSQLiteContext();
  
  const del = async() => {
    router.replace({
      pathname: "/weekly_tasks/[id]/confirm_delete",
      params: {
        id: id,
      }
    });
  }

  const update = async() => {
    router.replace({
      pathname: "/weekly_tasks/[id]/update",
      params: {
        id: id,
      }
    });
  }

  const buttons: PromptButton[] = [
    {
      text: "Update",
      func: update,
    },
    {
      text: "Delete",
      func: del,
    },
  ]
  return (
    <Prompt text="Update or delete?" buttons={buttons}/>
  )
}
