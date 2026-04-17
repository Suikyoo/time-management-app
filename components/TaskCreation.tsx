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
  startTemplate?: TaskTemplate;
  durationOffset?: Duration; 
  startLock?: boolean;
  endLock?: boolean;
  timeOptional?: boolean;
  disableTime?: boolean;
  disableTitle?: boolean;
  disableDescription?: boolean;
  disableColor?: boolean;
  inputDuration?: boolean;

}
export default function TaskCreation({
  title, 
  onSubmit, 
  startTemplate,
  durationOffset=0, 
  startLock=false, 
  endLock=false, 
  timeOptional=false, 
  disableTime=false, 
  disableTitle=false,
  disableDescription=false,
  disableColor=false,
  inputDuration=false
}: Props) {
  const {colorScheme} = useColorScheme();

  //tasks here is only used to do form validation
  const tasks = useTaskTemplates(state => state.tasks).filter(t => t.visible);

  const [task, setTask] = useState<TaskTemplate>(startTemplate ||{
    id: -1,
    color: colors[0],
    title: "",
    description: "",
    timestamp: undefined,
    duration: 0,
    visible: true,
  })
  const date = new Date(Math.floor(Date.now() / (Day)) * Day + durationOffset + (task.timestamp ? getDuration(task.timestamp): 0));

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
    task.timestamp = showTime ? getTimeStamp(timeStart.getTime() % Day): undefined;
    task.duration = duration ? duration : undefined;

    await onSubmit(task);
    router.back();

  }

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
      {
        disableTitle || 
          <Form.TextField fieldName="Title" editable={!disableTitle} focusable={!disableTitle} fieldValue={task.title} onFieldSet={(s) => setTask({...task, title: s})}/>
      }
      {
        disableDescription ||
          <Form.TextField fieldName="Description" editable={!disableDescription} focusable={!disableDescription} fieldValue={task.description} onFieldSet={(s) => setTask({...task, description: s})}/>

      }
      {
        disableColor ||
          <Form.ColorField fieldName="Color" disabled={disableColor} fieldValue={task.color} onFieldSet={(c) => setTask({...task, color: c})}/>

      }
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
          <Form.TextField fieldName="Duration (minutes)" fieldValue={Math.floor(task.duration! / Minute).toString()} onFieldSet={(d) => setTask({...task, duration: Number(d) * Minute})} keyboardType="numeric"/>
      }

      <ThemedText>Duration: {durationToString(duration)}</ThemedText>
      <Form.Footer submitFunc={submit}/>
    </Form>
  )
}
