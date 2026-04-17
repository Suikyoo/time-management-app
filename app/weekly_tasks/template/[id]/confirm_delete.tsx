import Prompt from "@/components/Prompt";
import { router, useLocalSearchParams } from "expo-router";


export default function Delete() {
  const {id} = useLocalSearchParams<{id: string}>();
  return (
    <Prompt.UrgentConfirm text="Delete template?" func={async() => {
      router.replace({
        pathname: "/weekly_tasks/template/[id]/delete",
        params: {
          id: id.toString(),
        }

      });

      return;
    }}/>
  )
}
