import TaskCard from "@/components/TaskCard";
import {ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import { deleteFromTaskList } from "@/lib/db/db";
import {Task, TaskTemplate, useTaskList, useTaskTarget, useTaskTemplates} from "@/lib/task/task";
import { router } from "expo-router";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";
import {useState} from "react";
import {FlatList, ScrollView} from "react-native";
import {Button, TextInput, TouchableOpacity, View, Text,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateView() {
  const db = useSQLiteContext();
  const templates = useTaskTemplates(state => state.tasks).filter(t => t.visible);
  const {colorScheme} = useColorScheme();

  const taskList = useTaskList(state => state.tasks);
  const deleteTask = useTaskList(state => state.deleteTask);
  const deleteTemplate = useTaskTemplates(state => state.deleteTask);


  const delFunct = async(db: SQLiteDatabase, template: TaskTemplate) => {
    const tasks = taskList.filter(t => t.template_id === template.id);
    for (const t of tasks) {
      deleteTask(db, t.id);
    }

    deleteTemplate(db, template.id);

  }

  return (
    <ThemedView className="bg-white dark:bg-zinc-950 h-full w-full" reset>
      <ThemedText>Templates: </ThemedText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView>
          {
            templates.map(t => (
              <TaskCard task={t} key={t.id.toString()} onDelete={async() => await delFunct(db, t)} className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
            ))
          }
        </ThemedView>
      </ScrollView>
      <ThemedButton onPressOut={() => router.push("/tasks/template/create")} className="w-12 aspect-square absolute right-safe-or-4 bottom-safe-or-10 rounded-xl" >
        <ThemedText className="text-2xl text-center text-white dark:text-black">+</ThemedText>
      </ThemedButton>
    </ThemedView>
  );

}
