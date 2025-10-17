import { TaskTemplate, useTaskIndex, useTaskTarget } from "@/lib/task/task";
import {Link, router} from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import {ThemedButton, ThemedText, ThemedView} from "./ThemedComponents";
import {styles} from "@/lib/style/style";
import {useColorScheme} from "nativewind";
import { useRef, useState } from "react";

interface Props {
  className?: string;
}
export default function TaskPalette({className}: Props) {
  const {colorScheme} = useColorScheme();
  //this is the task index, which are the created tasks that you then use for the taskList
  const tasks = useTaskIndex(state => state.tasks);
  const setTask = useTaskTarget(state => state.setTask);
  const [taskProxy, setTaskProxy] = useState<TaskTemplate | null>( useTaskTarget(state => state.task))
  const defaultStyle = "flex flex-row justify-start items-center box-border p-2"
  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} style={styles.shadow}>
      <ScrollView horizontal>
        <ThemedView className="flex flex-row">
        {
          tasks.map(t => (
            <TouchableOpacity key={t.id.toString()} onPressOut={() => {setTask(t); setTaskProxy(t)}}>
            <ThemedView className="w-6 h-6 p-2 m-2 rounded-full" style={[{backgroundColor: t.color, outlineOffset: 2, outlineColor: colorScheme == "dark" ? "white" : "black"}, taskProxy?.id === t.id ? {outlineWidth: 2} : {}]}></ThemedView>
            </TouchableOpacity>
          ))
        }
        </ThemedView>
      </ScrollView>

      <ThemedButton onPressOut={() => router.push("/tasks/template")} className="w-10 aspect-square">
        <ThemedText>+</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}
