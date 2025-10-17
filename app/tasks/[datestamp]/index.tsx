import TaskCard from "@/components/TaskCard";
import {ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTaskIndex, useTaskList, useTaskTarget} from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";
import {useState} from "react";
import {FlatList, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateView() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const db = useSQLiteContext();
  const tasks = useTaskIndex(state => state.tasks).filter(t => t.native);
  const addTask = useTaskList(state => state.createTask);
  console.log(new Date(datestamp).toString())
  const {colorScheme} = useColorScheme();

  return (
    <SafeAreaView className="bg-white dark:bg-zinc-950 h-screen w-screen">
      <ThemedView className="h-full w-full" reset>
        <ThemedText>Select from Templates: </ThemedText>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView>
          {
            tasks.map(t => (
              <TouchableOpacity 
              key={t.id.toString()} 
              onPressOut={() => {
                addTask(db, {...t, date: new Date(datestamp), template_id: t.id});
                router.back();
              }}>
                <TaskCard task={t} opaque className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
              </TouchableOpacity>
            ))
          }
          </ThemedView>
        </ScrollView>
        <ThemedButton 
        onPressOut={() => router.push({
          pathname: "/tasks/[datestamp]/create",
          params: {
            datestamp: datestamp,
          }
        })} 
        className="w-12 aspect-square absolute right-safe-or-4 bottom-safe-or-10 rounded-xl" >
          <ThemedText className="text-2xl text-center text-white dark:text-black">+</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );

}
