import {dateIsEqual, month_names} from "@/lib/calendar/calendar";
import {useTaskList} from "@/lib/task/task";
import {ThemedText, ThemedView, ThemedButton} from "./ThemedComponents";
import {ScrollView, TouchableOpacity, ViewProps} from "react-native";
import {useColorScheme} from "nativewind";
import {styles} from "@/lib/style/style";
import { router } from "expo-router";

interface Props extends ViewProps{
  date: Date;
  className?: string;
}

export default function DayView({date, className, ...props}: Props) {
  const {colorScheme} = useColorScheme();
  const tasks = useTaskList(s => s.tasks).filter(t => dateIsEqual(t.date, date))
  const defaultStyle = "flex flex-row justify-between w-full aspect-3/4"
  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} {...props}>

      <ThemedView 
      className="flex items-center justify-center w-2/3 rounded-lg bg-zinc-100 dark:bg-zinc-800 aspect-square" 
      style={styles.shadow}
      >
        <ThemedText className="absolute text-sm italic top-0 grow-1">{`${month_names[date.getMonth()]} ${date.getFullYear()}`}</ThemedText>

        <ThemedButton className="flex items-center justify-center my-3 rounded-3xl aspect-square p-6">
          <ThemedText className="font-bold text-9xl">{date.getDate()}</ThemedText>
        </ThemedButton>

      </ThemedView>

    <ThemedView reset className="flex flex-col items-start justify-between w-1/3 ml-4 my-2 grow-3">
    <ThemedText className="p-0 m-0">Tasks:</ThemedText>
    <ScrollView className="h-20">
    {
      tasks.map(t => (
        <ThemedView key={t.id.toString()} className="px-4 my-2 text-xs rounded-full" style={[styles.shadow, {backgroundColor: t.color}]}>
        <ThemedText>{t.title}</ThemedText>
        </ThemedView>
      ))
    }
    </ScrollView>
    <TouchableOpacity className="self-end mr-7" onPressOut={() => router.push({
      pathname: "/tasks/[datestamp]",
      params: {
        datestamp: date.toISOString(),
      }
    })}>
      <ThemedText className="text-sm italic">Add task...</ThemedText>
    </TouchableOpacity>

    </ThemedView>

    </ThemedView>
  );
}
