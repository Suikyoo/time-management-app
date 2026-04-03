import { ThemedView, ThemedText, ThemedInput, ThemedButton } from "@/components/ThemedComponents";
import { colors } from "@/lib/color/color";
import { Task, TaskTemplate, useTaskTemplates } from "@/lib/task/task";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {Day, Duration, durationToString, getDuration, getTimeStamp, Hour, Minute} from "@/lib/time/time";
import Form, { Status } from "@/components/Form";

interface Props {
  title: string;
  onSubmit: (t: TaskTemplate) => Promise<void>;
  durationOffset?: Duration; 
  startLock?: boolean;
  endLock?: boolean;
  timeOptional?: boolean;
  disableTime?: boolean;
  inputDuration?: boolean;

}
export default function TaskCreation({title, onSubmit, durationOffset=0, startLock=false, endLock=false, timeOptional=false, disableTime=false, inputDuration=false}: Props) {
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

  console.log(task.title);
  const date = new Date(Math.floor(Date.now() / (Day)) * Day + durationOffset);

  const [timeStart, setTimeStart] = useState(date);
  const [timeEnd, setTimeEnd] = useState(date);

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

  console.log(inputDuration)
  let duration: number = inputDuration ? task.duration! : timeEnd.getTime() - timeStart.getTime()!

  if (duration! < 0) {
    duration = 24 * Hour - duration;
  }

  useEffect(() => {
    if (showTime && !disableTime) {

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
        disableTime || (
          (timeOptional) ? 
            <Form.SwitchField fieldName="Time? " fieldValue={showTime} onFieldSet={(b) => setShowTime(b)} />
            :
            <ThemedText>Time</ThemedText>
        )
      }
      {
        disableTime || (
          showTime &&
            <ThemedView className="flex flex-row justify-evenly">
              <Form.TimeField fieldName="Start Time" disabled={!showTime || startLock} fieldValue={timeStart} onFieldSet={(d) => setTimeStart(d)} />
              <Form.TimeField fieldName="End Time" disabled={!showTime || endLock} fieldValue={timeEnd} onFieldSet={(d) => setTimeEnd(d)} />
            </ThemedView>
        )
      }
      {
        inputDuration && 
          <Form.TextField fieldName="Duration (minutes)" fieldValue={task.duration?.toString() || "0"} onFieldSet={(d) => {console.log(d); return setTask({...task, duration: Number(d) * Minute})}} keyboardType="numeric"/>
      }

      <ThemedText>Duration</ThemedText>
      <ThemedText>{durationToString(duration)}</ThemedText>
      <Form.Footer submitFunc={submit}/>
    </Form>
  )
}
