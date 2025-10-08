import {getPage, month_names, day_names, dateIsEqual} from "@/lib/calendar/calendar";
import {Task, useTaskList, useTaskTarget} from "@/lib/task/task";
import {useSQLiteContext} from "expo-sqlite";
import {useEffect, useState} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {ThemedText, ThemedView} from "./ThemedComponents";
import {useColorScheme} from "nativewind";

interface CalendarProp {
  date: Date;
  active: boolean;
}

interface CalendarDayProp {
  day: number;
  tasks: Task[];
  active: boolean;

}

function CalendarDay({day, tasks, active}: CalendarDayProp) {
  const {colorScheme} = useColorScheme();
  
  return (
    <ThemedView
    className="flex flex-col items-center w-full h-full text-center rounded-sm"
    style={{
      outlineColor: colorScheme === "dark" ? "white" : "black", 
      outlineWidth: 1, 
      opacity: active ? 1 : 0.3,
      backgroundColor: tasks.length ? "#444" : undefined,
    }} 
    >
    <ThemedView className="flex flex-row self-start justify-start mx-2 my-1">
    {
      tasks.slice(0, 2).map(t => (
        <ThemedView key={t.id.toString()} className="w-2 h-2 rounded-full" style={{backgroundColor: t.color}} >
        </ThemedView>
      ))
    }
    </ThemedView>
      
      <ThemedText>{day}</ThemedText>
    </ThemedView>
  )

}
export default function Calendar({date, active}: CalendarProp) {
  const db = useSQLiteContext();

  const page = getPage(date);

  const addTask = useTaskList(state => state.createTask);
  const deleteTask = useTaskList(state => state.deleteTask);

  const target = useTaskTarget(state => state.task);

  const press = async(tasks: Task[], newDate: Date) => {
    console.log(newDate);
    if (!target) {
      return
    }
    const foundTask = tasks.find(t => t.template_id === target.id);
    if (foundTask) {
      await deleteTask(db, foundTask.id);
    }
    else {
      await addTask(db, {...target, date: newDate, template_id: target.id})
    }

  }
  const [proxyTaskList, setProxyTaskList] = useState<Task[]>(useTaskList(s => s.tasks))

  useEffect(() => {
    if (active) {
      const unsubscribe = useTaskList.subscribe((curr, _) => {; setProxyTaskList(curr.tasks)});
      return unsubscribe;
    }
  }, [active]);

  return (
    <ThemedView className="grow w-[33.33%] justify-start items-center box-border p-2">
      <ThemedView className="flex-row items-center justify-center">
        <ThemedText>{month_names[page.month]}</ThemedText>
      </ThemedView>
      <ThemedView className="flex flex-row flex-wrap items-center w-full">
      {
        day_names.map((v, index) => (
          <ThemedView key={index} className="flex bold justify-center items-center w-[14.27%]">
          <ThemedText>{v.substring(0, 3)}</ThemedText>
          </ThemedView>
        ))
      }
      {
        page.days.map((d, index) => {
          const active = index >= page.offset;
          const new_date = new Date(date.getUTCFullYear(), date.getUTCMonth() - (active ? 0 : 1), d, 12);
          const s = proxyTaskList.filter((t) => dateIsEqual(new_date, t.date))
          return (
            <TouchableOpacity 
            onPress={() => {press(s, new_date); console.log(d)}}
            key={index}
            className="text-center flex justify-center w-[14.27%] h-[50px] box-border p-1"
            >
              <CalendarDay day={d} tasks={s} active={active} />
            </TouchableOpacity>
          )})
      }
      </ThemedView>
    </ThemedView>
  );
}
