import { TaskTemplate, useTaskTarget, useTaskTemplates, useWeeklyTaskTarget, useWeeklyTaskTemplates, WeeklyTaskTemplate } from "@/lib/task/task";
import {Link, router} from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import {ThemedButton, ThemedText, ThemedView} from "./ThemedComponents";
import {styles} from "@/lib/style/style";
import {useColorScheme} from "nativewind";
import { useRef, useState } from "react";

interface Props<T>{
  tasks: T[],
  setTask: (task: T | null) => void;
  targetTask: T | null;
  className?: string;
  onClickAdd: () => void;
}
export default function TaskPalette<T extends TaskTemplate >({tasks, setTask, targetTask, onClickAdd, className}: Props<T>) {
  const {colorScheme} = useColorScheme();
  //this is the task index, which are the created tasks that you then use for the taskList
  //const tasks = useTaskTemplates(state => state.tasks).filter(t => t.visible);
  //const setTask = useTaskTarget(state => state.setTask);
  const [taskProxy, setTaskProxy] = useState<TaskTemplate | null>(targetTask)
  const defaultStyle = "flex flex-row justify-start items-center box-border p-2"

  const setTarget = (task: T) => {
    let target: T | null = task;
    if (target.id === taskProxy?.id) {
      target = null;

    }
    setTask(target); 
    setTaskProxy(target);
  }

  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} style={styles.shadow}>
      <ScrollView horizontal>
        <ThemedView className="flex flex-row">
          {
            tasks.map(t => (
              <TouchableOpacity key={t.id.toString()} onPressOut={() => setTarget(t)}>
                <ThemedView className="w-6 h-6 p-2 m-2 rounded-full" style={[{backgroundColor: t.color, outlineOffset: 2, outlineColor: colorScheme == "dark" ? "white" : "black"}, taskProxy?.id === t.id ? {outlineWidth: 2} : {}]}></ThemedView>
              </TouchableOpacity>
            ))
          }
        </ThemedView>
      </ScrollView>

      <ThemedButton onPressOut={onClickAdd} className="w-10 aspect-square">
        <ThemedText>+</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

TaskPalette.Tasks = ({className}: {className?: string}) => {
  const tasks = useTaskTemplates(state => state.tasks).filter(t => t.visible);
  const setTask = useTaskTarget(state => state.setTask);
  const targetTask = useTaskTarget(state => state.task);

  const onClickAdd = () => router.push("/tasks/template/");

  return <TaskPalette tasks={tasks} setTask={setTask} targetTask={targetTask} className={className} onClickAdd={onClickAdd}/>
}

TaskPalette.WeeklyTasks = ({className}: {className?: string}) => {
  const tasks = useWeeklyTaskTemplates(state => state.tasks).filter(t => t.visible);
  const setTask = useWeeklyTaskTarget(state => state.setTask);
  const targetTask = useWeeklyTaskTarget(state => state.task);

  const onClickAdd = () => router.push("/weekly_tasks/template/");

  return <TaskPalette tasks={tasks} setTask={setTask} targetTask={targetTask} className={className} onClickAdd={onClickAdd}/>
}
