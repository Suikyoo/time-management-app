import Prompt from "@/components/Prompt";
import { useLocalSearchParams } from "expo-router";


export default function Delete() {
  const {id} = useLocalSearchParams<{id: string}>();
  return (
    <Prompt.TaskTemplateDeleteOptions id={Number(id)}/>
  )
}
