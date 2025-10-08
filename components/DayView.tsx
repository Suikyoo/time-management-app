import {dateIsEqual, month_names} from "@/lib/calendar/calendar";
import {useTaskList} from "@/lib/task/task";
import {ThemedText, ThemedView} from "./ThemedComponents";
import {ViewProps} from "react-native";
import {useColorScheme} from "nativewind";
import {styles} from "@/lib/style/style";

interface Props extends ViewProps{
  date: Date;
  className?: string;
}

export default function DayView({date, className, ...props}: Props) {
  const {colorScheme} = useColorScheme();
  const tasks = useTaskList(s => s.tasks).filter(t => dateIsEqual(t.date, date))
  const defaultStyle = "flex flex-row justify-between"
  return (
    <ThemedView className={`${defaultStyle} ${className || ""}`} {...props}>

      <ThemedView 
      className="flex items-center justify-center w-3/5 rounded-lg bg-zinc-100 dark:bg-zinc-800 aspect-square" 
      style={styles.shadow}
      >
        <ThemedText className="absolute text-sm italic top-2 grow-1">{`${month_names[date.getMonth()]} ${date.getFullYear()}`}</ThemedText>

        <ThemedView className="flex items-center justify-center my-3 bg-white rounded-3xl aspect-square">
          <ThemedText className="font-bold text-zinc-900 text-9xl">{date.getDate()}</ThemedText>
        </ThemedView>
      </ThemedView>

    <ThemedView className="w-1/3 h-full my-2 grow-3">
    <ThemedText className="p-0 m-0">Tasks:</ThemedText>
    {
      tasks.map(t => (
        <ThemedView className="ppx-4 my-2 text-xs rounded-full style={[styles.shadow, {backgroundColor: t.color}]}>
        <ThemedText>{t.title}</ThemedText>
        </ThemedView>
      ))
    }
    </ThemedView>

    </ThemedView>
  );
}
