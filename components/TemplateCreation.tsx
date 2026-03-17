import { ThemedView, ThemedText, ThemedInput, ThemedButton } from "@/components/ThemedComponents";
import { colors } from "@/lib/color/color";
import { TaskTemplate, useTaskList, useTaskTemplates } from "@/lib/task/task";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useColorScheme } from "nativewind";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Keyboard, Pressable, ScrollView, Switch, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {durationToString, getDuration, getTimeStamp, TimeStamp} from "@/lib/time/time";

type ctxType = {template: TaskTemplate, setTemplate: ((t:TaskTemplate) => void)};

interface parentType {
  children: React.ReactNode,
}
const templateContext = createContext<ctxType|null>(null);

function TemplateCreation({children}: parentType) {
  const [template, setTemplate] = useState<TaskTemplate>({
    id: -1,
    color: "",
    title: "",
    description: "",
    default_timestamp: undefined,
    duration: 0,
    native: false,
  });

  return (
    <Pressable className="w-full h-full" onPressOut={() => {Keyboard.isVisible() ? Keyboard.dismiss() : router.back()}}>
      <ThemedView reset className="bg-zinc-100 dark:bg-zinc-900 m-auto flex flex-col justify-start w-80 h-50 py-5 px-7 box-border">
        <Pressable onPressOut={e => e.stopPropagation()}>
          <templateContext.Provider value={{template, setTemplate}}>
            {children}
          </templateContext.Provider>
        </Pressable>
      </ThemedView>
    </Pressable>
  )
}
function Title({children}: parentType) {
  const ctxValue = useContext(templateContext);
  if (!ctxValue) {
    return
  }
  const {template, setTemplate} = ctxValue;

  return (
    <>
      <ThemedText>Title: </ThemedText>
      <ThemedInput 
        value={template?.title} 
        onChangeText={(s) => {setTemplate && setTemplate({...template, title: s})}}
      />
    </>
  )
}

function Description({children}: parentType) {
  const ctxValue = useContext(templateContext);
  if (!ctxValue) {
    return
  }
  const {template, setTemplate} = ctxValue;

  return (
    <>
      <ThemedText style={{opacity: 0.5}}>Description: </ThemedText>
      <ThemedInput value={template.description} onChangeText={(s) => setTemplate({...template, description: s})}/>
    </>
  )
}
function Color({children}: parentType) {
  const ctxValue = useContext(templateContext);
  if (!ctxValue) {
    return
  }
  const {template, setTemplate} = ctxValue;

  return (
    <ThemedText>Color: </ThemedText>
      <ThemedView className="h-10">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-red-200 rounded-full">
          <ThemedView className="flex flex-row">
            {
              colors.map((c, index) => (
                <TouchableOpacity 
                  onPressOut={() => setTask({...task, color: c})}
                  key={index.toString()}
                >
                  <ThemedView className="w-6 h-6 m-2 rounded-full" style={[{backgroundColor: c, outlineColor: "white", outlineOffset: 2}, task.color === c ? {outlineWidth: 2} : {}]}>
                  </ThemedView>
                </TouchableOpacity>
              ))
            }
          </ThemedView>
        </ScrollView>
          </ThemedView>

  )
}

export default function Create() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();

  const db = useSQLiteContext();
  const {colorScheme} = useColorScheme();
  const addToTaskList = useTaskList(state => state.createTask);
  const addToTaskTemplates = useTaskTemplates(state => state.createTask);
  const [task, setTask] = useState<TaskTemplate>({
    id: -1,
    color: "",
    title: "",
    description: "",
    default_timestamp: undefined,
    duration: 0,
    native: false,
  })

  const [status, setStatus] = useState("");
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());

  const [showTime, setShowTime] = useState(false);

  const submit = async () => {
    if ((!task.title.length && !task.description.length) || !task.color.toString().length) {
      setStatus("unfilled");
      return
    }
    const template_id = await addToTaskTemplates(db, task);
    await addToTaskList(db, {...task, date: new Date(datestamp), template_id});
    router.back();

  }

  useEffect(() => {

    if (showTime) {
      const t = new Date(timeStart);

      const now = t.getTime();
      t.setHours(0, 0, 0, 0);
      const midnight = t.getTime();

      const ts = getTimeStamp(now - midnight);
      const d = timeEnd.getTime() - timeStart.getTime();
      setTask({...task, timestamp: ts, duration: d});
    }

  }, [timeStart, timeEnd, showTime]);

  return (
    <Pressable className="w-full h-full" onPressOut={() => {Keyboard.isVisible() ? Keyboard.dismiss() : router.back()}}>
      <ThemedView reset className="bg-zinc-100 dark:bg-zinc-900 m-auto flex flex-col justify-start w-80 h-50 py-5 px-7 box-border">
        <Pressable onPressOut={e => e.stopPropagation()}>
          <ThemedText>Create a Task: </ThemedText>
          <ThemedText>Title: </ThemedText>
          <ThemedInput value={task.title} onChangeText={(s) => {setTask({...task, title: s})}}/>
          <ThemedText style={{opacity: 0.5}}>Description: </ThemedText>
          <ThemedInput value={task.description} onChangeText={(s) => setTask({...task, description: s})}/>

          <ThemedText>Color: </ThemedText>
          <ThemedView className="h-10">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-red-200 rounded-full">
              <ThemedView className="flex flex-row">
                {
                  colors.map((c, index) => (
                    <TouchableOpacity 
                      onPressOut={() => setTask({...task, color: c})}
                      key={index.toString()}
                    >
                      <ThemedView className="w-6 h-6 m-2 rounded-full" style={[{backgroundColor: c, outlineColor: "white", outlineOffset: 2}, task.color === c ? {outlineWidth: 2} : {}]}>
                      </ThemedView>
                    </TouchableOpacity>
                  ))
                }
              </ThemedView>
            </ScrollView>
          </ThemedView>

          <ThemedText style={{opacity: showTime ? 1. : 0.5}}>Time{showTime ? ":" : "?"}</ThemedText>
          <ThemedView className="flex flex-col items-start">
            <ThemedView className="flex flex-row">
              <Switch value={showTime} onValueChange={setShowTime} className="-translate-x-3 scale-50" />
            </ThemedView>
            { showTime && (
              <>
                <ThemedView className="flex flex-row justify-center">
                  <DateTimePicker 
                    mode="time" 
                    value={timeStart} 
                    onChange={(_, d) => { if (d) {setTimeStart(d)}}} 
                    disabled={!showTime} 
                    display="compact"
                    style={{marginLeft: 0}}
                  /> 
                  <ThemedText className="px-2">-</ThemedText>

                  <DateTimePicker 
                    mode="time" 
                    value={timeEnd} 
                    onChange={(_, d) => { if (d) {setTimeEnd(d)}}} 
                    disabled={!showTime} 
                    display="compact"
                    style={{marginLeft: 0}}
                  />

                </ThemedView>
                <ThemedText>Duration: {durationToString(task.duration!)}</ThemedText>
              </>
            )}
          </ThemedView>
          <ThemedText>{status}</ThemedText>
          <ThemedButton onPressOut={submit} className="rounded-md mb-2">
            <ThemedText className="!text-white dark:!text-black text-center">Submit</ThemedText>
          </ThemedButton>
          <ThemedButton onPressOut={() => router.back()} className="rounded-md !bg-transparent" >
            <ThemedText className="!text-dark dark:!text-white text-center">Go Back</ThemedText>
          </ThemedButton>
        </Pressable>
      </ThemedView>
    </Pressable>
  )
}
