import TaskCard from "@/components/TaskCard";
import {FooterPlusButton, NewPage, ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import { dateIsEqual } from "@/lib/calendar/calendar";
import {Task, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates} from "@/lib/task/task";
import { trimEpoch } from "@/lib/time/time";
import { router, useLocalSearchParams } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";

export default function TemplateView() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const {colorScheme} = useColorScheme();

  const db = useSQLiteContext();
  const addTask = useTasks(s => s.createTask);

  const onPick = async(t: TaskTemplate) => {
    await addTask(db, {...t, template_id: t.id, date: new Date(datestamp)});
    router.back();
  }

  const delFunc = async(t: TaskTemplate) => {
    router.push({
      pathname: "/tasks/[id]/confirm_delete",
      params: {
        id: t.id.toString(),
      }
    })
  }

  const updateFunc = async(t: TaskTemplate) => {
    router.push({
      pathname: "/tasks/[id]/update",
      params: {
        id: t.id.toString(),
      }
    })
  }

  const filterFunc = (t: Task) => {
    return t.visible && (dateIsEqual(t.date, new Date(datestamp)))
  }
  return (
    <NewPage>
      <ThemedText>Select from Templates: </ThemedText>
      <TaskCard.Picker useFunc={useTaskTemplates} onPick={onPick}/>
      <ThemedText>Tasks: </ThemedText>
      <TaskCard.List useFunc={useTasks} filterFunc={filterFunc} delFunc={delFunc} updateFunc={updateFunc}/>
      <FooterPlusButton onPressOut={() => router.push({
        pathname: "/tasks/[datestamp]/create",
        params: {
          datestamp: datestamp,
        }
      })} 
      />
    </NewPage>
  );

}
