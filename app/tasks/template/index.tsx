import TaskCard from "@/components/TaskCard";
import {ThemedButton, ThemedInput, ThemedText, ThemedView} from "@/components/ThemedComponents";
import {Task, TaskTemplate, useTaskIndex, useTaskList, useTaskTarget} from "@/lib/task/task";
import { router } from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {useColorScheme} from "nativewind";
import {useState} from "react";
import {FlatList, ScrollView} from "react-native";
import {Button, TextInput, TouchableOpacity, View, Text,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateView() {
  const tasks = useTaskIndex(state => state.tasks).filter(t => t.native);
  const {colorScheme} = useColorScheme();

  return (
    <SafeAreaView className="bg-white dark:bg-zinc-950 h-screen w-screen">
      <ThemedView className="h-full w-full" reset>
        <ThemedText>Templates: </ThemedText>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView>
          {
            tasks.map(t => (
              <TaskCard task={t} key={t.id.toString()} deletable className="w-full p-5 my-2 rounded-xl box-border bg-zinc-950 dark:bg-zinc-800"/>
            ))
          }
          </ThemedView>
        </ScrollView>
        <ThemedButton onPressOut={() => router.push("/tasks/template/create")} className="w-12 aspect-square absolute right-safe-or-4 bottom-safe-or-10 rounded-xl" >
          <ThemedText className="text-2xl text-center text-white dark:text-black">+</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );

}
