import TaskPalette from "@/components/TaskPalette";
import { FooterPlusButton, ThemedButton, ThemedText, ThemedView } from "@/components/ThemedComponents";
import { colors } from "@/lib/color/color";
import { useWeeklyTasks, useWeeklyTaskTarget, WeeklyTask } from "@/lib/task/task";
import { Duration, getDuration, getTimeStamp, getTimeStampfromString, Hour, Minute, TimeStamp, timeStampAfter, timeStampToString } from "@/lib/time/time";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { FlexStyle, StyleProp, TouchableOpacity, ScrollView } from "react-native";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

interface CellProp { name: string;
  className?: string;
  textInherit?: string;
  touchable?: boolean;
  style?: ViewStyle;
}

function GCF(nums: number[]): number {
  function gcf(a: number, b: number): number {
    if (b == 0) { return a;
    }

    return gcf(b, a % b);
  }

  if (nums.length == 0) {
    return 0;
  }

  if (nums.length == 1) {
    return nums[0];
  }

  const [first, ...rest] = nums;
  return gcf(first, GCF(rest));
}

function getTimeColumn(start: TimeStamp, offset: Duration, iter_amt: number): string[] {
  const res: string[] = [];

  for (let i=0; i<iter_amt; i++) {
    const t = timeStampAfter(start, offset * i);
    res.push(timeStampToString(t));
  }
  return res;
}

export default function WeekView() {

  const {colorScheme} = useColorScheme();

  const [colNum, setColNum] = useState(8);
  const [rowSize, setRowSize] = useState(50);


  const weeklyTasks: WeeklyTask[] = useWeeklyTasks(s => s.tasks);

  const timedWeeklyTasks = weeklyTasks.filter(t => t.timestamp);
  //cubify results to 30 min intervals
  const timeStampDurations = timedWeeklyTasks.map(t => Math.floor(getDuration(t.timestamp!) / (30 * Minute)) * (30 * Minute));

  const minTime = 0 //Math.min(...timeStampDurations);
  const maxTime = 24 * Hour //Math.max(...timeStampDurations);
  const timeOffset = 1 * Hour //GCF(timeStampDurations);
  const timeColumn = getTimeColumn(getTimeStamp(minTime), timeOffset, Math.floor(maxTime / timeOffset));

  const sizeStyle: ViewStyle = {height: rowSize};

  function Cell({name, touchable, className, textInherit, style}: CellProp) { 
    return <ThemedView textInherit={textInherit} className={"" + className || ""} style={{...sizeStyle, ...style}}>
      <ThemedText className="text-center text-inherit">{name}</ThemedText>
    </ThemedView>
  }

  function ColumnNames() {
    return (
      <ThemedView className="flex flex-row border-r-2 w-full">
        <Cell name="Time" className="w-20 flex-2"/>

        {
          weekdays.map((d, index) => (
            <Cell key={index} name={d.substring(0,3)} className="box-border px-2 rounded-md flex-1" />
          ))
        }

      </ThemedView>
    )

  }

  function RowNames() {
    return (
      <ThemedView className="flex flex-col justify-around">
        {
          timeColumn.map((c, index) => (
              <Cell key={index} name={c} className="w-20"/>
          ))
        }
      </ThemedView>

    )
  }

  function ColumnGrid({dayIndex, taskDisplay=false, className}: {dayIndex: number, className: string, taskDisplay?: boolean}) {
    const tasks = taskDisplay ? weeklyTasks.filter(t => (t.day == dayIndex)) : [];
    const target = useWeeklyTaskTarget(s => s.task);
    const db = useSQLiteContext();
    const addTask = useWeeklyTasks(s => s.createTask);

    //always have spaces when doing class concatenation for it to concatenate correctly
    return (
      <ThemedView className={"flex-1 flex-col h-full w-[14.29%] relative bg-zinc-700 " + (className || "")}>

        {
          timeColumn.map((t, index) => (


            <TouchableOpacity key={index} onPressOut={() => {
              if (target) {
                addTask(db, {...target, day: dayIndex, template_id: target.id, timestamp: getTimeStampfromString(t)});
                return;
              }

              router.push({
                pathname: "/weekly_tasks/[day]/[timestamp]",
                params: {
                  day: dayIndex.toString(),
                  timestamp: t,
                }
              })}}
            >
              {
                (index == 0) ? 
                  <Cell name="" className="p-0 border-dashed border-slate-800 bg-zinc-950 rounded-sm"/>
                  :
                  <Cell name="" className="p-0 border-t-0 border-dashed border-slate-800 bg-zinc-950 rounded-sm"/>
              }
            </TouchableOpacity>

          ))
        }
        {

          tasks.map((t, index) => {
            const timeStampDuration: number | undefined = t.timestamp && getDuration(t.timestamp); 

            let loc: number = 0;
            let height: number = 5;

            if (timeStampDuration != undefined) {
              loc = ((timeStampDuration - minTime) / timeOffset) * rowSize;
              if (t.duration) {
                height = rowSize * (t.duration / timeOffset);
              }
            }

            return (
              <Cell key={index} name={t.title} className="w-full box-border px-2 rounded-md" textInherit="color-black" style={{position: "absolute", top: loc, height: height, backgroundColor: t.color}}/>
            )
          })
        }
      </ThemedView>
    )
  }
  return (
    <ThemedView className="h-full w-full bg-zinc-100 dark:bg-zinc-950 box-border p-2" reset>

      <ThemedView reset className="flex flex-col my-safe justify-start w-full">

        <ThemedView className="flex flex-col w-full">
          <ColumnNames />
          <ScrollView style={{height: 400}}>
          <ThemedView className="flex flex-row w-full justify-between overflow-scroll">
            <RowNames />
            <ThemedView className="flex-1 flex-row border-0 border-dashed border-slate-800 overflow-hidden relative">
              {
                weekdays.map( (d, index) => {
                  return (index == 0) ? 
                    <ColumnGrid key={index} dayIndex={index} taskDisplay className=" border-dashed border-slate-800 flex-1"/>
                    :
                    <ColumnGrid key={index} dayIndex={index} taskDisplay className=" border-0 border-dashed border-slate-800 flex-1 "/>

                })

              }
            </ThemedView>
          </ThemedView>
          </ScrollView>
        </ThemedView>

      </ThemedView>
        <TaskPalette.WeeklyTasks className="w-full my-5 bg-white rounded-lg dark:bg-zinc-900"/>

    </ThemedView>
  )
}
