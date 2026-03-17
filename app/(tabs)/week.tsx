import { ThemedButton, ThemedText, ThemedView } from "@/components/ThemedComponents";
import { useWeeklyTasks, WeeklyTask } from "@/lib/task/task";
import { Duration, getDuration, getTimeStamp, getTimeStampfromString, Hour, Minute, TimeStamp, timeStampAfter, timeStampToString } from "@/lib/time/time";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { FlexStyle, StyleProp } from "react-native";
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

interface CellProp {
  name: string;
  className?: string;
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


  const weeklyTasks: WeeklyTask[] = [
    {id: 0, template_id: -1, description: "ehe", title: "task1", color: "red", visible: false, day: 0, timestamp: getTimeStampfromString("12:00 PM"), duration: 1 * Hour},
    {id: 1, template_id: -1, description: "ehe", title: "task2", color: "blue", visible: false, day: 2, timestamp: getTimeStampfromString("10:00 AM"), duration: 4 * Hour},
    {id: 1, template_id: -1, description: "ehe", title: "task3", color: "blue", visible: false, day: 4, timestamp: getTimeStampfromString("6:00 PM"), duration: 1 * Hour},
  ]

  const timedWeeklyTasks = weeklyTasks.filter(t => t.timestamp);
  //cubify results to 30 min intervals
  const timeStampDurations = timedWeeklyTasks.map(t => Math.floor(getDuration(t.timestamp!) / (30 * Minute)) * (30 * Minute));

  const minTime = Math.min(...timeStampDurations);
  const maxTime = Math.max(...timeStampDurations);
  const timeOffset = GCF(timeStampDurations);
  const timeColumn = getTimeColumn(getTimeStamp(minTime), timeOffset, Math.floor(maxTime / timeOffset));

  const sizeStyle: ViewStyle = {height: rowSize};

  function Cell({name, className, style}: CellProp) { 
    return <ThemedView className={"px-2 " + className || ""} style={{...sizeStyle, ...style}}>
      <ThemedText className="text-center">{name}</ThemedText>
    </ThemedView>
  }

  return (
    <ThemedView className="h-full w-full bg-zinc-100 dark:bg-zinc-950 box-border p-2" reset>

      <ThemedView reset className="flex flex-row my-safe justify-start w-full">

        <ThemedView className="flex flex-col border-r-2 border-dashed border-slate-800 rounded-md">
          <Cell name="Time"/>
          {
            timeColumn.map((c, index) => (
              <ThemedView key={index} className="flex flex-row justify-start relative">
                <Cell name={c} className=""/>
                <ThemedView className="absolute w-screen border-t-2 border-dashed border-slate-800"></ThemedView>
              </ThemedView>
            ))

          }

        </ThemedView>

      {

          weekdays.map((d, index) => {
            const tasks = weeklyTasks.filter(t => (t.day == index));

            return (
              <ThemedView key={index} className="flex flex-col border-r-2 border-dashed border-slate-800 rounded-md">
                <Cell name={d.substring(0, 3)}/>
                {

                  tasks.map((t, index) => {
                    const timeStampDuration: number | undefined = t.timestamp && getDuration(t.timestamp); 

                    let loc: number = 0;
                    let height: number = 5;

                    if (timeStampDuration) {
                      loc = ((timeStampDuration - minTime) / timeOffset) * rowSize;
                      if (t.duration) {
                        height = rowSize * (t.duration / timeOffset);
                      }
                    }

                    return (
                        <Cell key={index} name={t.title} className="box-border px-2 rounded-md" style={{top: loc, height: height, backgroundColor: t.color}}/>
                    )
                  })

                }
              </ThemedView>
            )})

        }

      </ThemedView>

      <ThemedButton onPressOut={() => router.push("/tasks/template")} className="w-12 aspect-square absolute right-safe-or-4 bottom-safe-or-10 rounded-xl">
        <ThemedText>+</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}
