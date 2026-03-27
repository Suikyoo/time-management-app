import { ThemedView, ThemedText, ThemedInput, ThemedButton } from "@/components/ThemedComponents";
import { colors } from "@/lib/color/color";
import { Task, TaskTemplate, useTaskTemplates } from "@/lib/task/task";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {Day, durationToString, getDuration, getTimeStamp, Hour, Minute, TimeStamp} from "@/lib/time/time";
import Form, { Status } from "@/components/Form";
import { useTasks } from "@/lib/task/task";

interface Props {
title: string;
onSubmit: (t: TaskTemplate) => Promise<void>
timeOptional?: boolean;
}
export default function TaskCreation({title, onSubmit, timeOptional=false}: Props) {
  const {colorScheme} = useColorScheme();

  //tasks here is only used to do form validation
  const tasks = useTaskTemplates(state => state.tasks).filter(t => t.visible);
  const [task, setTask] = useState<TaskTemplate>({
    id: -1,
    color: colors[0],
    title: "",
    description: "",
    timestamp: undefined,
    duration: 0,
    visible: true,
  })

  const [timeStart, setTimeStart] = useState(new Date(Math.floor(Date.now() / (Day)) * Day));
  const [timeEnd, setTimeEnd] = useState(new Date(Math.floor(Date.now() / (Day)) * Day));

  const [showTime, setShowTime] = useState(!timeOptional);

  const submit = async (status: Status, setStatus: React.Dispatch<React.SetStateAction<Status>>) => {
    if ((!task.title.length && !task.description.length) || !task.color.toString().length) {
      setStatus({color: "red", name: "unfilled"});
      return
    }
    if (tasks.find(t => t.title == task.title)) {
      setStatus({color: "red", name: "task of the same title already exists"});
      return;
    }

    await onSubmit(task);
    router.back();

  }

  const duration = timeEnd.getTime() - timeStart.getTime()

  useEffect(() => {
    if (showTime) {

      setTask({...task, timestamp: getTimeStamp(timeStart.getTime() % Day), duration: duration});
    }

  }, [timeStart, timeEnd, showTime]);
  
  return (
    <Form>
      <Form.Header>{title}</Form.Header>
      <Form.TextField fieldName="Title" fieldValue={task.title} onFieldSet={(s) => setTask({...task, title: s})}/>
      <Form.TextField fieldName="Description" fieldValue={task.description} onFieldSet={(s) => setTask({...task, description: s})}/>
      <Form.ColorField fieldName="Color" fieldValue={task.color} onFieldSet={(c) => setTask({...task, color: c})}/>
      {
        timeOptional ? 
          <Form.SwitchField fieldName="Time? " fieldValue={showTime} onFieldSet={(b) => setShowTime(b)} />
          :
          <ThemedText>Time</ThemedText>
      }
      {
        showTime &&
          <ThemedView className="flex flex-row justify-evenly">
            <Form.TimeField fieldName="Start Time" disabled={!showTime} fieldValue={timeStart} onFieldSet={(d) => {console.log(d); return setTimeStart(d)}} />
            <Form.TimeField fieldName="End Time" disabled={!showTime} fieldValue={timeEnd} onFieldSet={(d) => setTimeEnd(d)} />
          </ThemedView>
      }
      <ThemedText>Duration</ThemedText>
      <ThemedText>{durationToString(duration)}</ThemedText>
      <Form.Footer submitFunc={submit}/>
    </Form>
  )
}
